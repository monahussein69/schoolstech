/* Setup general page controller */
angular.module('MetronicApp').controller('AddTaskController',
    function (CommonService,manageTaskStatusService,$stateParams,$moment,$rootScope, $scope, $http, $window,taskService, localStorageService,toastr,CommonService,manageEmployeeService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
            var schoolId = 0;
            if (userType == 2 || userType == 3) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }



        }

        var array = [];
        array[0] = 'الاحد';
        array[1] = 'الاثنين';
        array[2] = 'الثلاثاء';
        array[3] = 'الاربعاء';
        array[4] = 'الخميس';
        array[5] = 'الجمعة';
        array[6] = 'السبت';
        var CurrentDate = $moment().format('MM/DD/YYYY');
        var CurrentDay = array[$moment().day()];

    var model={
        taskObj:{},
        supervisor_emp : 0,
        popObj:{},
        CurrentDay:CurrentDay,
        employees : [],
        getDay:getDay,
        saveTask:saveTask,
        schoolId:schoolId,
        getTask:getTask,
        added:0,
        taskStatus:[]
    }

    $scope.model = model;
    model.taskObj.CurrentDate = CurrentDate;
    model.taskObj.Issued_Date = CurrentDate;
    model.taskObj.Issued_By = userId;
    model.taskObj.id = 0;

        model.getTask();

    function getTask(){
        if ($stateParams.taskId) {
            taskService.getTask($stateParams.taskId,function(result){
                model.taskObj = result[0];
                console.log(result[0]);
                model.supervisor_emp = result[0].Suppervisor_Emp_id;
                model.added = 1;
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    model.employees = employees;
                    $scope.$apply();
                });
                manageTaskStatusService.getAllTaskStatus().then(function (taskStatus) {
                    model.taskStatus = taskStatus;
                    $scope.$apply();
                });
                model.getDay();
            });
        }else{
            manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                model.employees = employees;
                $scope.$apply();
            });

            manageTaskStatusService.getAllTaskStatus().then(function (taskStatus) {
                model.taskStatus = taskStatus;
                $scope.$apply();
            });
        }
    }

    function getDay(){
        if(model.taskObj.CurrentDate){
            model.CurrentDay = array[$moment(model.taskObj.CurrentDate).day()];
        }
    }


    function saveTask(){
        model.taskObj.school_id = model.schoolId;
        if (Object.keys(model.taskObj).length) {
            taskService.saveTaskData(model.taskObj, function (response) {

                if (response.success){
                    //$window.location.href = '#/Tasks';
                    console.log(response.result.Suppervisor_Emp_id);
                    console.log(model.supervisor_emp);
                    if(response.added || (response.updated && (model.taskObj.Suppervisor_Emp_id != model.supervisor_emp) )){
                        //CommonService.sendNotification('تم تعيينك كمشرف على مهمه',model.taskObj.Suppervisor_Emp_id);
                    }
                    if(response.updated && (model.taskObj.Suppervisor_Emp_id != model.supervisor_emp)){
                        //CommonService.sendNotification('تم الغاء اشرافك على مهمه',model.supervisor_emp);
                    }
                    toastr.success(response.msg);
                    model.added = 1;
                    var date = model.taskObj.CurrentDate;
                    //model.taskObj = response.result;
                    model.taskObj.CurrentDate = date;
                } else {
                    toastr.error(response.msg);
                }
            });

        }
    }

    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
});


