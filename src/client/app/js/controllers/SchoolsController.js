angular.module('MetronicApp').controller('SchoolsController', function($rootScope, $scope , $http, $window , localStorageService,manageSchoolService) {
    var model = {
     deleteSchool : deleteSchool
    };
    $scope.model = model;


    function deleteSchool(schoolId){
        manageSchoolService.deleteSchoolData(schoolId, function(response) {

            if(response.success){
               model.success = response.msg;
            }else{
                model.error = response.msg;
            }

        });
    }

    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});



angular.module('MetronicApp').controller('ManageSchoolController', function($stateParams, $rootScope, $scope , $http, $window , localStorageService,manageSchoolService) {


    var model = {
        SchoolObj : {},
        saveSchool: saveSchool,
        error:null
    };


    $scope.model = model;




    if($stateParams.schoolId){
        model.SchoolObj.schoolId = $stateParams.schoolId;
        manageSchoolService.getSchoolData($stateParams.schoolId, function(response) {
            model.SchoolObj.name = response[0].name;
            model.SchoolObj.gender = response[0].gender;
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

    function saveSchool(){
        if(Object.keys($scope.model.SchoolObj).length){

            manageSchoolService.saveSchoolData($scope.model.SchoolObj, function(response) {
                if(response.success) {
                    model.success = response.msg;
                } else {
                    model.error = response.msg;
                    console.log('error');
                }
            });

        }

    }


    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});




angular.module('MetronicApp').controller('ManageSchoolAccountController', function($stateParams, $rootScope, $scope , $http, $window , localStorageService,manageSchoolAccountService) {


    var model = {
        SchoolObj : {},
        saveSchoolAccount: saveSchoolAccount,
        error:null,
        success:null
    };


    $scope.model = model;




    if($stateParams.schoolId){
        model.SchoolAccountObj.schoolId = $stateParams.schoolId;
        manageSchoolAccountService.getSchoolAccountData($stateParams.schoolId, function(response) {
            model.SchoolAccountObj.accountName = response[0].accountName;
            model.SchoolAccountObj.accountStatus = response[0].accountStatus;
            model.SchoolAccountObj.activationDate = response[0].activationDate;
            model.SchoolAccountObj.expirationDate = response[0].expirationDate;
            model.SchoolAccountObj.contactPerson = response[0].contactPerson;
            model.SchoolAccountObj.contactEmail = response[0].contactEmail;
            model.SchoolAccountObj.contactTitle = response[0].contactTitle;
            model.SchoolAccountObj.contactMobile = response[0].contactMobile;
            model.SchoolAccountObj.contactPhone = response[0].contactPhone;
            model.SchoolAccountObj.contactPostal = response[0].contactPostal;
            model.SchoolAccountObj.contactMailBox = response[0].contactMailBox;
        });
    }

    function saveSchoolAccount(){
        if(Object.keys($scope.model.SchoolAccountObj).length){

            manageSchoolService.saveSchoolAccountData($scope.model.SchoolAccountObj, function(response) {
                if(response.success) {
                    model.success = response.msg;
                } else {
                    model.error = response.msg;
                    console.log('error');
                }
            });

        }

    }


    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});