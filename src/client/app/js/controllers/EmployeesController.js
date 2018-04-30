angular.module('MetronicApp').controller('EmployeesConfigController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr) {


    $scope.enterValidation = function(){
        return true;
    };

    $scope.exitValidation = function(){
        return true;
    };
//example using context object
    $scope.exitValidation = function(context){
        return context.firstName === "Jacob";
    }
//example using promises
    $scope.exitValidation = function(){
        var d = $q.defer()
        $timeout(function(){
            return d.resolve(true);
        }, 2000);
        return d.promise;
    }

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});


angular.module('MetronicApp').controller('ManageEmployeesController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$rootScope, $scope, $http, $stateParams, $window, localStorageService, manageEmployeeService, Upload, toastr,CommonService) {

    var schoolId = 0;
    var config_step = -1;
    var config = false;
    var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
                current_school_data = userObject[0].schoolData;
            } else {
                schoolId = $stateParams.schoolId;
            }
            config = userObject[0].config_flag;
        }



    var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteEmp: deleteEmp,
            schoolId: schoolId,
            ActivateEmployee:ActivateEmployee,
            DeActivateEmployee:DeActivateEmployee,
            nextStep:nextStep,
            config:config,
            employees : [],
            config_step : config_step,
			success : '',
			error:'',
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    defer.resolve(employees);
                    model.employees = employees;
                });

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('name').withTitle(' الاسم'),
                DTColumnBuilder.newColumn('job_no').withTitle(' الرقم الوظيفي'),
                DTColumnBuilder.newColumn('job_title_name').withTitle('المسمى الوظيفي'),
                DTColumnBuilder.newColumn('address').withTitle(' العنوان'),
                DTColumnBuilder.newColumn('phone1').withTitle(' رقم الهاتف'),
                DTColumnBuilder.newColumn('mobile').withTitle(' رقم الجوال'),
                DTColumnBuilder.newColumn('email').withTitle(' البريد الالكتروني'),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };
        $scope.model = model;

        CommonService.currentStep(schoolId,function(result){
            model.config_step = result;
        });

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
                '<a ui-sref="Master.AddEditEmployee({empId:{{'+data.id+'}},schoolId:{{'+data.school_id+'}}})">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>'+
            '</li>'+
            '<li ng-if="'+data.is_active+' != 1">'+
                '<a href="javascript:;" ng-click="model.ActivateEmployee('+data.id+')">'+
                '<i class="fa fa-user-plus"></i> تفعيل </a>'+
            '</li>'+
            '<li ng-if="'+data.is_active +'== 1">'+
                '<a href="javascript:;" ng-click="model.DeActivateEmployee('+data.id+')">'+
                '<i class="fa fa-user-times"></i>&nbsp; الغاء التفعيل </a>'+
            '</li>'+
            '<li class="divider"> </li>'+
             ' <li>'+
                '<a href="javascript:;" ng-confirm-click="هل تريد تأكيد حذف الموظف ؟  " confirmed-click="model.deleteEmp('+data.id+')">'+
                '<i class="fa fa-trash"></i>&nbsp; حذف </a>'+
            '</li>'+
                '<li>'+
                '<a ui-sref="Master.employeeLateRecord({employeeId:{{'+data.id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل التأخير </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.employeeAbsentRecord({employeeId:{{'+data.id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل الغياب </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.employeeExcuseRecord({employeeId:{{'+data.id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل الاستئذان </a>'+
                '</li>'+
            '</ul>'+
                '</div>';


        }





        $scope.model.schoolId = schoolId;

        CommonService.checkPage(schoolId);





        function ActivateEmployee(empId){
            manageEmployeeService.ActivateEmployee(empId, function (response) {
                if (response.success) {
                    manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(employees, resetPaging);
                    });

                    var index = $scope.model.employees.findIndex(function (employee) {
                        return employee.id == empId
                    });
                    $scope.model.employees[index].is_active = 1;
                    toastr.success(response.msg);
                } else {
                    toastr.error(response.msg);
                }
            });
        }

        function DeActivateEmployee(empId){
            manageEmployeeService.DeActivateEmployee(empId, function (response) {
                if (response.success) {
                    manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(employees, resetPaging);
                    });
                    var index = $scope.model.employees.findIndex(function (employee) {
                        return employee.id == empId
                    });
                    $scope.model.employees[index].is_active = 0;
                    toastr.success(response.msg);
                } else {
                    toastr.error(response.msg);
                }
            });
        }


        function deleteEmp(empId) {
            manageEmployeeService.deleteEmpData(empId, function (response) {
                if (response.success) {
                    manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(employees, resetPaging);
                    });
                    var index = $scope.model.employees.findIndex(function (employee) {
                        return employee.id == empId
                    });
                    $scope.model.employees.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }



        function doUpload() {

            model.upload($scope.file).then(function(employees){
                var resetPaging = true;
                model.dtInstance.reloadData(employees, resetPaging);
            });

        };


        function nextStep(url){
            CommonService.nextStep(schoolId,function(result){
                $window.location.href = url;
            });
        }

        function upload(file) {

            var userObject = localStorageService.get('UserObject');
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
            return new Promise(function (resolve, reject) {
                Upload.upload({
                    url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                    data: {
                        file: file,
                        type: 'employee',
                        schoolId: schoolId
                    } //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    console.log('res:'+resp.data);
                    if (resp.data.status) { //validate success
                        //toastr.success(resp.data.msg);
                        model.success = resp.data.msg;
						$scope.$apply();
                    } else {
                        //toastr.error(resp.data.msg);
						model.error = resp.data.msg;
						$scope.$apply();
                    }
                }, function (resp) { //catch error
                    toastr.error('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    model.progress = progressPercentage; // capture upload progress

                    manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                        $scope.file = '';
                        resolve(employees);
                    });

                });
            });


        };

        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    }).directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])
