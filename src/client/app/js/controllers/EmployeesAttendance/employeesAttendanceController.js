angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService) {

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
            emp_atts:[]
        };


        $scope.model = model;

        manageEmployeeService.getAllEmployees(schoolId).then(function (employees) {
            model.emp_atts = employees;
            $scope.$apply();
        });



        function recordAttendance(emp_id,type,$event){


         var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.employee_id = emp_id;
            attendanceObj.Event_Name = 'بدايه الدوام';
            attendanceObj.is_absent = 1;
            if(type == 'حضور') {
                attendanceObj.is_absent = 0;
            }

            employeesAttendanceService.setEmployeeAttendance(attendanceObj,function (result) {
                if(result.success){
                    toastr.success(result.msg);
                }else{
                    toastr.error(result.msg);
                }
            });
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
