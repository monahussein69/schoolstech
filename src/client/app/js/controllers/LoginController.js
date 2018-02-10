angular.module('MetronicApp').controller('LoginController', function($rootScope, $scope , $http, $window , localStorageService) {
    var model = {
        username : '',
        password : '',
        onLogin : onLogin,
        error : null,

    };
    $scope.model = model;

    function onLogin() {

        model.error = null;
        if ($scope.model.username && $scope.model.password){
            $http.post("http://localhost:3000/login", {
                'name': $scope.model.username,
                'password': $scope.model.password
            })
                .then(function (response) {
                    if (response.data.success) {
                        localStorageService.set('UserObject', response.data.user);
                        $window.location.href = '#/dashboard.html';
                    } else {
                        model.error = "خطأ في اسم المستخدم او كلمه المرور";
                    }
                    //$scope.myWelcome = response.data;
                });
       }else{
            model.error = "الرجاء ادخال اسم المستخدم و كلمه المرور";
        }
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