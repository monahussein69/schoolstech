angular.module('MetronicApp').controller('SchoolsController',
    function ($rootScope, $scope, $http, $window, localStorageService, manageSchoolService, Upload, toastr) {
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteSchool: deleteSchool
        };
        $scope.model = model;

        manageSchoolService.getAllSchools().then(function (schools) {
            $scope.schools = schools;

            $scope.$apply();
        });

        function deleteSchool(schoolId) {
            manageSchoolService.deleteSchoolData(schoolId, function (response) {
                if (response.success) {
                    var index = $scope.schools.findIndex(function (school) {
                        return school.id == schoolId
                    });
                    $scope.schools.splice(index, 1);
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
                data: {file: file,
				 type:'school'
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

                manageSchoolService.getAllSchools().then(function (schools) {
                    $scope.schools = schools;

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


angular.module('MetronicApp').controller('ManageSchoolController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageSchoolService,toastr) {


    var model = {
        SchoolObj: {},
        saveSchool: saveSchool,
        error: null
    };


    $scope.model = model;


    if ($stateParams.schoolId) {
        model.SchoolObj.schoolId = $stateParams.schoolId;
        manageSchoolService.getSchoolData($stateParams.schoolId, function (response) {
            model.SchoolObj.name = response[0].name;
            model.SchoolObj.gender = response[0].gender;
            model.SchoolObj.schoolNum = response[0].schoolNum;
            model.SchoolObj.educationalRegion = response[0].educationalRegion;
            model.SchoolObj.educationalOffice = response[0].educationalOffice;
            model.SchoolObj.educationLevel = response[0].educationLevel;
            model.SchoolObj.educationLevel = response[0].educationLevel;
            model.SchoolObj.address = response[0].address;
            model.SchoolObj.totalClasses = response[0].totalClasses;
            model.SchoolObj.totalStudents = response[0].totalStudents;
            model.SchoolObj.totalStaff = response[0].totalStaff;
            model.SchoolObj.rentedBuildings = response[0].rentedBuildings;
            model.SchoolObj.governmentBuildings = response[0].governmentBuildings;
            model.SchoolObj.foundationYear = response[0].foundationYear;
            model.SchoolObj.logoFile = response[0].logoFile;
        });
    }

    function saveSchool() {
        if (Object.keys(model.SchoolObj).length) {
            console.log(model.SchoolObj);
            manageSchoolService.saveSchoolData(model.SchoolObj, function (response) {

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
}).filter('isValidObject', function(){
    return function(obj){
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
});


angular.module('MetronicApp').controller('ManageSchoolAccountController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageSchoolAccountService, manageSchoolService,toastr) {


    var model = {
        SchoolAccountObj: {},
        saveSchoolAccount: saveSchoolAccount,
        addActivation:addActivation,
        addExpiration:addExpiration,
        error: null,
        success: null
    };


    $scope.model = model;


    if ($stateParams.schoolId) {
        model.SchoolAccountObj.schoolId = $stateParams.schoolId;
        manageSchoolService.getSchoolData($stateParams.schoolId, function (response) {
            model.SchoolAccountObj.accountName = response[0].name;
        });
        manageSchoolAccountService.getSchoolAccountData($stateParams.schoolId, function (response) {
            if (Object.keys(response).length) {
                //model.SchoolAccountObj.accountName = response[0].accountName;
                model.SchoolAccountObj.accountStatus = response[0].accountStatus;
                model.SchoolAccountObj.activationDate = response[0].activationDate;
                model.SchoolAccountObj.expirationDate = response[0].expirationDate;
                model.SchoolAccountObj.expirationDuration = response[0].expirationDuration;
                model.SchoolAccountObj.expirationType = response[0].expirationType;
                model.SchoolAccountObj.contactPerson = response[0].contactPerson;
                model.SchoolAccountObj.contactEmail = response[0].contactEmail;
                model.SchoolAccountObj.contactTitle = response[0].contactTitle;
                model.SchoolAccountObj.contactMobile = response[0].contactMobile;
                model.SchoolAccountObj.contactPhone = response[0].contactPhone;
                model.SchoolAccountObj.contactPostal = response[0].contactPostal;
                model.SchoolAccountObj.contactMailBox = response[0].contactMailBox;

            }
        });
    }

    function addActivation(){
        if($scope.model.SchoolAccountObj.accountStatus == 'مفعل') {
            var date = new Date();
            $scope.model.SchoolAccountObj.activationDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        }else{
            $scope.model.SchoolAccountObj.activationDate = '';
            $scope.model.SchoolAccountObj.expirationDuration = 0;
            $scope.model.SchoolAccountObj.expirationType = '';
            $scope.model.SchoolAccountObj.expirationDate = '';
        }
    }

    function addExpiration(){
        if(model.SchoolAccountObj.expirationDuration && $scope.model.SchoolAccountObj.activationDate){
            var activateDate = $scope.model.SchoolAccountObj.activationDate;
            var type = model.SchoolAccountObj.expirationType;
            var duration = model.SchoolAccountObj.expirationDuration;
            var new_date = moment(activateDate).add(duration,type);
            var day = new_date.format('DD');
            var month = new_date.format('MM');
            var year = new_date.format('YYYY');
            model.SchoolAccountObj.expirationDate = year+'-'+month+'-'+day;
        }
    }

    function saveSchoolAccount() {
        if (Object.keys($scope.model.SchoolAccountObj).length) {

            manageSchoolAccountService.saveSchoolAccountData($scope.model.SchoolAccountObj, function (response) {
                if (response.success) {
                    model.success = response.msg;
                    $window.location.href = '#/schools.html';
                    toastr.success(response.msg);

                } else {
                    //model.error = response.msg;
                    //console.log('error');
                    toastr.error(response.msg);
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
});

angular.module('MetronicApp').controller('SchoolScheduleController',
    function ($rootScope, $scope, $http, $window, localStorageService, manageSchoolService, Upload, toastr) {
        var model = {
            upload: upload,
            doUpload: doUpload,
            progress: 0,
            deleteSchool: deleteSchool,
            schoolId : localStorageService.get('UserObject')[0].schoolId,
            schoolSchedule : [],
            loading : false
        };
        $scope.model = model;
        getSchoolTable();
        function getSchoolTable(){
            model.loading = true;
            manageSchoolService.getSchoolSchedule(model.schoolId, function (response) {
                let days = [];
                let lectures = [];
               let schedules = response;
                schedules.forEach(function(schedule){
                    if(!days.includes(schedule.Day)){
                        days.push(schedule.Day);
                    }
                    if(!lectures.includes(schedule.lecture_name)){
                        lectures.push(schedule.lecture_name);
                    }
                });
                console.log(response);
                model.days = days;
                model.lectures = lectures;
                model.schoolSchedule = response;
                model.loading = false;
            });
        }
        function deleteSchool(schoolId) {
            manageSchoolService.deleteSchoolData(schoolId, function (response) {
                if (response.success) {
                    var index = $scope.schools.findIndex(function (school) {
                        return school.id == schoolId
                    });
                    $scope.schools.splice(index, 1);
                    model.success = response.msg;
                    toastr.success(response.msg);
                } else {
                    model.error = response.msg;
                }

            });
        }

        function doUpload() {

            model.upload($scope.file);
        };

        function upload(file) {
            model.loading = true;
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data: {file: file,
                    type:'schoolSchedule',
                    schoolId : parseInt(model.schoolId)
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

                getSchoolTable();
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

angular.module('MetronicApp').filter('unique', function() {
    // we will return a function which will take in a collection
    // and a keyname
    return function(collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function(item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if(keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});

