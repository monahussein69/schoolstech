angular.module('MetronicApp').controller('StudentsController',
    function ($compile,$rootScope, $scope, $http, $window, localStorageService, StudentsService, Upload, toastr, DTOptionsBuilder, DTColumnBuilder, $q, CommonService) {

        var schoolId = 0;
        var config_step = -1;
        var config = false;
        var userObject = localStorageService.get('UserObject');
        if (userObject) {
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
            deleteStudent: deleteStudent,
            schoolId: schoolId,
            nextStep: nextStep,
            config: config,
            config_step: config_step,
            students: [],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                StudentsService.getAllStudents(schoolId).then(function (students) {
                    console.log('students');
                    console.log(students);
                    
                    defer.resolve(students);
                    model.students = students;
                });
                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('name').withTitle('اسم الطالب').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('Nationality').withTitle('الجنسية').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('Specialization').withTitle('التخصص').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('Identity_No').withTitle('رقم الهوية').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('student_record').withTitle('سجل الطالب').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('status').withTitle('الحالة').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                    .renderWith(actionsHtml)
            ],
            dtInstance: {},
            students: {}
        };
        $scope.model = model;

        CommonService.currentStep(schoolId, function (result) {
            model.config_step = result;
        });

        $scope.model.schoolId = schoolId;

        CommonService.checkPage(schoolId);



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
                '<a ui-sref="Master.studentExcuseRecord({studentId:{{'+data.student_id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل الاستئذان </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.studentAbsentRecord({studentId:{{'+data.student_id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل الغياب </a>'+
                '</li>'+
                '<li>'+
                '<a ui-sref="Master.studentLateRecord({studentId:{{'+data.student_id+'}}})">'+
                '<i class="fa fa-bars"></i>&nbsp; سجل التأخير </a>'+
                '</li>'+
                '</ul>'+
                '</div>';


        }

        function deleteStudent(studentId) {
            manageSchoolService.deleteStudentData(studentId, function (response) {
                if (response.success) {
                    var index = $scope.students.findIndex(function (student) {
                        return student.id == studentId
                    });
                    $scope.student.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }

        function doUpload() {
            console.log('File : ', $scope.file);
            model.upload($scope.file).then(function (students) {
                var resetPaging = true;
                model.dtInstance.reloadData(students, resetPaging);
            });

        };

        function nextStep(url) {
            CommonService.nextStep(model.schoolId, function (result) {
                $window.location.href = url;
            });
        }

        function upload(file) {
            return new Promise(function (resolve, reject) {
                Upload.upload({
                    url: 'http://138.197.175.116:3000/upload', //webAPI exposed to upload the file
                    data: {
                        file: file,
                        type: 'students',
                        schoolId: model.schoolId
                    } //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    console.log(resp);
                    if (resp.status === 200) { //validate success
                        toastr.success("تم رفع الملف بنجاح");
                        StudentsService.getAllStudents(model.schoolId).then(function (student) {
                        resolve(student);
                    });
                    } else {
                        toastr.error('هناك مشكلة في رفع الملف');
                    }
                }, function (resp) { //catch error
                    toastr.error('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    model.progress = progressPercentage; // capture upload progress

                    

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
    }]);

angular.module('MetronicApp').controller('StudentsDegreesController',
    function ($rootScope, $scope, $http, $window, localStorageService, StudentsService,manageJobTitleService, Upload, toastr, DTOptionsBuilder, DTColumnBuilder, $q) {
        console.log("StudentsDegreesController");
		
		
		var userObject = localStorageService.get('UserObject');
        if (userObject) {
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;

            } else {
                schoolId = $stateParams.schoolId;
            }
        }
		
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteStudent: deleteStudent,
			schoolId:schoolId,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                StudentsService.getAllStudents().then(function (students) {
                    defer.resolve(students);
                });
                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn('Name').withTitle('اسم الطالب'),
                DTColumnBuilder.newColumn('Nationality').withTitle('الجنسية'),
                DTColumnBuilder.newColumn('Specialization').withTitle('التخصص'),
                DTColumnBuilder.newColumn('Identity_No').withTitle('رقم الهوية'),
                DTColumnBuilder.newColumn('student_record').withTitle('سجل الطالب'),
                DTColumnBuilder.newColumn('status').withTitle('الحالة'),
            ],
            dtInstance: {},
            students: {}
        };
        $scope.model = model;


        function deleteStudent(studentId) {
            manageSchoolService.deleteStudentData(studentId, function (response) {
                if (response.success) {
                    var index = $scope.students.findIndex(function (student) {
                        return student.id == studentId
                    });
                    $scope.student.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }

        function doUpload() {
            console.log('File : ', $scope.file);
            model.upload($scope.file);
            }

        function upload(file) {

            manageJobTitleService.getJobTitleByName('معلم',function(result){
                var jobtitle_id = 0;
                if (Object.keys(result).length){
                    jobtitle_id = result[0].id;
                    return new Promise(function (resolve, reject) {
                        Upload.upload({
                            url: 'http://138.197.175.116:3000/upload', //webAPI exposed to upload the file
                            data: {
                                file: file,
                                type: 'studentsDegrees',
                                jobtitle_id:jobtitle_id,
								schoolId:model.schoolId,
                            } //pass file as data, should be user ng-model
                        }).then(function (resp) { //upload function returns a promise
                            console.log(resp);
                            if (resp.status === 200) { //validate success
                                toastr.success("تم رفع الملف بنجاح");
                            } else {
                                toastr.error('هناك مشكلة في رفع الملف');
                            }
                        }, function (resp) { //catch error
                            toastr.error('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                            model.progress = progressPercentage; // capture upload progress

                            StudentsService.getAllStudents().then(function (student) {
                                resolve(student);
                            });

                        });
                    });
                } else{
                    var jobTitleObj = {name:'معلم'};
                    manageJobTitleService.saveJobTitleData(jobTitleObj,function(result){
                        jobtitle_id = result.insertId;
                        return new Promise(function (resolve, reject) {
                            Upload.upload({
                                url: 'http://138.197.175.116:3000/upload', //webAPI exposed to upload the file
                                data: {
                                    file: file,
                                    type: 'studentsDegrees',
                                    jobtitle_id:jobtitle_id,
									schoolId:model.schoolId,
                                } //pass file as data, should be user ng-model
                            }).then(function (resp) { //upload function returns a promise
                                console.log(resp);
                                if (resp.status === 200) { //validate success
                                    toastr.success("تم رفع الملف بنجاح");
                                } else {
                                    toastr.error('هناك مشكلة في رفع الملف');
                                }
                            }, function (resp) { //catch error
                                toastr.error('Error status: ' + resp.status);
                            }, function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                                model.progress = progressPercentage; // capture upload progress

                                StudentsService.getAllStudents().then(function (student) {
                                    resolve(student);
                                });

                            });
                        });
                    });
                }
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
    }]);

angular.module('MetronicApp').controller('StudentsLateController',
    function ($moment,DTOptionsBuilder, DTColumnBuilder, $q, $stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter, manageEmployeeService , StudentsService,studentsAttendanceService ) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if (userObject) {
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }
        var attendance_day = $moment().format('MM/DD/YYYY');
        var statusList = ['غائب','متأخر','حاضر'];
        var model = {
            schoolId: schoolId,
            selectedStudentStatus:'',
            record: [],
            employeeList: [],
            getActivityByEmployeeId: getActivityByEmployeeId,
            getAttendanceBasedDate:getAttendanceBasedDate,
            getStudentsByActivityId: getStudentsByActivityId,
            attendance_day: attendance_day,
            selectedEmployee: 0,
            activityList: [],
            statusList:statusList,
            selectedActivity : 0,
            studentsList  : [],
            options:DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                defer.resolve(model.studentsList);


                return defer.promise
            }).withOption('paging',false),
            columns: [
                DTColumnBuilder.newColumn('student_name').withTitle(' اسم الطالب'),
                DTColumnBuilder.newColumn(null).withTitle('الحالة').notSortable()
                    .renderWith(actionsHtml),
                DTColumnBuilder.newColumn('late_min').withTitle('مدة التأخير')
            ],
            dtInstance: {},
        };


        $scope.model = model;



        manageEmployeeService.getAllTeachers(schoolId).then(employees => {
            model.employeeList = employees;
            $scope.$apply();
        });

        function actionsHtml(data, type, full, meta) {

           if(data.is_absent != null) {
               if (data.is_absent == 0 && (data.late_min == null || data.late_min == '')) {
                   return '<span>حاضر</span>';
               }
               if (data.is_absent == 0 && (data.late_min != null || data.late_min != '')) {
                   return '<span>متأخر</span>';
               }
               if (data.is_absent == 1) {
                   return '<span>غائب</span>';
               }
           }
           return '';
        }
        function actionsHtml2(data, type, full, meta) {

            return '<span>10 دقايق</span>'
                ;
        }

        function getAttendanceBasedDate(){
            model.getActivityByEmployeeId();
        }

        function getActivityByEmployeeId() {
            manageEmployeeService.getActivityByEmployeeId(model.selectedEmployee,model.schoolId,model.attendance_day).then(activites => {
                model.activityList = activites;
                $scope.$apply();
            });
        }
        function getStudentsByActivityId() {

            if(model.selectedStudentStatus != ''){
                var defer = $q.defer();

                studentsAttendanceService.getAllStudentsAttendanceByActivityAndStatus(model.schoolId, model.selectedEmployee, model.selectedActivity,model.attendance_day,model.statusList[model.selectedStudentStatus]).then(function (studentsList) {
                    defer.resolve(studentsList);
                    model.dtInstance.changeData(defer.promise);
                    model.studentsList = studentsList;
                });
            }else{
                var defer = $q.defer();

                studentsAttendanceService.getAllStudentsAttendanceByActivity(model.schoolId, model.selectedEmployee, model.selectedActivity,model.attendance_day).then(function (studentsList) {
                    defer.resolve(studentsList);
                    model.dtInstance.changeData(defer.promise);
                    model.studentsList = studentsList;
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
    });


angular.module('MetronicApp').controller('ManageStudentsController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageSchoolService, toastr) {


    var model = {
        studentObj: {},
        saveStudent: saveStudent,
        error: null
    };


    $scope.model = model;


    if ($stateParams.studentId) {
        model.StudentObj.studentId = $stateParams.studentId;
        manageStudentService.getStudentData($stateParams.studentId, function (response) {
            model.studentObj = response[0];
        });
    }

    function saveStudent() {
        if (Object.keys(model.studentObj).length) {
            console.log(model.studentObj);
            manageStudentService.saveStudentData(model.studentObj, function (response) {
                if (response.success) {
                    //model.success = response.msg;
                    $window.location.href = '#/schools.html';
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