angular.module('MetronicApp').controller('ManageTaskController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$moment,$rootScope, $scope, $http, $window,taskService, localStorageService,toastr) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
            var schoolId = 0;
            if (userType == 2 || userType == 3) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }

        var model = {
            tasks:[],
            deleteTask:deleteTask,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                if (userType == 2){
                    taskService.getAllTasks(schoolId).then(function (tasks) {
                        model.tasks = tasks;
                        defer.resolve(tasks);
                        console.log(tasks);
                        $scope.$apply();
                    });
                }
                if (userType == 3){
                    var empId = userObject[0].employeeData[0].id;
                    taskService.getTaskByEmpId(empId).then(function (tasks) {
                        model.tasks = tasks;
                        defer.resolve(tasks);
                        console.log(tasks);
                        $scope.$apply();
                    });
                }

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Task_Tittle').withTitle(' اسم المهمه'),
                DTColumnBuilder.newColumn('supervisor_name').withTitle(' مشرف المهمه'),
                DTColumnBuilder.newColumn('status_name').withTitle('حالة المهمه'),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };
        $scope.model = model;

        function deleteTask(taskId) {
            taskService.deleteTask(taskId, function (response) {
                if (response.success) {
                    var index = model.tasks.findIndex(function (task) {
                        return task.id == taskId
                    });
                    model.tasks.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {

            return '<div class="btn-group">'+
                '<button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> العمليات'+
                '<i class="fa fa-angle-down"></i>'+
                '</button>'+
                '<ul class="dropdown-menu pull-right">'+
                '<li>'+
                '<a ui-sref="Master.addTask({taskId:{{'+data.id+'}}})">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.subTasks({taskId:{{'+data.id+'}}})">'+
                '<i class="icon-pencil"></i>&nbsp;  فريق العمل </a>'+
                '</li>'+

                '<li class="divider"> </li>'+
                ' <li>'+
                '<a href="javascript:;" ng-confirm-click="هل تريد تأكيد حذف المهمه ؟  " confirmed-click="model.deleteTask('+data.id+')">'+
                '<i class="fa fa-trash"></i>&nbsp; حذف </a>'+
                '</li>'+

                '</ul>'+
                '</div>';

        }






        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    }).directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);


angular.module('MetronicApp').controller('TaskMembersController',
    function (CommonService,manageTaskStatusService,manageEmployeeService,$stateParams,$rootScope, $scope, $http, $window,subTaskService, localStorageService,toastr) {

        var taskId = $stateParams.taskId;
        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
            var schoolId = 0;
            if (userType == 2 || userType == 3) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }

        var model={
            subTaskObj:{},
            employees : [],
            member_id:0,
            savesubTask:savesubTask,
            getsubTask:getsubTask,
            taskId:taskId,
            taskStatus:[]
        }

        $scope.model = model;


        model.getsubTask();

        function getsubTask(){
            if ($stateParams.subTaskId) {
                subTaskService.getSubTask($stateParams.subTaskId,function(result){
                    model.subTaskObj = result;
                    console.log(result);
                    model.member_id = result.Member_Emp_id;
                    manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                        model.employees = employees;
                        $scope.$apply();
                    });

                    manageTaskStatusService.getAllTaskStatus().then(function (taskStatus) {
                        model.taskStatus = taskStatus;
                        $scope.$apply();
                    });
                });
            }else{
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    model.employees = employees;
                    $scope.$apply();
                });

                manageTaskStatusService.getAllTaskStatus().then(function (taskStatus) {
                    model.taskStatus = taskStatus;
                    $scope.$apply();
                });
            }
        }


		
        function savesubTask(){

            if (Object.keys(model.subTaskObj).length) {
                model.subTaskObj.Task_id = parseInt(model.taskId);
				console.log(model.subTaskObj);
                subTaskService.saveSubTaskData(model.subTaskObj, function (response) {
                     console.log(model.subTaskObj.Member_Emp_id);
                     console.log(model.member_id);
                    if (response.success) {
                        if(response.added || (response.updated && (model.subTaskObj.Member_Emp_id != model.member_id) )){
                           // CommonService.sendNotification('تمت اضافه مهمه لك',model.subTaskObj.Member_Emp_id);
                        }
                        if(response.updated && (model.subTaskObj.Member_Emp_id != model.member_id)){
                            //CommonService.sendNotification('تم الغاءك من مهمه',model.member_id);
                        }

                        $window.location.href = '#/subTasks/'+model.taskId;
                        toastr.success(response.msg);


                    } else {
                        toastr.error(response.msg);
                    }
                });

            }
        }


        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    });


