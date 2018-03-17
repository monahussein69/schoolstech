angular.module('MetronicApp').controller('StudentsController',
    function ($rootScope, $scope, $http, $window, localStorageService, StudentsService, Upload, toastr, DTOptionsBuilder, DTColumnBuilder, $q) {
        console.log("salim");

        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteStudent: deleteStudent,
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
            model.upload($scope.file).then(function(students){
                var resetPaging = true;
                model.dtInstance.reloadData(students, resetPaging);
            });

        };

        function upload(file) {
            return new Promise(function (resolve, reject) {
                Upload.upload({
                    url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                    data: {
                        file: file,
                        type: 'student'
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
    function ($rootScope, $scope, $http, $window, localStorageService, StudentsService, Upload, toastr, DTOptionsBuilder, DTColumnBuilder, $q) {
        console.log("StudentsDegreesController");
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteStudent: deleteStudent,
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
            model.upload($scope.file).then(function(students){
                var resetPaging = true;
                model.dtInstance.reloadData(students, resetPaging);
            });

        };

        function upload(file) {
            return new Promise(function (resolve, reject) {
                Upload.upload({
                    url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                    data: {
                        file: file,
                        type: 'studentsDegrees'
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