angular.module('MetronicApp').controller('employeeAttendanceExecuseRecordController',
    function (DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceRecordsService) {

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

        var employeeId = $stateParams.employeeId;

        var model = {
            schoolId:schoolId,
            employeeId:employeeId,
            record:[],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                employeesAttendanceRecordsService.getEmployeeExcuseRecord(schoolId,employeeId).then(function (record) {
                    defer.resolve(record);
                    model.record = record;
                });

                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn('Start_Day').withTitle(' البدايه / اليوم'),
                DTColumnBuilder.newColumn('Start_Date').withTitle(' البدايه / التاريخ'),
                DTColumnBuilder.newColumn('Departure_time').withTitle(' وقت الخروج'),
                DTColumnBuilder.newColumn('End_Day').withTitle('النهايه / اليوم'),
                DTColumnBuilder.newColumn('Return_time').withTitle('وقت العوده'),
                DTColumnBuilder.newColumn('End_Date').withTitle(' النهايه /تاريخ'),
            ],
            dtInstance: {},
        };


        $scope.model = model;





        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

