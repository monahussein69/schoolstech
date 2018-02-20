angular.module('MetronicApp').controller('EmployeesController',
    function ($rootScope, $scope, $http, $window, localStorageService, manageEmployeeService, Upload, toastr) {
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteEmp: deleteEmp
        };
        $scope.model = model;

        manageEmployeeService.getAllEmp().then(function (employees) {
            $scope.employees = employees;

            $scope.$apply();
        });

        function deleteEmp(schoolId) {
            manageEmployeeService.deleteEmpData(empId, function (response) {
                if (response.success) {
                    var index = $scope.employees.findIndex(function (employee) {
                        return employee.id == empId
                    });
                    $scope.employees.splice(index, 1);
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
        };

        function upload(file) {
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data: {file: file} //pass file as data, should be user ng-model
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

                manageEmployeeService.getAllEmp().then(function (employees) {
                    $scope.employees = employees;

                    $scope.$apply();
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
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }])
;


angular.module('MetronicApp').controller('ManageEmployeeController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageEmployeeService,toastr) {


    var model = {
        empDataObj: {},
        saveEmpData: saveEmpData,
        error: null
    };


    $scope.model = model;


    if ($stateParams.empId) {
        manageEmployeeService.getEmpData($stateParams.empId, function (response) {

        });
    }

    function saveEmpData() {
        if (Object.keys(model.empDataObj).length) {
            manageEmployeeService.saveEmpData(model.empDataObj, function (response) {

                if (response.success) {
                    //model.success = response.msg;
                    $window.location.href = '#/employees';
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
}).filter('isValidObject', function(){
    return function(obj){
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
});
