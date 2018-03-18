angular.module('MetronicApp').controller('LoginController', function($rootScope, $scope , $http, $window , localStorageService,$location,manageSchoolService) {
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
                        var userObj = response.data.user;
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