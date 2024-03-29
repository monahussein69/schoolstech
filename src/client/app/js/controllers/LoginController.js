angular.module('MetronicApp').controller('LoginController', function($rootScope, $scope , $http, $window , localStorageService,$location,manageSchoolService,manageEmployeeService) {
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
            $http.post("http://138.197.175.116:3000/login", {
                'name': $scope.model.username,
                'password': $scope.model.password
            })
                .then(function (response) {
                    if (response.data.success) {
                        var userObj = response.data.user;
                        console.log(userObj);
                        userObj[0].config_flag = false;
                        if (userObj[0].userType == 2){
                            var schoolId = userObj[0].schoolId;
                        manageSchoolService.getSchoolData(schoolId, function (response) {
                            userObj[0].schoolData = response;

                            if (response[0].config_steps  < 4) {
                                userObj[0].config_flag = true;
                            }
                            localStorageService.set('UserObject', userObj);
                            if (response[0].config_steps == 0){
                                $window.location.href = '#/manageEmployees/';

                            } else if (response[0].config_steps == 1) {
                                $window.location.href = '#/manageLeaders';
                            } else if (response[0].config_steps == 2) {
                                $window.location.href = '#/students';
                            }else if (response[0].config_steps == 3) {
                                $window.location.href = '#/school-schedule';
                            }

                        });
                    }

                        else if (userObj[0].userType == 3){
                            var userId = userObj[0].id;
                            manageEmployeeService.getEmployeeByUserId(userId, function (response) {
                                userObj[0].employeeData = response;
                                console.log(userObj)
                                localStorageService.set('UserObject', userObj);
                            });
                        }else{
                            localStorageService.set('UserObject', userObj);
                        }

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

angular.module('MetronicApp').controller('forgetPasswordController', function(toastr,$rootScope, $scope , $http, $window , localStorageService,$location,manageSchoolService,manageEmployeeService) {
    var model = {
        email : '',
        loginName : '',
        resetPassword : resetPassword,
        error : null,

    };
    $scope.model = model;

    function resetPassword() {

        model.error = null;
        if ($scope.model.email && $scope.model.loginName){
            $http.post("http://138.197.175.116:3000/resetPasswprd", {
                'email': $scope.model.email,
                'loginName': $scope.model.loginName
            })
                .then(function (response) {
                    console.log(response);
                    if(response.data.success) {
                        toastr.success(response.data.msg);
                    }else{
                        toastr.error(response.data.msg);
                    }
                });
        }else{
            model.error = "الرجاء ادخال البريد الالكتروني و اسم المستخدم ";
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

