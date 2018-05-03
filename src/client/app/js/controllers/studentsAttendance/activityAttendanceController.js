angular.module('MetronicApp').controller('activityAttendanceController',
    function ($moment, $compile, DTOptionsBuilder, DTColumnBuilder, $q, $uibModal, $stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter, studentsAttendanceService, manageEmployeeService) {
        
        var schoolId = 0;
        var teacherId = 0;
        var userObject = localStorageService.get('UserObject');
        if (userObject) {
            var userType = userObject[0].userType;
            var userId = userObject[0].id;
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
        var entryDate = $moment().format('YYYY-MM-DD- hh:mm');
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
            userId:userId,
            entryDate:entryDate,
            ids:[],
            activity: '',
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.studentAttendance);

                return defer.promise
            }).withOption('createdRow', createdRow).withOption('createdRow', createdRow)
                .withOption('autoWidth', false)
                .withOption('paging', false)
                //.withOption('headerCallback', function(header) {
                    //if (!model.headerCompiled) {
                    // Use this headerCompiled field to only compile header once
                    // model.headerCompiled = true;
                  //  $compile(angular.element(header).contents())($scope);
                    //}
               // })
            ,
            columns: [
                /*DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                    .renderWith(function(data, type, full, meta) {
                        model.selected[full.main_student_id] = false;
                        return '<input type="checkbox" ng-model="model.selected[' + data.main_student_id + ']" ng-click="model.toggleOne(date.selected)">';
                    }),*/
                DTColumnBuilder.newColumn('student_name').withTitle('اسم الطالب'),
                DTColumnBuilder.newColumn('late_min').withTitle('مده التأخير'),
                DTColumnBuilder.newColumn(null).withTitle('الحضور').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
            employeeList: [],
            selectedEmployee: 0,
            getActivityByEmployeeId: getActivityByEmployeeId,
            getAttendanceBasedDate:getAttendanceBasedDate,
            recordExcuse:recordExcuse
        };

        function getAttendanceBasedDate(){
            model.getActivityByEmployeeId();
        }


        manageEmployeeService.getAllTeachers(schoolId).then(employees => {
            model.employeeList = employees;
            $scope.$apply();
        });

        function getActivityByEmployeeId() {
            manageEmployeeService.getActivityByEmployeeId(model.teacherId,model.schoolId,model.attendance_day).then(activites => {
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
                '<button class="btn btn-primary color-grey" ng-click="model.recordAttendance(' + data.main_student_id + ',$event,\'حضور\')" ng-class="{\'color-green\': (0 ==' + data.is_absent + ' && (\''+data.late_min+'\' == \'\')) }"> حاضر</button>\n' +
                '<button class="btn btn-primary color-grey" ng-click="model.recordAttendance(' + data.main_student_id + ',$event,\'متأخر\')" ng-class="{\'color-orange\': (0 ==' + data.is_absent + ') && !(\''+data.late_min+'\' == \'\') }"> متأخر</button>\n'+
                '<button class="btn btn-danger" ng-class="{\'color-grey\':!' + data.is_absent + '}" ng-click="model.recordAttendance(' + data.main_student_id + ',$event,\'غياب\')">غائب</button>' +
                '<button class="btn btn-warning" ng-class="{\'color-grey\':(\''+data.short_min+'\' == \'\') || (\''+data.short_min+'\' == \'null\')}" ng-click="model.recordAttendance('+data.main_student_id+',$event,\'خروج مبكر\')">خروج مبكر</button>'+
                '<button ng-disabled = "' + data.is_absent + ' != 0" class="btn btn-primary excuse" ng-class="{\'color-grey\':!(' + data.is_excused + ')}" ng-click="model.ExcuseRequest(' + data.main_student_id + ',$event)">استئذان</button> '+
                '<button class="btn btn-primary color-grey" ng-click="model.recordExcuse('+data.main_student_id+')" ng-show="'+data.is_absent+' == 1">تسجيل اعذار الغياب</button>'
                ;
        }

        function recordAttendanceAll(type){

            var currentTime = $moment().format('H:mm');

            /*if((($moment(currentTime,'HH:mm').isBefore( $moment(model.listOfActivity[model.activity].Begining_Time,'HH:mm'))) ||  ($moment(model.listOfActivity[model.activity].Ending_Time,'HH:mm').isBefore($moment(currentTime,'HH:mm')))) && type != 'غياب'){
                toastr.error('الوقت المدخل خارج وقت النشاط');
                return;
            }*/

            var results = [];
            studentsAttendanceService.getAllStudentsAttendanceByActivity(schoolId, model.teacherId, model.listOfActivity[model.activity].name,model.attendance_day).then(function (studentAttendance) {
                if (Object.keys(studentAttendance).length > 0) {
                    var requests = Object.keys(studentAttendance).map(function (key, item) {
                        return new Promise(function (resolve) {
                            var attendanceObj = {};
                            attendanceObj.school_id = model.schoolId;
                            attendanceObj.Student_id = studentAttendance[key].main_student_id;
                            attendanceObj.Event_Name = model.listOfActivity[model.activity].name;
                            attendanceObj.time_in = $moment().format('HH:mm');
                            attendanceObj.is_absent = 1;
                            attendanceObj.attendance_day = model.attendance_day;
                            attendanceObj.entered_by = model.userId;
                            attendanceObj.entery_date = model.entryDate;

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
                    });

                    Promise.all(requests).then(function (result) {
                        if (results.includes(1)) {
                            model.getAllStudentsByActivity();
                            toastr.success('تم تسجيل ' + type + ' بنجاح');
                        } else {
                            toastr.error('الرجاء اختيار الطلاب');
                        }
                        //callback(response);
                    });
                }
            });
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
            studentsAttendanceService.getAllStudentsAttendanceByActivity(schoolId, model.teacherId, model.listOfActivity[model.activity].name,model.attendance_day).then(function (studentAttendance) {
                defer.resolve(studentAttendance);
                model.dtInstance.changeData(defer.promise);
                model.studentAttendance = studentAttendance;
            });

        }


        $scope.model = model;


        function recordExcuse(student_id){

            var dialogInst = $uibModal.open({
                templateUrl: 'views/students_attendance/recordExcuse.html',
                controller: 'recordExcusePopupCtrl',
                size: 'md',
                resolve: {
                    selectedStudent: function () {
                        return student_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    },
                    selectedActivity: function () {
                        return model.listOfActivity[model.activity];
                    },
                    selected_date: function () {
                        return model.attendance_day;
                    }
                }
            });
            dialogInst.result.then(function (result) {

                if (result.success) {
                    model.getAllStudentsByActivity();
                }

                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });

        }


        function recordShortAttendance(student_id) {

            var dialogInst = $uibModal.open({
                templateUrl: 'views/students_attendance/shortAttendace.html',
                controller: 'shortAttendacePopupCtrl',
                size: 'md',
                resolve: {
                    selectedStudent: function () {
                        return student_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    },
                    selectedActivity: function () {
                        return model.listOfActivity[model.activity];
                    },
                    selected_date: function () {
                        return model.attendance_day;
                    }
                }
            });
            dialogInst.result.then(function (result) {

                if (result.success) {
                    model.getAllStudentsByActivity();
                }

                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };




        function recordAttendance(student_id, $event, type) {

            var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.Student_id = student_id;
            attendanceObj.Event_Name = model.listOfActivity[model.activity].name;
            attendanceObj.time_in = $moment().format('HH:mm');
            attendanceObj.is_absent = 1;
            attendanceObj.attendance_day = model.attendance_day;
            attendanceObj.entered_by = model.userId;
            attendanceObj.entery_date = model.entryDate;
            var currentTime = $moment(model.currentTime, "h:mm A", 'en').format('HH:mm');
            if ((($moment(currentTime).isBefore($moment(model.listOfActivity[model.activity].Begining_Time, 'HH:mm'))) || ($moment(model.listOfActivity[model.activity].Ending_Time, 'HH:mm').isBefore($moment(currentTime, 'HH:mm')))) && type == 'متأخر') {
                toastr.error('الوقت المدخل خارج وقت النشاط');
                return;
            }

            if (type == 'خروج مبكر') {
                recordShortAttendance(student_id);
            } else {
            if (type == 'حضور') {
                console.log(model.listOfActivity[model.activity].Begining_Time);
                attendanceObj.time_in =  moment(model.listOfActivity[model.activity].Begining_Time).format('HH:mm');
			    console.log( attendanceObj.time_in);
            }

            if (type == 'حضور' || type == 'متأخر') {
                attendanceObj.is_absent = 0;
            }

            if (attendanceObj.is_absent == 1) {
                attendanceObj.time_in = model.listOfActivity[model.activity].Ending_Time;
            }

            console.log(attendanceObj);

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
                    },
                    Event_Name:function(){
                        return model.listOfActivity[model.activity].name;
                    },selectedEvent:function(){
						return model.listOfActivity[model.activity];
					}
					
					

                }
            });
            dialogInst.result.then(function (result) {
                console.log('open');

                if (result.success) {
                    //angular.element($event.target).attr('disabled', 'disabled');
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


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function (toastr, studentExcuseService, $moment, $scope, $uibModalInstance,Event_Name, selectedStudent,selectedDate,selectedEvent, schoolId, $log) {
    var currentTime = $moment().format('h:mm A');
    var currentDate = $moment(selectedDate).format('MM/DD/YYYY');

    var ExcuseObj = {};
    ExcuseObj.School_id = schoolId;
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
		    var Departure_time = $moment($scope.ExcuseObj.Departure_time,'h:mm A').format('HH:mm');
            var Return_time = $moment($scope.ExcuseObj.Return_time,'h:mm A').format('HH:mm');
          
            if($moment(Return_time,'HH:mm').isBefore($moment(Departure_time,'HH:mm'))){
                toastr.error('وقت العوده اقل من وقت الذهاب');
                return;
            }


        var startTime = $moment(selectedEvent.Begining_Time).format('HH:mm');
        var endTime = $moment(selectedEvent.Ending_Time).format('HH:mm');

        console.log('selectedEvent.Begining_Time');
        console.log(startTime);
        console.log(endTime);
			
			if((($moment(Departure_time,'HH:mm').isBefore( $moment(startTime,'HH:mm'))) ||  ($moment(endTime,'HH:mm').isBefore($moment(Return_time,'HH:mm')))) ) {
                toastr.error('وقت الاستئذان خارج وقت الدوام');
                return;
			}
			
        studentExcuseService.sendStudentExcuseRequest($scope.ExcuseObj,Event_Name, function (result) {
            console.log($scope.ExcuseObj);
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});


angular.module('MetronicApp').controller('shortAttendacePopupCtrl', function (localStorageService,toastr, studentsAttendanceService, $moment, $scope, $uibModalInstance, selectedStudent,selectedActivity, schoolId,selected_date, $log) {

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
        selectedStudent: selectedStudent,
        currentTime: $moment().format('h:mm A'),
        onCancel: onCancel,
        onSave: onSave,
        activity: selectedActivity,
        userId:userId,
        entryDate:entryDate
    };
    $scope.model = model;


    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function onSave() {
        console.log(model.currentTime);
        console.log(selectedActivity.Begining_Time);
        var currentTime = $moment(model.currentTime,"h:mm A",'en').format('HH:mm');
        if((($moment(currentTime).isBefore( $moment(selectedActivity.Begining_Time,'HH:mm'))) ||  ($moment(selectedActivity.Ending_Time,'HH:mm').isBefore($moment(model.currentTime,'HH:mm')))) ){
            toastr.error('الوقت المدخل خارج وقت النشاط');
            return;
        }
        let activityAttendance = {
            school_id: schoolId,
            Student_id: selectedStudent,
            is_absent: 2,
            Event_Name: selectedActivity.event_Nam,
            Begining_Time: selectedActivity.Begining_Time,
            Ending_Time: selectedActivity.Ending_Time,
            attendance_day : selected_date,
            entery_date:model.entryDate,
            entered_by:model.userId,
            time_out : model.currentTime
        }





        studentsAttendanceService.setStudentAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});

angular.module('MetronicApp').controller('recordExcusePopupCtrl', function (localStorageService,toastr, studentsAttendanceService, $moment, $scope, $uibModalInstance, selectedStudent,selectedActivity, schoolId,selected_date, $log) {

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
        selectedStudent: selectedStudent,
        currentTime: $moment().format('h:mm A'),
        onCancel: onCancel,
        absent_reasons:'',
        RecordAbsentReason: RecordAbsentReason,
        activity: selectedActivity,
        userId:userId,
        entryDate:entryDate
    };
    $scope.model = model;


    function onCancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function RecordAbsentReason() {

        let activityAttendance = {
            school_id: schoolId,
            Student_id: selectedStudent,
            Event_Name: selectedActivity.event_Nam,
            attendance_day : selected_date,
            absent_reasons:model.absent_reasons,
            is_absent:1,
            time_in : selectedActivity.Ending_Time,
            on_vacation:1

        }




        console.log(activityAttendance);
        studentsAttendanceService.setStudentAttendance(activityAttendance, function (result) {
            if (result.success) {
                toastr.success(result.msg);
            } else {
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});
