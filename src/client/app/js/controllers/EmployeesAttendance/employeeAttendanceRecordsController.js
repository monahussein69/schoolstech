angular.module('MetronicApp').controller('employeeAttendanceLateRecordController',
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
                employeesAttendanceRecordsService.getEmployeeLateRecord(schoolId,employeeId).then(function (record) {
                    defer.resolve(record);
                    model.record = record;
                });

                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn('Day').withTitle(' اليوم'),
                DTColumnBuilder.newColumn('Date').withTitle(' التاريخ'),
                DTColumnBuilder.newColumn('Event_Name').withTitle(' النشاط'),
                DTColumnBuilder.newColumn('time_in').withTitle(' الساعه'),
                DTColumnBuilder.newColumn('late_min').withTitle(' عدد الدقائق'),
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

angular.module('MetronicApp').controller('employeeAttendanceAbsentRecordController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,employeesAttendanceRecordsService) {

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
                employeesAttendanceRecordsService.getEmployeeAbsentRecord(schoolId,employeeId).then(function (record) {
                    defer.resolve(record);
                    model.record = record;
                });

                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn(null).withTitle('اليوم').notSortable()
                    .renderWith(actionsHtml),
                DTColumnBuilder.newColumn('Start_Date').withTitle('التاريخ'),
                DTColumnBuilder.newColumn('excusetype_name').withTitle(' نوع العذر'),
                DTColumnBuilder.newColumn(null).withTitle('نوع الغياب').notSortable()
                    .renderWith(VacationTypeHtml),
                DTColumnBuilder.newColumn('No_Of_Days').withTitle('  عدد ايام الغياب'),
            ],
            dtInstance: {},
        };


        $scope.model = model;

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {

            var weekday = new Array(7);
            weekday[0] =  "الاحد";
            weekday[1] = "الاثنين";
            weekday[2] = "الثلاثاء";
            weekday[3] = "الاربعاء";
            weekday[4] = "الخميس";
            weekday[5] = "الجمعه";
            weekday[6] = "السبت";

            var day_number = new Date(data.Start_Date);
            var day = weekday[day_number.getDay()];

            return day;
        }

        function VacationTypeHtml(data, type, full, meta) {
            console.log(data.on_vacation);
         if(data.on_vacation){
             console.log('in if');
             return '<span>غياب بعذر</span>';
         }else{
             console.log('not in if');
             return '<span>غياب بدون عذر</span>';
         }

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

