angular.module('MetronicApp').controller('LoginController', function($rootScope, $scope , $http) {
    console.log("login Controaller");
    $scope.model = {
        username : '',
        password : '',
        onLogin : onLogin,
        error : null,

    };

    function onLogin(){
        console.log("هاااااااااااااااي ");
    }
    // $scope.$on('$viewContentLoaded', function() {
    //     // initialize core components
    //     // App.initAjax();
    // });

    // set sidebar closed and body solid layout mode
    // $rootScope.settings.layout.pageContentWhite = true;
    // $rootScope.settings.layout.pageBodySolid = false;
    // $rootScope.settings.layout.pageSidebarClosed = false;
});