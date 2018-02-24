angular.module('MetronicApp')
    .controller('DashboardController', function ($rootScope, $scope, $http, $timeout, localStorageService, $window, manageAppSettingsService) {
        var model = {
            loggedUser: '',
            calender: []
        };
        $scope.model = model;

        var LoggedUserData = localStorageService.get("UserObject");
        if (LoggedUserData == null) {
            $window.location.href = '#/login.html';
        } else {
            manageAppSettingsService.getCalender(function (response) {
                var days = [];
                var weeks = [];
                model.calender = response.data;

                response.data.forEach(function (item, day_index) {
                    if(!weeks.includes(item.Week_Name)){
                        weeks.push(item.Week_Name);
                    }
                });

               $scope.weeks = weeks;
            });
            model.loggedUser = LoggedUserData[0].LoginName
        }


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });


        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });