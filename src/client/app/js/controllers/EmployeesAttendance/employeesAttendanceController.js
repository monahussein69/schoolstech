angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($moment,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService) {

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

        var attendance_day = $moment().format('MM/DD/YYYY');
        var titleHtml = '<input type="checkbox" ng-model="model.selectAll" ng-click="model.toggleAll(model.selectAll, model.selected)">';
        var model = {
            schoolId: schoolId,
            recordAttendance: recordAttendance,
            recordAttendanceAll: recordAttendanceAll,
            closeAttendance: closeAttendance,
            ExcuseRequest: ExcuseRequest,
            AbsentRequest: AbsentRequest,
            getAttendanceBasedDate: getAttendanceBasedDate,
            selected: {},
            selectAll: false,
            toggleAll: toggleAll,
            toggleOne: toggleOne,
            First_att_close: 0,
            Second_att_close: 0,
            emp_atts: [],
            activeProfile: {},
            employeeActivity: employeeActivity,
            attendance_day: attendance_day,
            listOfActivity: {},
            headerCompiled:false,
            ids:[],
            userId:userId,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                employeesAttendanceService.getAllEmployeesAttendance(schoolId).then(function (employees) {
                    defer.resolve(employees);
                    model.emp_atts = employees;
                });

                return defer.promise
            }).withOption('createdRow', createdRow)
            //.withOption('headerCallback', function(header) {
                //if (!model.headerCompiled) {
                    // Use this headerCompiled field to only compile header once
                   // model.headerCompiled = true;
                  //  $compile(angular.element(header).contents())($scope);
                //}
           // })
            .withOption('autoWidth', false).withOption('paging', false),
            columns: [
                /*DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                    .renderWith(function(data, type, full, meta) {
                        model.selected[full.main_employee_id] = false;
                        return '<input type="checkbox" ng-model="model.selected[' + data.main_employee_id + ']" ng-click="model.toggleOne(date.selected)">';
                    }),*/
               // DTColumnBuilder.newColumn(null).withTitle('<input type="checkbox" ng-click="model.checkAll()" ng-model="model.selectAllButton"/>').renderWith(selectAll),
                DTColumnBuilder.newColumn('name').withTitle(' اسم الموظف'),
                DTColumnBuilder.newColumn(null).withTitle('وقت الحضور').notSortable()
                    .renderWith(lateHtml),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };

        function toggleAll(selectAll, selectedItems) {
            console.log('in click');
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    selectedItems[id] = selectAll;
                }
            }
        }

        function toggleOne(selectedItems) {
            for (var id in selectedItems) {
                if (selectedItems.hasOwnProperty(id)) {
                    if (!selectedItems[id]) {
                        model.selectAll = false;
                        return;
                    }
                }
            }
            model.selectAll = true;
        }


        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);

        }

        function actionsHtml(data, type, full, meta) {

            var current_date = $moment(model.attendance_day).format('MM-DD-YYYY');
            var late = false;
  
            if(data.late_min && data.late_min != 0){
                late = true;
            }
            return ''+
                '<button class="btn btn-primary color-grey attendance_'+data.main_employee_id+'" ng-click="confirmTimeIn('+data.main_employee_id+',$event)" ng-class="{\'color-green\': (0 =='+data.is_absent+') && !('+late+') , \'color-orange\':  ('+late+') && (0 =='+data.is_absent+') }"> حاضر</button>\n'+
                '<button class="btn btn-danger absent_'+data.main_employee_id+'" ng-class="{\'color-grey\':!(('+data.is_absent+' == 1) && (('+data.on_vacation+' == 0) || ('+data.on_vacation+' == null) ))}" ng-click="model.recordAttendance('+data.main_employee_id+',$event,\'غياب\')">غائب</button>'+
                '<button ng-disabled = "'+data.is_absent+' != 0" class="btn btn-primary excuse" ng-class="{\'color-grey\':!('+data.is_excused+' == 1)}" ng-click="model.ExcuseRequest('+data.main_employee_id+',$event)">استئذان</button> '+
                '<button class="btn btn-warning" ng-class="{\'color-grey\':!('+data.on_vacation+' == 1)}" ng-click="model.AbsentRequest('+data.main_employee_id+',$event,\'غياب بعذر\')">غياب بعذر</button>'
                ;
        }

        function lateHtml(data, type, full, meta) {
            var time_in = data.time_in_formmated;
            if (data.time_in) {

                return '' +
                    '<div class="confirm_late">' +
                    '<div class="col-md-2">' +
                    '<label class="late_label">' + time_in + '</label>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<button class="btn btn-primary" ng-click="confirmLateMin(' + data.main_employee_id + ',$event,\'' + data.time_in_formmated + '\')" > تعديل</button>' +
                    '</div>' +
                    '</div>';

            } else {
                return '';
            }
        }


        function recordAttendanceAll(type) {
            console.log(model.selected);
            var ids = model.selected;
            var results = [];
            var requests = [];



            employeesAttendanceService.getAllEmployeesAttendanceByDate(schoolId, model.attendance_day).then(function (employees) {
                if (Object.keys(employees).length > 0) {
                     requests = Object.keys(employees).map(function (key, item) {
                        return new Promise(function (resolve) {
                            var attendanceObj = {};
                            attendanceObj.school_id = model.schoolId;
                            attendanceObj.employee_id = employees[key].main_employee_id;
                            attendanceObj.Event_Name = 'بدايه الدوام';
                            attendanceObj.time_in = $moment().format('H:m');
                            attendanceObj.attendance_day = model.attendance_day;
                            attendanceObj.is_absent = 1;
                            attendanceObj.entered_by = model.userId;
                            if (type == 'حضور') {
                                attendanceObj.is_absent = 0;
                            }
                            employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
                                if (result.success) {
                                    results.push(1);
                                }
                                resolve(result);
                            });
                        });

                    });





                }

                Promise.all(requests).then(function (result) {
                    if (results.includes(1)) {
                        model.getAttendanceBasedDate();
                        toastr.success('تم تسجيل ' + type + ' بنجاح');
                    }else{
                        toastr.error('الرجاء اختار موظف');
                    }
                    //callback(response);
                });


            });





        }

        function getAttendanceBasedDate() {
            var defer = $q.defer();
            if (model.attendance_day) {
                console.log('ssssssssssssssss');
                employeesAttendanceService.getAllEmployeesAttendanceByDate(schoolId, model.attendance_day).then(function (employees) {
                    defer.resolve(employees);
                    model.dtInstance.changeData(defer.promise);
                    model.emp_atts = employees;
                });

                employeesAttendanceService.getClosingButton(model.schoolId, model.attendance_day, function (data) {
                    if (Object.keys(data).length) {
                        model.First_att_close = data[0].first_att_closing;
                        model.Second_att_close = data[0].second_att_closing;
                    } else {
                        model.First_att_close = 0;
                        model.Second_att_close = 0;
                    }
                });
            }
        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId, model.attendance_day, function (data) {
            console.log("data", data);
            model.listOfActivity = data;
        });

        employeesAttendanceService.getClosingButton(model.schoolId, model.attendance_day, function (data) {
            if (Object.keys(data).length) {
                model.First_att_close = data[0].first_att_closing;
                model.Second_att_close = data[0].second_att_closing;
            }
        });


        $scope.model = model;

        WorkingSettingsService.getActiveSettingsData(schoolId, function (result) {
            model.activeProfile = result[0];
        });


        $scope.confirmTimeIn = function (employee_id, $event) {
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
                    },
                    userId: function () {
                        return model.userId;
                    }

                }
            });
            dialogInst.result.then(function (newusr) {
                model.getAttendanceBasedDate();
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });

            } else {

                model.recordAttendance(employee_id, $event, 'حضور');

            }
        };

        $scope.confirmLateMin = function (employee_id, $event, time_in) {
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
                    time_in: function () {
                        return time_in;
                    }

                }
            });
            confirmLateMinInst.result.then(function (result) {
                model.getAttendanceBasedDate();
                //console.log(angular.element($event.target).parent().parent().find('.late_label').text(result.time_in));
                //angular.element($event.target).parent('.confirm_late').children('.late_label').text(result.time_in);
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


        function ExcuseRequest(employee_id, $event) {
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

                if (result.success) {
                    model.getAttendanceBasedDate();
                    //angular.element($event.target).attr('disabled', 'disabled');
                    //angular.element($event.target).removeClass('color-grey');
                }
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }


        function AbsentRequest(employee_id, $event) {
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
                    },
                    selectedDate: function () {
                        return model.attendance_day;
                    }
                }
            });
            dialogInst.result.then(function (result) {

                if (result.success) {
                    model.getAttendanceBasedDate();
                    console.log('testttttttttt');
                    //angular.element($event.target).removeClass('color-grey');
                    //angular.element($event.target).parent().children('.excuse').attr('disabled', true);
                }
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        }

        function closeAttendance(type) {
            if (type == 1) {
                employeesAttendanceService.closeFirstAttendance(model.schoolId, model.attendance_day, function (result) {
                    if (result.success) {
                        toastr.success(result.msg);
                        model.getAttendanceBasedDate();
                    } else {
                        toastr.error(result.msg);
                    }
                });
            } else if (type == 2) {
                employeesAttendanceService.closeSecondAttendance(model.schoolId, model.attendance_day, function (result) {
                    if (result.success) {
                        toastr.success(result.msg);
                        model.getAttendanceBasedDate();
                    } else {
                        toastr.error(result.msg);
                    }
                });
            }

        }

        function recordAttendance(emp_id, $event, type) {


            var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.employee_id = emp_id;
            attendanceObj.Event_Name = 'بدايه الدوام';
            attendanceObj.time_in = $moment().format('H:m');
            attendanceObj.attendance_day = model.attendance_day;
            attendanceObj.is_absent = 1;
           attendanceObj.entered_by = model.userId;
            if(type == 'حضور') {
                attendanceObj.is_absent = 0;
            } else if (type == 'غياب بعذر') {
                attendanceObj.on_vacation = 1;
            }

            employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
                if (result.success) {
                    model.getAttendanceBasedDate();

                    toastr.success(result.msg);
                    angular.element($event.target).removeClass('color-grey');
                    if (type == 'حضور') {
                        if (result.late_min) {
                            angular.element($event.target).addClass('color-orange');
                        } else {
                            angular.element($event.target).addClass('color-green');
                        }
                        angular.element($event.target).parent().children('.excuse').attr('disabled', false);
                    } else if (type == 'غياب' || type == 'غياب بعذر') {
                        angular.element($event.target).parent().children('.excuse').attr('disabled', true);
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

angular.module('MetronicApp').controller('DialogInstCtrl', function (userId,toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedDate, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.late_min_modified = $moment().format('h:m A');
    //$scope.late_min = employee_data.late_min;


    $scope.submitAttendance = function () {
        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.recordAttendance = function () {

        console.log($moment($scope.late_min_modified, "h:mm A").format("HH:mm"));

        var attendanceObj = {};

        attendanceObj.time_in = $scope.late_min_modified;
        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'بدايه الدوام';
        attendanceObj.is_absent = 0;
        attendanceObj.attendance_day = selectedDate;
        attendanceObj.entered_by = userId;


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

angular.module('MetronicApp').controller('confirmLateMinCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee, selectedDate, time_in, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('h:mm A');
    $scope.late_min_modified = time_in;

    $scope.submitAttendance = function () {

        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.recordAttendance = function () {
        var attendanceObj = {};
        attendanceObj.time_in = $scope.late_min_modified;
        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'بدايه الدوام';
        attendanceObj.is_absent = 0;
        attendanceObj.attendance_day = selectedDate;


        employeesAttendanceService.setEmployeeAttendance(attendanceObj, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            console.log($scope.late_min_modified);
            result.time_in = $scope.late_min_modified;
            $uibModalInstance.close(result);
        });
    }
});

angular.module('MetronicApp').controller('EmployeeActivityPopupCtrl', function (toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee, schoolId, $log, getActivityByDayAndSchoolId) {
    var model = {
        selectedEmployee: selectedEmployee,
        currentTime: $moment().format('h:mm A'),
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


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function (toastr, employeesExcuseService, $moment, $scope, $uibModalInstance, selectedEmployee, schoolId, selectedDate, $log,WorkingSettingsService) {
    var currentTime = $moment().format('h:mm A');
    var currentDate = selectedDate;

    var ExcuseObj = {};
    ExcuseObj.School_id = schoolId;
    ExcuseObj.Emp_id = selectedEmployee;
    ExcuseObj.Departure_time = currentTime;
    ExcuseObj.Return_time = currentTime;
    ExcuseObj.Start_Date = currentDate;
    ExcuseObj.End_Date = currentDate;
    ExcuseObj.Event_Name = 'بدايه الدوام';
    $scope.ExcuseObj = ExcuseObj;


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ExcuseRequest = function () {
        console.log($scope.ExcuseObj);
           WorkingSettingsService.getStartEndAttendance(schoolId,currentDate,function(result){
            var Departure_time = $moment($scope.ExcuseObj.Departure_time,'h:mm A').format('HH:mm');
            var Return_time = $moment($scope.ExcuseObj.Return_time,'h:mm A').format('HH:mm');
          
            if($moment(Return_time,'HH:mm').isBefore($moment(Departure_time,'HH:mm'))){
                toastr.error('وقت العوده اقل من وقت الذهاب');
                return;
            }
			
			var startDate = $moment(result[0].Begining_Time).format('YYYY-MM-DD');
			var endDate = $moment(result[0].Ending_Time).format('YYYY-MM-DD');
			var startTime = $moment(result[0].Begining_Time).format('HH:mm');
			var endTime = $moment(result[0].Ending_Time).format('HH:mm');
			console.log(result[0].Begining_Time);
			console.log(endDate);
			console.log($moment(startDate+' '+Departure_time,'YYYY-MM-DD HH:mm'));
			console.log($moment(endDate+' '+Return_time,'YYYY-MM-DD HH:mm'));
			console.log($moment(startDate+' '+startTime,'YYYY-MM-DD HH:mm'));
			console.log($moment(endDate+' '+endTime,'YYYY-MM-DD HH:mm'));

			
            if((($moment(startDate+' '+Departure_time,'YYYY-MM-DD HH:mm').isBefore( $moment(startDate+' '+startTime,'YYYY-MM-DD HH:mm'))) ||  ($moment(endDate+' '+endTime,'YYYY-MM-DD HH:mm').isBefore($moment(startDate+' '+Return_time,'YYYY-MM-DD HH:mm')))) ) {
                toastr.error('وقت الاستئذان خارج وقت الدوام');
                return;
            }else{
                employeesExcuseService.sendExcuseRequest($scope.ExcuseObj, function (result) {
                    if (result.success) {
                        toastr.success(result.msg);

                    } else {
                        toastr.error(result.msg);
                    }
                    $uibModalInstance.close(result);
                });
            }

            });

    }
});


angular.module('MetronicApp').controller('AbsentDialogCtrl', function (manageExcuseTypeService,toastr, employeesAbsentService, $moment, $scope, $uibModalInstance, selectedEmployee, schoolId, $log, selectedDate) {
    var currentTime = $moment().format('h:mm A');
    var currentDate = selectedDate;

    var AbsentObj = {};
    AbsentObj.school_id = schoolId;
    AbsentObj.Emp_id = selectedEmployee;
    AbsentObj.Start_Date = currentDate;
    AbsentObj.End_Date = currentDate;
    AbsentObj.No_Of_Days = 1;
    AbsentObj.absentType = '';

    $scope.AbsentObj = AbsentObj;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    manageExcuseTypeService.getAllExcuseTypes().then(function (result) {
        console.log(result);
        $scope.excuseTypes = result;
        $scope.$apply();
    });


    $scope.absentDays = function () {
        var start = $moment(AbsentObj.Start_Date);
        var end = $moment(AbsentObj.End_Date);
        var duration = $moment.duration(end.diff(start));
        var days = duration.asDays();
        AbsentObj.No_Of_Days = days;
    };

    $scope.absentEndDay = function () {
        var start = $moment(AbsentObj.Start_Date);
        var days = AbsentObj.No_Of_Days;
        var end = start.add(days, 'days');
        AbsentObj.End_Date = end.format("MM-DD-YYYY");

    };

    $scope.AbsentRequest = function () {
        AbsentObj.Start_Date = $moment(AbsentObj.Start_Date).format("MM-DD-YYYY")
        AbsentObj.End_Date = $moment(AbsentObj.End_Date).format("MM-DD-YYYY")
        employeesAbsentService.sendAbsentRequest(AbsentObj, function (result) {
            if (result.success) {
                toastr.success(result.msg);

            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});