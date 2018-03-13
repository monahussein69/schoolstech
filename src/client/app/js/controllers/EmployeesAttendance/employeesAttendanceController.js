angular.module('MetronicApp').controller('employeesAttendanceController',
    function ($uibModal,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceService,manageEmployeeService,WorkingSettingsService) {

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
            closeAttendance:closeAttendance,
            ExcuseRequest:ExcuseRequest,
            emp_atts:[],
            activeProfile : {}
        };


        $scope.model = model;

        WorkingSettingsService.getActiveSettingsData(schoolId,function(result){
           model.activeProfile  = result[0];
        });


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


       function ExcuseRequest(employee_id,$event){
               var dialogInst = $uibModal.open({
                   templateUrl: 'views/employees_attendance/ExcuseFormRequest.html',
                   controller: 'ExcuseDialogCtrl',
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
               dialogInst.result.then(function (result) {
                   console.log('open');
                   console.log(angular.element($event.target).attr('disabled','disabled'));

                   if(result.success){

                   }
               }, function () {
                   console.log('close');
                   //$log.info('Modal dismissed at: ' + new Date());
               });
           }

       function closeAttendance(){
           employeesAttendanceService.closeFirstAttendance( model.schoolId,function (result) {
               if(result.success){
                   toastr.success(result.msg);
               }else{
                   toastr.error(result.msg);
               }
           });
       }

        function recordAttendance(emp_id,type){


         var attendanceObj = {};
            attendanceObj.school_id = model.schoolId;
            attendanceObj.employee_id = emp_id;
            attendanceObj.Event_Name = 'طابور';
            attendanceObj.is_absent = 1;
            if(type == 'حضور') {
                attendanceObj.is_absent = 0;
            }else if(type == 'غياب بعذر'){
                attendanceObj.on_vacation = 1;
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
        attendanceObj.Event_Name = 'طابور';
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


angular.module('MetronicApp').controller('ExcuseDialogCtrl', function(toastr ,employeesExcuseService ,$moment,$scope, $uibModalInstance, selectedEmployee,schoolId, $log) {
    var currentTime = $moment().format('HH:mm');
    var currentDate = $moment().format('MM/DD/YYYY');

    var ExcuseObj = {};
    ExcuseObj.school_id = schoolId;
    ExcuseObj.Emp_id = selectedEmployee;
    ExcuseObj.Departure_time = currentTime;
    ExcuseObj.Return_time = currentTime;
    ExcuseObj.Start_Date = currentDate;
    ExcuseObj.End_Date = currentDate;
    $scope.ExcuseObj = ExcuseObj;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ExcuseRequest = function(){

        employeesExcuseService.sendExcuseRequest(ExcuseObj,function (result) {
            if(result.success){
                toastr.success(result.msg);

            }else{
                toastr.error(result.msg);
            }
            $uibModalInstance.close(result);
        });
    }
});