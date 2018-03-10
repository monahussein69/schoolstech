angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService) {

        var schoolId = 0;
        var userObject = localStorageService.get('UserObject');
        if(userObject){
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }
        }

        var model = {
            schoolId:schoolId,
            recordAttendance:recordAttendance,
            emp_atts:{}
        };


        $scope.model = model;
        employeesAttendanceService.getAllEmployeesAttendance(schoolId).then(function (result) {
           model.emp_atts = result;
        });

        function recordAttendance(emp_id,type){


        }


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
