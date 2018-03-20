angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($moment,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService) {

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

        var attendance_day = $moment().format('MM/DD/YYYY');
        var model = {
            schoolId:schoolId,
            recordAttendance:recordAttendance,
            closeAttendance:closeAttendance,
            ExcuseRequest:ExcuseRequest,
            AbsentRequest:AbsentRequest,
            getAttendanceBasedDate:getAttendanceBasedDate,
            First_att_close:0,
            Second_att_close:0,
            emp_atts:[],
            activeProfile : {},
            employeeActivity: employeeActivity,
            attendance_day: attendance_day,
            listOfActivity: {},
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                employeesAttendanceService.getAllEmployeesAttendance(schoolId).then(function (employees) {
                    defer.resolve(employees);
                    model.emp_atts = employees;
                });

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('name').withTitle(' اسم الموظف'),
                DTColumnBuilder.newColumn(null).withTitle('مده التأخير').notSortable()
                    .renderWith(lateHtml),
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

            var current_date = $moment(attendance_day).format('MM-DD-YYYY');
            return ''+
                '<button class="btn btn-primary color-grey" ng-click="confirmTimeIn('+data.main_employee_id+',$event)" ng-class="{\'color-green\': 0 =='+data.is_absent+'}"> حاضر</button>\n'+
                '<button class="btn btn-danger" ng-class="{\'color-grey\':!'+data.is_absent+'}" ng-click="model.recordAttendance('+data.main_employee_id+',$event,\'غياب\')">غائب</button>'+
                '<button ng-disabled = "'+data.is_absent+' != 0" class="btn btn-primary excuse" ng-class="{\'color-grey\':!('+data.excuse_date+' == '+current_date+')}" ng-click="model.ExcuseRequest('+data.main_employee_id+',$event)">استئذان</button> '+
                '<button class="btn btn-warning" ng-class="{\'color-grey\':(\''+data.vacation_date_start+'\' == null) || !(\''+data.vacation_date_start+' \' <= \''+current_date+'\' && \''+data.vacation_date_end+'\' >= \''+current_date+'\')}" ng-click="model.AbsentRequest('+data.main_employee_id+',$event,\'غياب بعذر\')">غياب بعذر</button>'
                ;
        }

        function lateHtml(data, type, full, meta) {
            var late_min = data.late_min;
           if(data.late_min) {

               return '' +
                   '<div class="confirm_late">'+
                   '<div class="col-md-2">'+
                   '<label class="late_label">' + late_min + '</label>' +
                   '</div>'+
                   '<div class="col-md-4">'+
                   '<button class="btn btn-primary" ng-click="confirmLateMin(' + data.main_employee_id + ',$event,\''+ data.late_min +'\',\''+ data.time_in +'\')" > تعديل</button>'+
               '</div>'+
               '</div>';

           }else{
               return '';
           }
        }

        function getAttendanceBasedDate(){
            var defer = $q.defer();
            if(model.attendance_day){
                employeesAttendanceService.getAllEmployeesAttendanceByDate(schoolId,model.attendance_day).then(function (employees) {
                    defer.resolve(employees);
                    model.dtInstance.changeData(defer.promise);
                    model.emp_atts = employees;
                });

                employeesAttendanceService.getClosingButton(model.schoolId,model.attendance_day,function(data){
                    if (Object.keys(data).length) {
                        model.First_att_close = data[0].first_att_closing;
                        model.Second_att_close = data[0].second_att_closing;
                    }else{
                        model.First_att_close = 0;
                        model.Second_att_close = 0;
                    }
                });
            }
        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId,model.attendance_day, function (data) {
            console.log("data", data);
            model.listOfActivity = data;
        });

        employeesAttendanceService.getClosingButton(model.schoolId,model.attendance_day,function(data){
            if (Object.keys(data).length) {
               model.First_att_close = data[0].first_att_closing;
               model.Second_att_close = data[0].second_att_closing;
           }
        });


        $scope.model = model;

        WorkingSettingsService.getActiveSettingsData(schoolId,function(result){
           model.activeProfile  = result[0];
        });


        $scope.confirmTimeIn = function(employee_id,$event) {
            if (model.First_att_close) {
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
                    },
                    selectedDate: function () {
                        return model.attendance_day;
                    }

                }
            });
            dialogInst.result.then(function (newusr) {
                angular.element($event.target).removeClass('color-grey');
                angular.element($event.target).addClass('color-green');
                angular.element($event.target).parent().children('.excuse').attr('disabled',false)
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });

          }else{

                model.recordAttendance(employee_id,$event,'حضور');

            }
        };

        $scope.confirmLateMin = function(employee_id,$event,late_min,time_in) {
            var confirmLateMinInst = $uibModal.open({
                templateUrl: 'views/employees_attendance/ConfirmInTime.html',
                controller: 'confirmLateMinCtrl',
                size: 'md',
                resolve: {
                    selectedEmployee: function () {
                        return employee_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    },
                    selectedDate: function () {
                        return model.attendance_day;
                    },
                    late_min: function () {
                        return late_min;
                    },
                    time_in: function () {
                        return time_in;
                    }

                }
            });
            confirmLateMinInst.result.then(function (result) {
                angular.element($event.target).parent('.confirm_late').children('.late_label').text(result.late_min);
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
                       },
                       selectedDate: function () {
                           return model.attendance_day;
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
                       angular.element($event.target).parent().children('.excuse').attr('disabled',true);
                   }
               }, function () {
                   console.log('close');
                   //$log.info('Modal dismissed at: ' + new Date());
               });
           }

       function closeAttendance(type){
            if(type == 1){
                employeesAttendanceService.closeFirstAttendance( model.schoolId,model.attendance_day,function (result) {
                    if(result.success){
                        toastr.success(result.msg);
                    }else{
                        toastr.error(result.msg);
                    }
                });
            }else if(type == 2){
                employeesAttendanceService.closeSecondAttendance( model.schoolId,model.attendance_day,function (result) {
                    if(result.success){
                        toastr.success(result.msg);
                    }else{
                        toastr.error(result.msg);
                    }
                });
            }

       }

       function recordAttendance(emp_id,$event,type){


         var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.employee_id = emp_id;
            attendanceObj.Event_Name = 'طابور';
            attendanceObj.time_in = $moment().format('H:m');
            attendanceObj.attendance_day = model.attendance_day;
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
                    if(type == 'حضور') {
                        if(result.late_min){
                            angular.element($event.target).addClass('color-orange');
                        }else {
                            angular.element($event.target).addClass('color-green');
                        }
                        angular.element($event.target).parent().children('.excuse').attr('disabled',false);
                    }else  if(type == 'غياب' || type == 'غياب بعذر') {
                        angular.element($event.target).parent().children('.excuse').attr('disabled',true);
                    }

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

angular.module('MetronicApp').controller('DialogInstCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedDate,employee_data, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('H:m');
    $scope.late_min = employee_data.late_min;

    $scope.submitAttendance = function () {

        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };



    $scope.recordAttendance = function () {
        var attendanceObj = {};
        if(employee_data){
            attendanceObj.late_min = $scope.late_min;
        }else{
            attendanceObj.time_in = employee_data.currentTime;
        }

        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'طابور';
        attendanceObj.is_absent = 0;
        attendanceObj.attendance_day = selectedDate;


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

angular.module('MetronicApp').controller('confirmLateMinCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedDate,late_min,time_in, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('H:m');
    $scope.late_min_modified = late_min;

    $scope.submitAttendance = function () {

        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };



    $scope.recordAttendance = function () {
        var attendanceObj = {};
            attendanceObj.late_min = $scope.late_min_modified;
            attendanceObj.time_in = time_in;


        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'طابور';
        attendanceObj.is_absent = 0;
        attendanceObj.attendance_day = selectedDate;


        employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            console.log($scope.late_min_modified);
            result.late_min = $scope.late_min_modified;
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


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function(toastr ,employeesExcuseService ,$moment,$scope, $uibModalInstance, selectedEmployee,schoolId,selectedDate, $log) {
    var currentTime = $moment().format('HH:mm');
    var currentDate = selectedDate;

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
    var currentDate = $moment().format('MM-DD-YYYY');

    var AbsentObj = {};
    AbsentObj.school_id = schoolId;
    AbsentObj.Emp_id = selectedEmployee;
    AbsentObj.Start_Date = currentDate;
    AbsentObj.End_Date = currentDate;
    AbsentObj.No_Of_Days = 1;

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
        AbsentObj.End_Date = end.format("MM-DD-YYYY");

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