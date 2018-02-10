angular.module('MetronicApp')
    .controller('DashboardController', function($rootScope, $scope, $http, $timeout,localStorageService, $window) {
        var model = {
            loggedUser : ''
        };
        var LoggedUserData = localStorageService.get("UserObject");
        if(LoggedUserData == null){
            $window.location.href = '#/login.html';
        }else{
            model.loggedUser = LoggedUserData[0].LoginName
        }

    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });




    $scope.model = model;

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});