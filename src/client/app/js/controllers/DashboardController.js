angular.module('MetronicApp')
    .controller('DashboardController', function (CommonService,$rootScope, $scope, $http, $timeout, localStorageService, $window, manageSchoolAccountService,manageSchoolService) {
        var model = {
            loggedUser: '',
            calender: [],
			countSchools:0,
			countSchoolsAccount : 0
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
				
            model.loggedUser = LoggedUserData[0].LoginName
        }
		
		manageSchoolAccountService.countSchoolsAccounts(function(result){
			model.countSchoolsAccount = result.count;
		});
		
		manageSchoolService.countSchools(function(result){
			model.countSchools = result.count;
		});


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });


        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });