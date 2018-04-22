angular.module('MetronicApp').controller('employeeActivityAttendanceController',
    function ($moment, $compile, DTOptionsBuilder, DTColumnBuilder, $q, $uibModal, $stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter, employeesAttendanceService, manageEmployeeService, WorkingSettingsService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if (userObject) {
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
        var entryDate = $moment().format('YYYY-MM-DD- hh:mm');
        //var titleHtml = '<input type="checkbox" ng-model="model.selectAll" ng-click="model.toggleAll(model.selectAll, model.selected)">';

        var model = {
            schoolId: schoolId,
            emp_atts: [],
            attendance_day: attendance_day,
            getAllEmployeesByActivity: getAllEmployeesByActivity,
            activeProfile: {},
            getAttendanceBasedDate: getAttendanceBasedDate,
            employeeActivity: employeeActivity,
            recordAttendanceAll: recordAttendanceAll,
            listOfActivity: {},
            selected : {},
            selectAll : false,
            toggleAll : toggleAll,
            toggleOne : toggleOne,
            headerCompiled:false,
            ids:[],
            activity:'',
            userId:userId,
            entryDate:entryDate,
            options:DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.emp_atts);


                return defer.promise
            }).withOption('createdRow', createdRow).withOption('paging', false)
            //.withOption('headerCallback', function(header) {
            //if (!model.headerCompiled) {
            // Use this headerCompiled field to only compile header once
            // model.headerCompiled = true;
            //  $compile(angular.element(header).contents())($scope);
            //}
            //})
            ,columns: [
                /* DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                     .renderWith(function(data, type, full, meta) {
                         model.selected[full.main_employee_id] = false;
                         return '<input type="checkbox" ng-model="model.selected[' + data.main_employee_id + ']" ng-click="model.toggleOne(date.selected)">';
                     }),*/
                DTColumnBuilder.newColumn('name').withTitle(' اسم الموظف'),
                DTColumnBuilder.newColumn(null).withTitle('وقت الحضور').notSortable()
                    .renderWith(lateHtml),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
        };

        function lateHtml(data, type, full, meta) {
            var time_in = data.time_in_formmated;
            if (data.time_in) {

                return '' +
                    '<div class="confirm_late">' +
                    '<div class="col-md-2">' +
                    '<label class="late_label">' + time_in + '</label>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<button class="btn btn-primary" ng-click="confirmLateMin(' + data.main_employee_id + ',$event,\'' + data.time_in + '\')" > تعديل</button>' +
                    '</div>' +
                    '</div>';

            } else {
                return '';
            }
        }

        function recordAttendanceAll(type){
            var allEmployees = [];
            var results = [];
            var currentTime = $moment().format('h:mm A');

            if((($moment(currentTime,'HH:mm').isBefore( $moment(model.listOfActivity[model.activity].Begining_Time,'HH:mm'))) ||  ($moment(model.listOfActivity[model.activity].Ending_Time,'HH:mm').isBefore($moment(currentTime,'HH:mm')))) && type != 'غياب'){
                toastr.error('الوقت المدخل خارج وقت النشاط');
                return;
            }

            employeesAttendanceService.getAllEmployeesAttendanceByActivity(schoolId,model.listOfActivity[model.activity].event_Nam,model.attendance_day).then(function (employees) {
                allEmployees = employees;
                if (Object.keys(allEmployees).length > 0) {
                    var requests = Object.keys(allEmployees).map(function (key, item) {
                        console.log('item');
                        console.log(item);
                        return new Promise(function (resolve) {
                            var attendanceObj = {};
                            attendanceObj.Begining_Time = model.listOfActivity[model.activity].Begining_Time,
                                attendanceObj.Ending_Time = model.listOfActivity[model.activity].Ending_Time,
                                attendanceObj.school_id = model.schoolId;
                            attendanceObj.employee_id = allEmployees[key].main_employee_id;
                            attendanceObj.Event_Name = model.listOfActivity[model.activity].event_Nam;
                            attendanceObj.time_in = $moment().format('H:mm');
                            attendanceObj.Attendance_Day = model.attendance_day;
                            attendanceObj.is_absent = 1;
                            attendanceObj.entered_by = model.userId;
                            attendanceObj.entery_date = model.entryDate;
                            if (type == 'تأخر') {
                                attendanceObj.is_absent = 0;
                            } else if (type == 'خروج مبكر') {
                                attendanceObj.is_absent = 2;
                            }

                            if(attendanceObj.is_absent == 1){
                                attendanceObj.time_in = attendanceObj.Ending_Time;
                            }

                            console.log('attendanceObj');
                            console.log(attendanceObj);

                            employeesAttendanceService.setEmployeeActivityAttendance(attendanceObj, function (result) {
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
                        model.getAllEmployeesByActivity();
                        toastr.success('تم تسجيل '+type+' بنجاح');
                    }else{
                        toastr.error('الرجاء اختار موظف');
                    }
                    //callback(response);
                });
            });




        }

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
                    },
                    selectedEvent: function () {
                        return model.listOfActivity[model.activity];
                    }

                }
            });
            confirmLateMinInst.result.then(function (result) {
                //console.log(angular.element($event.target).parent().parent().find('.late_label').text(result.time_in));
                //angular.element($event.target).parent('.confirm_late').children('.late_label').text(result.time_in);
                model.getAllEmployeesByActivity();
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });


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

            var late = false;
            if(data.late_min && data.late_min != 0){
                late = true;
            }

            return ''+
                '<button class="btn btn-primary" ng-class="{\'color-grey\':!('+late+')}"  ng-click="model.employeeActivity('+data.main_employee_id+',0,$event)"> تأخر</button>' +
                '<button class="btn btn-danger" ng-class="{\'color-grey\':!('+data.is_absent+' == 1)}"  ng-click="model.employeeActivity('+data.main_employee_id+',1,$event)">غياب</button>' +
                '<button class="btn btn-warning" ng-class="{\'color-grey\':(\''+data.short_min+'\' == \'\') || (\''+data.short_min+'\' == \'null\')}" ng-click="model.employeeActivity('+data.main_employee_id+',2,$event)">خروج مبكر</button>'
                ;
        }


        function getAttendanceBasedDate() {
            var defer = $q.defer();
            if (model.attendance_day) {

                employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId, model.attendance_day, function (data) {
                    model.listOfActivity = data;
                    console.log('data');
                    console.log(data);
                });
            }
        }

        function getAllEmployeesByActivity() {
            var defer = $q.defer();
            employeesAttendanceService.getAllEmployeesAttendanceByActivity(schoolId, model.listOfActivity[model.activity].event_Nam, model.attendance_day).then(function (employees) {
                defer.resolve(employees);
                model.dtInstance.changeData(defer.promise);
                model.employees = employees;
            });

        }

        employeesAttendanceService.getActivityByDayAndSchoolId(model.schoolId, model.attendance_day, function (data) {
            model.listOfActivity = data;
            console.log('data');
            console.log(data);
        });


        $scope.model = model;


        function employeeActivity(employee_id, status_id, $event) {
            var status_names = [];
            status_names[0] = 'تأخر';
            status_names[1] = 'غياب';
            status_names[2] = 'خروج مبكر';
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
                    selectedActivity: function () {
                        return model.activity;
                    },
                    status_id: function () {
                        return status_id;
                    }, status_name: function () {
                        return status_names[status_id];
                    },
                    selected_date: function () {
                        return model.attendance_day;
                    },
                    getActivityByDayAndSchoolId: function () {
                        return model.listOfActivity;
                    }
                }
            });
            dialogInst.result.then(function (result) {

                if (result.success) {
                    model.getAllEmployeesByActivity();
                }

                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
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
    });

