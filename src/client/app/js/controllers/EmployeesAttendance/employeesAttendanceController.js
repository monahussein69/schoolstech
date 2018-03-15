angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService,manageAppSettingsService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }

        var model = {
            schoolId:schoolId,
            recordAttendance:recordAttendance,
            closeAttendance:closeAttendance,
            ExcuseRequest:ExcuseRequest,
            AbsentRequest:AbsentRequest,
            emp_atts:[],
            activeProfile : {},
            employeeActivity: employeeActivity,
            listOfActivity: {},
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
                    defer.resolve(employees);
                    model.emp_atts = employees;
                });

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('name').withTitle(' اسم الموظف'),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {


            return ''+
                '<button class="btn btn-primary color-grey" ng-click="confirmTimeIn('+data.id+',$event)" > حاضر</button>\n'+
                '<button class="btn btn-danger color-grey" ng-click="model.recordAttendance('+data.id+',$event,\'غياب\')">غائب</button>'+
                '<button class="btn btn-primary color-grey" ng-click="model.ExcuseRequest('+data.id+',$event)">استئذان</button> '+
                '<button class="btn btn-warning color-grey" ng-click="model.AbsentRequest('+data.id+',$event,\'غياب بعذر\')">غياب بعذر</button>'
                ;
        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId, function (data) {
            console.log("data", data);
            model.listOfActivity = data;
        });


        $scope.model = model;

        WorkingSettingsService.getActiveSettingsData(schoolId,function(result){
           model.activeProfile  = result[0];
        });


        $scope.confirmTimeIn = function(employee_id,$event){
            var dialogInst = $uibModal.open({
                templateUrl: 'views/employees_attendance/ConfirmInTime.html',
                controller: 'DialogInstCtrl',
                size: 'md',
                resolve: {
                    selectedEmployee: function () {
                        return employee_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    }
                }
            });
            dialogInst.result.then(function (newusr) {
                angular.element($event.target).removeClass('color-grey');
                angular.element($event.target).addClass('color-green');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        function employeeActivity(employee_id) {
            var dialogInst = $uibModal.open({
                templateUrl: 'views/employees_attendance/employeeActivityPopup.html',
                controller: 'EmployeeActivityPopupCtrl',
                size: 'md',
                resolve: {
                    selectedEmployee: function () {
                        return employee_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    },
                    getActivityByDayAndSchoolId: function () {
                        return model.listOfActivity;
                    }
                }
            });
            dialogInst.result.then(function (newusr) {
                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };


        function ExcuseRequest(employee_id,$event){
               var dialogInst = $uibModal.open({
                   templateUrl: 'views/employees_attendance/ExcuseFormRequest.html',
                   controller: 'ExcuseDialogCtrl',
                   size: 'md',
                   resolve: {
                       selectedEmployee: function () {
                           return employee_id;
                       },
                       schoolId: function () {
                           return model.schoolId;
                       }
                   }
               });
               dialogInst.result.then(function (result) {
                   console.log('open');

                   if(result.success){
                       angular.element($event.target).attr('disabled','disabled');
                       angular.element($event.target).removeClass('color-grey');
                   }
               }, function () {
                   console.log('close');
                   //$log.info('Modal dismissed at: ' + new Date());
               });
           }


       function AbsentRequest(employee_id,$event){
               var dialogInst = $uibModal.open({
                   templateUrl: 'views/employees_attendance/AbsentFormRequest.html',
                   controller: 'AbsentDialogCtrl',
                   size: 'md',
                   resolve: {
                       selectedEmployee: function () {
                           return employee_id;
                       },
                       schoolId: function () {
                           return model.schoolId;
                       }
                   }
               });
               dialogInst.result.then(function (result) {

                   if(result.success){
                       angular.element($event.target).removeClass('color-grey');
                   }
               }, function () {
                   console.log('close');
                   //$log.info('Modal dismissed at: ' + new Date());
               });
           }

       function closeAttendance(){
           employeesAttendanceService.closeFirstAttendance( model.schoolId,function (result) {
               if(result.success){
                   toastr.success(result.msg);
               }else{
                   toastr.error(result.msg);
               }
           });
       }

       function recordAttendance(emp_id,$event,type){


         var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.employee_id = emp_id;
            attendanceObj.Event_Name = 'طابور';
            attendanceObj.is_absent = 1;
            if(type == 'حضور') {
                attendanceObj.is_absent = 0;
            }else if(type == 'غياب بعذر'){
                attendanceObj.on_vacation = 1;
            }

            employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
                if (result.success) {
                    toastr.success(result.msg);
                    angular.element($event.target).removeClass('color-grey');

                } else {
                    toastr.error(result.msg);
                }
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


angular.module('MetronicApp').controller('DialogInstCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('HH:mm');
    $scope.submitAttendance = function () {

        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.recordAttendance = function () {


        var attendanceObj = {};
        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'طابور';
        attendanceObj.is_absent = 0;
        attendanceObj.time_in = $scope.currentTime;


        employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});

angular.module('MetronicApp').controller('EmployeeActivityPopupCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee, schoolId, $log, getActivityByDayAndSchoolId) {
    var model = {
        selectedEmployee: selectedEmployee,
        currentTime: $moment().format('HH:mm'),
        onCancel: onCancel,
        onSave: onSave,
        activities: getActivityByDayAndSchoolId,
        activity: '',
        status: 0
    };
    $scope.model = model;
    console.log("salim");
    console.log(model.activities);

    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function onSave() {
        let activityAttendance = {
            school_id: schoolId,
            employee_id: selectedEmployee,
            is_absent: parseInt(model.status),
            Event_Name: model.activities[model.activity].event_Nam,
            time_in: model.currentTime,
            Begining_Time: model.activities[model.activity].Begining_Time,
            Ending_Time: model.activities[model.activity].Ending_Time
        }

        console.log(activityAttendance);

        employeesAttendanceService.setEmployeeActivityAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close();
        });
    }
});


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function(toastr ,employeesExcuseService ,$moment,$scope, $uibModalInstance, selectedEmployee,schoolId, $log) {
    var currentTime = $moment().format('HH:mm');
    var currentDate = $moment().format('MM/DD/YYYY');

    var ExcuseObj = {};
    ExcuseObj.school_id = schoolId;
    ExcuseObj.Emp_id = selectedEmployee;
    ExcuseObj.Departure_time = currentTime;
    ExcuseObj.Return_time = currentTime;
    ExcuseObj.Start_Date = currentDate;
    ExcuseObj.End_Date = currentDate;
    $scope.ExcuseObj = ExcuseObj;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ExcuseRequest = function(){

        employeesExcuseService.sendExcuseRequest(ExcuseObj,function (result) {
            if(result.success){
                toastr.success(result.msg);

            }else{
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});


angular.module('MetronicApp').controller('AbsentDialogCtrl', function(toastr ,employeesAbsentService ,$moment,$scope, $uibModalInstance, selectedEmployee,schoolId, $log) {
    var currentTime = $moment().format('HH:mm');
    var currentDate = $moment().format('MM/DD/YYYY');

    var AbsentObj = {};
    AbsentObj.school_id = schoolId;
    AbsentObj.Emp_id = selectedEmployee;
    AbsentObj.Start_Date = currentDate;
    AbsentObj.End_Date = currentDate;
    AbsentObj.No_Of_Days = 0;

    $scope.AbsentObj = AbsentObj;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.absentDays = function(){
        var start = $moment(AbsentObj.Start_Date);
        var end = $moment(AbsentObj.End_Date);
        var duration = $moment.duration(end.diff(start));
        var days = duration.asDays();
        AbsentObj.No_Of_Days = days;
    };

    $scope.absentEndDay = function(){
        var start = $moment(AbsentObj.Start_Date);
        var days = AbsentObj.No_Of_Days ;
        var end = start.add(days, 'days');
        AbsentObj.End_Date = end.format("MM/DD/YYYY");

    };

    $scope.AbsentRequest = function(){

        employeesAbsentService.sendAbsentRequest(AbsentObj,function (result) {
            if(result.success){
                toastr.success(result.msg);

            }else{
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});