;


angular.module('MetronicApp').controller('ManageEmployeeController', function (CommonService,$stateParams, $rootScope, $scope, $http, $window, localStorageService, manageEmployeeService, toastr, manageJobTitleService) {


    var model = {
        empDataObj: {},
        saveEmpData: saveEmpData,
        error: null,
        job_titles: {}
    };


    manageJobTitleService.getJobTitles(function (response) {
        model.job_titles = response;
    });

    $scope.model = model;

    var userObject = localStorageService.get('UserObject');
    var userType = userObject[0].userType;
    var schoolId = 0;
    if (userType == 2) {
        schoolId = userObject[0].schoolId;
    } else {
        schoolId = $stateParams.schoolId;
    }

    model.empDataObj.schoolId = schoolId;
    CommonService.checkPage(schoolId);
    if ($stateParams.empId) {
        model.empDataObj.id = $stateParams.empId;
        manageEmployeeService.getEmpData($stateParams.empId, function (response) {
            model.empDataObj.identity_no = response[0].identity_no;
            model.empDataObj.id_date = response[0].id_date;
            model.empDataObj.school_id = response[0].school_id;
            model.empDataObj.name = response[0].name;
            model.empDataObj.jobtitle_id = response[0].jobtitle_id;
            model.empDataObj.nationality = response[0].nationality;
            model.empDataObj.birthdate = response[0].birthdate;
            model.empDataObj.birth_place = response[0].birth_place;
            model.empDataObj.educational_level = response[0].educational_level;
            model.empDataObj.major = response[0].major;
            model.empDataObj.graduate_year = response[0].graduate_year;
            model.empDataObj.job_no = response[0].job_no;
            model.empDataObj.ministry_start_date = response[0].ministry_start_date;
            model.empDataObj.school_start_date = response[0].school_start_date;
            model.empDataObj.current_position_date = response[0].current_position_date;
            model.empDataObj.degree = response[0].degree;
            model.empDataObj.address = response[0].address;
            model.empDataObj.phone1 = response[0].phone1;
            model.empDataObj.phone2 = response[0].phone2;
            model.empDataObj.mobile = response[0].mobile;
            model.empDataObj.email = response[0].email;
            model.empDataObj.postal_code = response[0].postal_code;
            model.empDataObj.lectures_qouta = response[0].lectures_qouta;
            model.empDataObj.kids = response[0].kids;
            model.empDataObj.kids_under6 = response[0].kids_under6;
            model.empDataObj.kids_under24 = response[0].kids_under24;
            model.empDataObj.kids_over24 = response[0].kids_over24;
            model.empDataObj.notes = response[0].notes;
            model.empDataObj.photo_file = response[0].photo_file;

        });
    }

    function saveEmpData() {
        if (Object.keys(model.empDataObj).length) {
            manageEmployeeService.saveEmpData(model.empDataObj, function (response) {

                if (response.success) {
                    //model.success = response.msg;
                    $window.location.href = '#/manageEmployees/';
                    toastr.success(response.msg);
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });

        }

    }


    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
}).filter('isValidObject', function () {
    return function (obj) {
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
});


angular.module('MetronicApp').controller('ManageLeader&AgentsController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageEmployeeService,CommonService, toastr) {


    var model = {
        agentsObj:{},
        saveLeadersData:saveLeadersData,
        config:false,
        added:0,
        nextStep:nextStep,
        config_step:-1,
    };

    $scope.model = model;

    var userObject = localStorageService.get('UserObject');
    if(userObject){
        var userType = userObject[0].userType;
        var schoolId = 0;
        if (userType == 2) {
            schoolId = userObject[0].schoolId;
            current_school_data = userObject[0].schoolData;
            CommonService.currentStep(schoolId,function(result){
                model.config_step = result;
            });
        } else {
            schoolId = $stateParams.schoolId;
        }
        model.config = userObject[0].config_flag;
        CommonService.checkPage(schoolId);
    }



    manageEmployeeService.getEmployeesBasedJob(schoolId,'قائد مدرسة الحالي',0,function (result) {
        if(result.length) {
            model.agentsObj.schoolLeader = result[0].id;
            model.added = 1;
        }
    });
    manageEmployeeService.getEmployeesBasedJob(schoolId,'وكيل','وكيل المدرسة للشؤون التعليمية',function (result) {
        if(result.length) {
            model.agentsObj.educationAgent = result[0].id;
            model.added = 1;
        }
    });
    manageEmployeeService.getEmployeesBasedJob(schoolId,'وكيل','وكيل المدرسة للشؤون الطلاب',function (result) {
        if(result.length) {
            model.agentsObj.studentAgent = result[0].id;
            model.added = 1;
        }
    });
    manageEmployeeService.getEmployeesBasedJob(schoolId,'وكيل','وكيل المدرسة للشؤون المدرسية',function (result) {
        if(result.length) {
            model.agentsObj.schoolAgent = result[0].id;
            model.added = 1;
        }
    });



    $scope.model.schoolId = schoolId;
    manageEmployeeService.getEmployeesBasedJob(schoolId,'قائد مدرسة',0,function (employees) {
        $scope.employees = employees;
    });

    manageEmployeeService.getEmployeesBasedJob(schoolId,'وكيل',0,function (agents_employees) {
        $scope.agents_employees = agents_employees;
    });

    function saveLeadersData(){

        if (Object.keys(model.agentsObj).length) {
            manageEmployeeService.setEmpPostions(model.agentsObj, function (response) {

                if (response.success) {
                    //model.success = response.msg;
                    //$window.location.href = '#/employees';
                    //nextStep();
                    toastr.success(response.msg);
                    model.added = 1;
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });
        }

    }

    function nextStep(url){
        console.log('here');
        CommonService.nextStep(schoolId,function(result){
            $window.location.href = url;
        });
    }
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
