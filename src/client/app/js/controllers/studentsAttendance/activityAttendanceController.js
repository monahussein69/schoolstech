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
        var model = {
            schoolId: schoolId,
            teacherId: teacherId,
            studentAttendance: [],
            recordAttendance: recordAttendance,
            getAllStudentsByActivity: getAllStudentsByActivity,
            ExcuseRequest: ExcuseRequest,
            attendance_day:attendance_day,
            activeProfile: {},
            listOfActivity: {},
            activity: '',
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.studentAttendance);

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('student_name').withTitle('اسم الطالب'),
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
                    toastr.success(result.msg);
                    angular.element($event.target).removeClass('color-grey');
                    if (type == 'حضور') {
                        angular.element($event.target).addClass('color-green');
                        angular.element($event.target).parent().children('.excuse').attr('disabled', false);
                    } else if (type == 'غياب') {
                        angular.element($event.target).parent().children('.excuse').attr('disabled', true);
                    }

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