angular.module('MetronicApp').controller('ManageSubTaskController',
    function ($stateParams,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$moment,$uibModal,$rootScope, $scope, $http, $window,subTaskService,taskService, localStorageService,toastr) {

        var taskId = $stateParams.taskId;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
        }
        if(!taskId){
            taskId = 0;
        }

        var model = {
            tasks:[],
			userType:userType,
            taskId:taskId,
            mainTask:[],
            viewStudentsTask:viewStudentsTask,
            deleteSubTask:deleteSubTask,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                if(taskId){
                    taskService.getTask(taskId,function (task) {
                        model.mainTask = task[0];
                        if (userType == 2 || (model.mainTask.Suppervisor_Emp_id == userObject[0].employeeData[0].id )){
                            subTaskService.getAllSubTasks(taskId).then(function (tasks) {
                                model.tasks = tasks;
                                defer.resolve(tasks);
                                $scope.$apply();
                            });
                        }

                    });

                }else{
                    if (userType == 3) {
                        var empId = userObject[0].employeeData[0].id;
                        subTaskService.getSubTaskByEmpId(empId).then(function (tasks) {
                            model.tasks = tasks;
                            defer.resolve(tasks);
                            console.log(tasks);
                            $scope.$apply();
                        });
                    }
                }


                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('SUBTask_Tittle').withTitle(' اسم المهمه'),
                DTColumnBuilder.newColumn('employee_task').withTitle('اسم الموظف'),
                DTColumnBuilder.newColumn('status_name').withTitle('حالة المهمه'),
                DTColumnBuilder.newColumn(null).withTitle('طلاب المهمه').notSortable().renderWith(stdTaskHtml),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };
        $scope.model = model;




        function deleteSubTask(subTaskId) {
            subTaskService.deleteSubTask(subTaskId, function (response) {
                if (response.success) {
                    var index = model.tasks.findIndex(function (task) {
                        return task.id == subTaskId
                    });
                    model.tasks.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function stdTaskHtml(data, type, full, meta) {
            return ''+
                '<a href="javascript:;" ng-click="model.viewStudentsTask('+data.id+')">'+
                '&nbsp; عرض الطلاب </a>';

        }

        function viewStudentsTask(subTaskId) {
            var dialogInst = $uibModal.open({
                templateUrl: 'views/tasks/viewStudentsTask.html',
                controller: 'StudentTaskDialogCtrl',
                size: 'md',
                resolve: {
                    subTaskId: function () {
                        return subTaskId;
                    },

                }
            });
            dialogInst.result.then(function (result) {
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }

        function actionsHtml(data, type, full, meta) {

            return '<div class="btn-group">'+
                '<button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> العمليات'+
                '<i class="fa fa-angle-down"></i>'+
                '</button>'+
                '<ul class="dropdown-menu pull-right">'+
                '<li>'+
                '<a ui-sref="Master.addTaskMember({taskId:{{'+data.Task_id+'}},subTaskId:{{'+data.id+'}} })">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.addTaskStudents({subTaskId:{{'+data.id+'}}, taskId:{{'+data.Task_id+'}} })">'+
                '<i class="icon-pencil"></i>&nbsp;  اضافه طلاب لفريق العمل </a>'+
                '</li>'+

                '<li class="divider"> </li>'+
                ' <li>'+
                '<a href="javascript:;" ng-confirm-click="هل تريد تأكيد حذف المهمه ؟  " confirmed-click="model.deleteSubTask('+data.id+')">'+
                '<i class="fa fa-trash"></i>&nbsp; حذف </a>'+
                '</li>'+

                '</ul>'+
                '</div>';

        }






        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    }).directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);



angular.module('MetronicApp').controller('addTaskStudentsController',
    function ($stateParams,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$moment,$rootScope, $scope, $http, $window,StudentsService,studentTaskService, localStorageService,toastr) {

        var subTaskId = $stateParams.subTaskId;
        var taskId = $stateParams.taskId;

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject) {
            var userType = userObject[0].userType;
            schoolId = userObject[0].schoolId;
        }

        var titleHtml = '<input type="checkbox" ng-model="model.selectAll" ng-click="model.toggleAll(model.selectAll, model.selected)">';

        var model = {
            students:[],
            subTaskId:subTaskId,
            taskId:taskId,
            assignStudentsToTask:assignStudentsToTask,
            selected : {},
            selectAll : false,
            toggleAll : toggleAll,
            toggleOne : toggleOne,
            filterType:'all',
            getStudentsBasedGroup:getStudentsBasedGroup,
            ids:[],
            groups : [],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                    StudentsService.getAllStudents(schoolId).then(function (students) {
                        model.students = students;
                        defer.resolve(students);
                        $scope.$apply();
                    });



                return defer.promise
            }).withOption('createdRow', createdRow)
                .withOption('headerCallback', function(header) {
                    $compile(angular.element(header).contents())($scope);
                }),
            columns: [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                    .renderWith(function(data, type, full, meta) {
                        model.selected[full.student_id] = false;
                        return '<input type="checkbox" ng-model="model.selected[' + data.student_id + ']" ng-click="model.toggleOne(date.selected)">';
                    }),
                DTColumnBuilder.newColumn('name').withTitle('اسم الطالب')

            ],
            dtInstance: {},
        };

        $scope.model = model;

        StudentsService.getAllStudentsGroups(schoolId).then(function (groups) {
            model.groups = groups;
            $scope.$apply();
        });

        function getStudentsBasedGroup(){
            var group = model.filterType;
            var defer = $q.defer();
            StudentsService.getAllStudentsByGroup(group,schoolId).then(function (students) {
                model.selected = [];
                model.students = students;
                defer.resolve(students);
                model.dtInstance.changeData(defer.promise);
                $scope.$apply();
            });
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function toggleAll (selectAll, selectedItems) {
            console.log('in click');
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }
        function toggleOne (selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        model.selectAll = false;
                        return;
                    }
                }
            }
        }

        function assignStudentsToTask(){

            var ids = model.selected;
            console.log(ids);
            var results = [];
            if(Object.keys(ids).length > 0) {
                var requests = Object.keys(ids).map(function (key, item) {
                    if (ids[key]) {
                        return new Promise(function (resolve) {
                            var stdTaskObj = {};
                            stdTaskObj.SubTask_Id = model.subTaskId;
                            stdTaskObj.Student_Id = key;

                            studentTaskService.saveStudentsTask(stdTaskObj, function (result) {
                                if (result.success) {
                                    results.push(1);
                                }
                                resolve(result);
                            });
                        });
                    }
                });

                Promise.all(requests).then(function (result) {
                    if (results.includes(1)) {
                        toastr.success( 'تم تعيين الطلاب');
                        $window.location.href = '#/subTasks/'+model.taskId;
                    }else{
                        toastr.error('الطالب موجود مسبقا');
                    }
                    //callback(response);
                });
            }else{
                toastr.error('الرجاء اختيار الطلاب');
            }


        }


            $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();
            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    });


