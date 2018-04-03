angular.module('MetronicApp').controller('activityAttendanceController',
    function ($moment, $compile, DTOptionsBuilder, DTColumnBuilder, $q, $uibModal, $stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter, studentsAttendanceService, manageEmployeeService) {

        var schoolId = 0;
        var teacherId = 0;
        var userObject = localStorageService.get('UserObject');
        if (userObject) {
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                // teacherId = userObject[0].employeeData.id;
                schoolId = userObject[0].schoolId;
            } else {
                // teacherId = $stateParams.teacherId;
                schoolId = $stateParams.schoolId;
            }
        }

        var attendance_day = $moment().format('MM/DD/YYYY');
        var titleHtml = '<input type="checkbox" ng-model="model.selectAll" ng-click="model.toggleAll(model.selectAll, model.selected)">';

        var model = {
            schoolId: schoolId,
            teacherId: teacherId,
            studentAttendance: [],
            recordAttendance: recordAttendance,
            recordAttendanceAll:recordAttendanceAll,
            getAllStudentsByActivity: getAllStudentsByActivity,
            ExcuseRequest: ExcuseRequest,
            attendance_day:attendance_day,
            activeProfile: {},
            listOfActivity: {},
            selected : {},
            selectAll : false,
            toggleAll : toggleAll,
            toggleOne : toggleOne,
            headerCompiled:false,
            ids:[],
            activity: '',
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.studentAttendance);

                return defer.promise
            }).withOption('createdRow', createdRow).withOption('createdRow', createdRow)
                .withOption('headerCallback', function(header) {
                    //if (!model.headerCompiled) {
                    // Use this headerCompiled field to only compile header once
                    // model.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                    //}
                }),
            columns: [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                    .renderWith(function(data, type, full, meta) {
                        model.selected[full.main_student_id] = false;
                        return '<input type="checkbox" ng-model="model.selected[' + data.main_student_id + ']" ng-click="model.toggleOne(date.selected)">';
                    }),
                DTColumnBuilder.newColumn('student_name').withTitle('اسم الطالب'),
                DTColumnBuilder.newColumn('late_min').withTitle('مده التأخير'),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
            employeeList: [],
            selectedEmployee: 0,
            getActivityByEmployeeId: getActivityByEmployeeId,
            getAttendanceBasedDate:getAttendanceBasedDate
        };

        function getAttendanceBasedDate(){
            model.getActivityByEmployeeId();
        }


        manageEmployeeService.getAllTeachers(schoolId).then(employees => {
            console.log();
            model.employeeList = employees;
            $scope.$apply();
        });

        function getActivityByEmployeeId() {
            manageEmployeeService.getActivityByEmployeeId(model.teacherId,model.attendance_day).then(activites => {
                model.listOfActivity = activites;
                $scope.$apply();
            });
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            var current_date = $moment(model.attendance_day).format('MM/DD/YYYY');

            return '' +
                '<button class="btn btn-primary color-grey" ng-click="model.recordAttendance(' + data.main_student_id + ',$event,\'حضور\')" ng-class="{\'color-green\': 0 ==' + data.is_absent + '}"> حاضر</button>\n' +
                '<button class="btn btn-danger" ng-class="{\'color-grey\':!' + data.is_absent + '}" ng-click="model.recordAttendance(' + data.main_student_id + ',$event,\'غياب\')">غائب</button>' +
                '<button ng-disabled = "' + data.is_absent + ' != 0" class="btn btn-primary excuse" ng-class="{\'color-grey\':!(' + data.excuse_date + ' == ' + current_date + ')}" ng-click="model.ExcuseRequest(' + data.main_student_id + ',$event)">استئذان</button> '
                ;
        }

        function recordAttendanceAll(type){

            var ids = model.selected;
            var results = [];
            if(Object.keys(ids).length > 0) {
                var requests = Object.keys(ids).map(function (key, item) {
                    if (ids[key]) {
                        return new Promise(function (resolve) {
                            var attendanceObj = {};
                            attendanceObj.school_id = model.schoolId;
                            attendanceObj.Student_id = key;
                            attendanceObj.Event_Name = model.activity;
                            attendanceObj.time_in = $moment().format('HH:mm');
                            attendanceObj.is_absent = 1;
                            attendanceObj.attendance_day = model.attendance_day;

                            if (type == 'حضور') {
                                attendanceObj.is_absent = 0;
                            }

                            studentsAttendanceService.setStudentAttendance(attendanceObj, function (result) {
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
                    model.getAllStudentsByActivity();
                    toastr.success('تم تسجيل '+type+' بنجاح');
                    }else{
                        toastr.error('الرجاء اختيار الطلاب');
                    }
                    //callback(response);
                });
            }else{
                toastr.error('الرجاء اختيار الطلاب');
            }


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
                    if(!selectedItems[id]) {
                        model.selectAll = false;
                        return;
                    }
                }
            }
            model.selectAll = true;
        }

        function getAllStudentsByActivity() {
            var defer = $q.defer();
            studentsAttendanceService.getAllStudentsAttendanceByActivity(schoolId, model.teacherId, model.activity,model.attendance_day).then(function (studentAttendance) {
                defer.resolve(studentAttendance);
                model.dtInstance.changeData(defer.promise);
                model.studentAttendance = studentAttendance;
            });

        }


        $scope.model = model;



        function recordAttendance(student_id, $event, type) {

            console.log('test');
            var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.Student_id = student_id;
            attendanceObj.Event_Name = model.activity;
            attendanceObj.time_in = $moment().format('HH:mm');
            attendanceObj.is_absent = 1;
            attendanceObj.attendance_day = model.attendance_day;

            if (type == 'حضور') {
                attendanceObj.is_absent = 0;
            }

            studentsAttendanceService.setStudentAttendance(attendanceObj, function (result) {
                if (result.success) {
                    model.getAllStudentsByActivity();
                    toastr.success(result.msg);
                    /*angular.element($event.target).removeClass('color-grey');
                    if (type == 'حضور') {
                        angular.element($event.target).addClass('color-green');
                        angular.element($event.target).parent().children('.excuse').attr('disabled', false);
                    } else if (type == 'غياب') {
                        angular.element($event.target).parent().children('.excuse').attr('disabled', true);
                    }*/

                } else {
                    toastr.error(result.msg);
                }
            });
        }


        function ExcuseRequest(student_id, $event) {
            var dialogInst = $uibModal.open({
                templateUrl: 'views/students_attendance/ExcuseFormRequest.html',
                controller: 'ExcuseDialogCtrl',
                size: 'md',
                resolve: {
                    selectedStudent: function () {
                        return student_id;
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
                    angular.element($event.target).attr('disabled', 'disabled');
                    angular.element($event.target).removeClass('color-grey');
                }
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
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


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function (toastr, studentExcuseService, $moment, $scope, $uibModalInstance, selectedStudent,selectedDate, schoolId, $log) {
    var currentTime = $moment().format('HH:mm');
    var currentDate = $moment(selectedDate).format('MM/DD/YYYY');

    console.log(selectedDate);

    var ExcuseObj = {};
    ExcuseObj.school_id = schoolId;
    ExcuseObj.Student_id = selectedStudent;
    ExcuseObj.Departure_time = currentTime;
    ExcuseObj.Return_time = currentTime;
    ExcuseObj.Start_Date = currentDate;
    ExcuseObj.End_Date = currentDate;
    $scope.ExcuseObj = ExcuseObj;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ExcuseRequest = function () {

        studentExcuseService.sendStudentExcuseRequest(ExcuseObj, function (result) {
            if (result.success) {
                toastr.success(result.msg);

            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});