angular.module('MetronicApp').controller('confirmLateMinCtrl', function (localStorageService, toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedDate,time_in,selectedEvent, schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('h:m A');
    $scope.late_min_modified = $moment(time_in,'h:m A').format('h:mm A') ;

    var entryDate = $moment().format('YYYY-MM-DD- hh:mm');
    var userObject = localStorageService.get('UserObject');
    var userId = 0;
    if(userObject) {
        var userId = userObject[0].id;
    }
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
        attendanceObj.Event_Name = selectedEvent.event_Nam;
        attendanceObj.is_absent = 0;
        attendanceObj.Attendance_Day = selectedDate;
        attendanceObj.Begining_Time = selectedEvent.Begining_Time;
        attendanceObj.Ending_Time = selectedEvent.Ending_Time;
        attendanceObj.entered_by = userId;
        attendanceObj.entery_date = entryDate;




        employeesAttendanceService.setEmployeeActivityAttendance(attendanceObj, function (result) {
            if (result.success) {
                toastr.success('تم تعديل وقت التأخر بنجاح');
            } else {
                toastr.error(result.msg);
            }
            result.time_in = $scope.late_min_modified;
            $uibModalInstance.close(result);
        });
    }
});

angular.module('MetronicApp').controller('EmployeeActivityPopupCtrl', function (localStorageService,toastr, employeesAttendanceService, $moment, $scope, $uibModalInstance, selectedEmployee,selectedActivity, schoolId,status_name,status_id,selected_date, $log, getActivityByDayAndSchoolId) {

    /*var index = -1;

     getActivityByDayAndSchoolId.some(function(obj, i) {
        return obj.event_Nam === selectedActivity ? index = i : false;
    });
    index = index.toString();
    console.log(index);*/

    var entryDate = $moment().format('YYYY-MM-DD- hh:mm');
    var userObject = localStorageService.get('UserObject');
    var userId = 0;
    if(userObject) {
        var userId = userObject[0].id;
    }

    var model = {
        selectedEmployee: selectedEmployee,
        currentTime: $moment().format('h:mm A'),
        onCancel: onCancel,
        onSave: onSave,
        activities: getActivityByDayAndSchoolId,
        activity: selectedActivity,
        status: status_id,
        status_name: status_name,
        userId:userId,
        entryDate:entryDate
    };
    $scope.model = model;


    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function onSave() {
        console.log(model.currentTime);
        console.log(model.activities[model.activity].Begining_Time);
        var currentTime = $moment(model.currentTime,"h:mm A").format('HH:mm');
        console.log(currentTime);
        if((($moment(currentTime).isBefore( $moment(model.activities[model.activity].Begining_Time,'HH:mm'))) ||  ($moment(model.activities[model.activity].Ending_Time,'HH:mm').isBefore($moment(currentTime,'HH:mm')))) && model.status != 1){
            toastr.error('الوقت المدخل خارج وقت النشاط');
            return;
        }
        let activityAttendance = {
            school_id: schoolId,
            employee_id: selectedEmployee,
            is_absent: parseInt(model.status),
            Event_Name: model.activities[model.activity].event_Nam,
            Begining_Time: model.activities[model.activity].Begining_Time,
            Ending_Time: model.activities[model.activity].Ending_Time,
            Attendance_Day : selected_date,
            entery_date:model.entryDate,
            entered_by:model.userId
        }


        if(model.status == 2){
            activityAttendance.time_out = model.currentTime;
        }else if(model.status == 1){
            activityAttendance.time_in = activityAttendance.Ending_Time;
        }else{
            activityAttendance.time_in = model.currentTime;
        }




        employeesAttendanceService.setEmployeeActivityAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});

