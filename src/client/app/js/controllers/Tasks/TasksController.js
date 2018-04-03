/* Setup general page controller */
angular.module('MetronicApp').controller('AddTaskController',
    function ($stateParams,$moment,$rootScope, $scope, $http, $window,taskService, localStorageService,toastr,CommonService,manageEmployeeService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
            var schoolId = 0;
            if (userType == 2) {
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
        popObj:{},
        CurrentDay:CurrentDay,
        employees : [],
        getDay:getDay,
        saveTask:saveTask,
        schoolId:schoolId,
        getTask:getTask
    }

    $scope.model = model;
    model.taskObj.CurrentDate = CurrentDate;
    model.taskObj.Issued_Date = CurrentDate;

        model.getTask();

    function getTask(){
        if ($stateParams.taskId) {
            taskService.getTask($stateParams.taskId,function(result){
                model.taskObj = result;
                console.log('task');
                console.log(model.taskObj);
                console.log('model.taskObj.Suppervisor_Emp_id');
                console.log(model.taskObj.Suppervisor_Emp_id);
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    model.employees = employees;
                    $scope.$apply();
                });
                model.getDay();
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

                if (response.success) {
                    $window.location.href = '#/Tasks';
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


angular.module('MetronicApp').controller('ManageTaskController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$moment,$rootScope, $scope, $http, $window,taskService, localStorageService,toastr) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
            var schoolId = 0;
            if (userType == 2) {
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

                taskService.getAllTasks().then(function (tasks) {
                    model.tasks = tasks;
                    defer.resolve(tasks);
                    console.log(tasks);
                    $scope.$apply();
                });
                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Task_Tittle').withTitle(' اسم المهمه'),
                DTColumnBuilder.newColumn('supervisor_name').withTitle(' مشرف المهمه'),
                DTColumnBuilder.newColumn('Task_Staus').withTitle('حالة المهمه'),
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
                '<a ui-sref="#">'+
                '<i class="icon-pencil"></i>&nbsp; تشكيل فريق العمل </a>'+
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