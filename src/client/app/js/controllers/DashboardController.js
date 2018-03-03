angular.module('MetronicApp')
    .controller('DashboardController', function (CommonService,$rootScope, $scope, $http, $timeout, localStorageService, $window, manageAppSettingsService) {
        var model = {
            loggedUser: '',
            calender: []
        };
        $scope.model = model;

        var LoggedUserData = localStorageService.get("UserObject");
        if (LoggedUserData == null) {
            $window.location.href = '#/login.html';
        } else {
                var userType = LoggedUserData[0].userType;
                var schoolId = 0;
                if (userType == 2) {
                    schoolId = LoggedUserData[0].schoolId;
                    var current_school_data = LoggedUserData[0].schoolData;
                    CommonService.checkPage(schoolId);
                }


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