angular.module('MetronicApp').controller('StudentTaskDialogCtrl', function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,toastr, studentTaskService, $moment, $scope, $uibModalInstance, subTaskId, $log) {


    var model = {
        studentsTask : [],
        deleteStudentTask:deleteStudentTask,
        options: DTOptionsBuilder.fromFnPromise(function () {
            var defer = $q.defer();
            studentTaskService.getAllStudentTask(subTaskId).then(function (students) {
                model.studentsTask = students;
                defer.resolve(students);
                $scope.$apply();
            });


            return defer.promise
        }).withOption('createdRow', createdRow),
        columns: [

            DTColumnBuilder.newColumn('student_name').withTitle('اسم الطالب'),
            DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                .renderWith(actionsHtml)

        ],
        dtInstance: {},
    }

    $scope.model = model;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {

        return ''+
            '<a href="javascript:;" ng-confirm-click="هل تريد تأكيد حذف الطالب ؟  " confirmed-click="model.deleteStudentTask('+data.Id+')">'+
            '<i class="fa fa-trash"></i>&nbsp; حذف </a>';

    }

    function deleteStudentTask(id){
        studentTaskService.deleteStudentTask(id, function (response) {
            if (response.success) {
                model.dtInstance.reloadData();

                toastr.success(response.msg);
            } else {
                toastr.error(response.msg);
            }

        });
    }

});