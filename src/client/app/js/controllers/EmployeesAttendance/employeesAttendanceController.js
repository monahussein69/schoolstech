angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService) {

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


        $scope.confirmTimeIn = function(employee_id){
            var dialogInst = $uibModal.open({
                templateUrl: 'views/employees_attendance/ConfirmInTime.html',
                controller: 'DialogInstCtrl',
                size: 'md',
                resolve: {
                    selectedEmployee: function () {
                        return employee_id;
                    },
                    schoolId: function () {
                        return model.schoolId;
                    }
                }
            });
            dialogInst.result.then(function (newusr) {
                //$scope.usrs.push(newusr);
                //$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
                console.log('open');
            }, function () {
                console.log('close');
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

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



angular.module('MetronicApp').controller('DialogInstCtrl', function(toastr ,employeesAttendanceService ,$moment,$scope, $uibModalInstance, selectedEmployee,schoolId, $log) {
    $scope.selectedEmployee = selectedEmployee;
    $scope.currentTime = $moment().format('HH:mm');
    $scope.submitAttendance = function () {

        //	$scope.usr = {name: '', job: '', age: '', sal: '', addr:''};
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.recordAttendance = function(){


        var attendanceObj = {};
        attendanceObj.school_id = schoolId;
        attendanceObj.employee_id = selectedEmployee;
        attendanceObj.Event_Name = 'بدايه الدوام';
        attendanceObj.is_absent = 0;
        attendanceObj.time_in = $scope.currentTime;


        employeesAttendanceService.setEmployeeAttendance(attendanceObj,function (result) {
            if(result.success){
                toastr.success(result.msg);
            }else{
                toastr.error(result.msg);
            }
            $uibModalInstance.close();
        });
    }
});