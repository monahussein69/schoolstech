angular.module('MetronicApp').controller('ManageEmployeesController',
    function ($rootScope, $scope, $http,$stateParams, $window, localStorageService, manageEmployeeService, Upload, toastr) {
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteEmp: deleteEmp
        };
        $scope.model = model;

        var userObject = localStorageService.get('UserObject');
        var userType = userObject[0].userType;
        var schoolId = 0;
        if(userType == 2){
             schoolId = userObject[0].schoolId;
        }else{
             schoolId = $stateParams.schoolId;
        }

         manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
             $scope.employees = employees;

             $scope.$apply();
         });

        function deleteEmp(empId) {
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

            var userObject = localStorageService.get('UserObject');
            var userType = userObject[0].userType;
            var schoolId = 0;
            if(userType == 2){
                schoolId = userObject[0].schoolId;
            }else{
                schoolId = $stateParams.schoolId;
            }
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data: {
					file: file,
					type:'employee',
                    schoolId:schoolId
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

                manageEmployeeService.getAllEmployees().then(function (employees) {
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


angular.module('MetronicApp').controller('ManageEmployeeController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageEmployeeService,toastr,manageJobTitleService) {


    var model = {
        empDataObj: {},
        saveEmpData: saveEmpData,
        error: null,
        job_titles : {}
    };


    manageJobTitleService.getJobTitles(function (response) {
        model.job_titles = response;
    });

    $scope.model = model;

    var userObject = localStorageService.get('UserObject');
    var userType = userObject[0].userType;
    var schoolId = 0;
    if(userType == 2){
        schoolId = userObject[0].schoolId;
    }else{
        schoolId = $stateParams.schoolId;
    }

    model.empDataObj.schoolId = schoolId;
    if ($stateParams.empId) {
		  model.empDataObj.id = $stateParams.empId;
        manageEmployeeService.getEmpData($stateParams.empId, function (response) {
            model.empDataObj.identity_no =  response[0].identity_no;
            model.empDataObj.id_date =  response[0].id_date;
            model.empDataObj.school_id = response[0].school_id;
            model.empDataObj.name = response[0].name;
            model.empDataObj.jobtitle_id = response[0].jobtitle_id;
            model.empDataObj.nationality = response[0].nationality;
            model.empDataObj.birthdate =  response[0].birthdate;
            model.empDataObj.birth_place = response[0].birth_place;
            model.empDataObj.educational_level = response[0].educational_level;
            model.empDataObj.major = response[0].major;
            model.empDataObj.graduate_year = response[0].graduate_year;
            model.empDataObj.job_no =response[0].job_no;
            model.empDataObj.ministry_start_date = response[0].ministry_start_date;
            model.empDataObj.school_start_date =  response[0].school_start_date;
            model.empDataObj.current_position_date = response[0].current_position_date;
            model.empDataObj.degree = response[0].degree;
            model.empDataObj.address =  response[0].address;
            model.empDataObj.phone1 = response[0].phone1;
            model.empDataObj.phone2 = response[0].phone2;
            model.empDataObj.mobile = response[0].mobile;
            model.empDataObj.email = response[0].email;
            model.empDataObj.postal_code = response[0].postal_code;
            model.empDataObj.lectures_qouta = response[0].lectures_qouta;
            model.empDataObj.kids = response[0].kids;
            model.empDataObj.kids_under6 = response[0].kids_under6;
            model.empDataObj.kids_under24 = response[0].kids_under24;
            model.empDataObj.kids_over24 = response[0].kids_over24;
            model.empDataObj.notes = response[0].notes;
            model.empDataObj.photo_file = response[0].photo_file;

        });
    }

    function saveEmpData() {
        if (Object.keys(model.empDataObj).length) {
            manageEmployeeService.saveEmpData(model.empDataObj, function (response) {

                if (response.success) {
                    //model.success = response.msg;
                    //$window.location.href = '#/employees';
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
