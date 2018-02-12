angular.module('MetronicApp').controller('SchoolsController', function($rootScope, $scope , $http, $window , localStorageService) {
    var model = {

    };
    $scope.model = model;



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
    }

    function saveSchool(){
        if(Object.keys($scope.model.SchoolObj).length){

            manageSchoolService.saveSchoolData($scope.model.SchoolObj, function(response) {
                if(response.success) {
                    console.log('added Successfully');
                } else {
                    $scope.model.error = response.msg;
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