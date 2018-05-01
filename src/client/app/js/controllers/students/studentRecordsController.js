angular.module('MetronicApp').controller('studentExecuseRecordsController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,studentRecordsService) {

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

        var studentId = $stateParams.studentId;

        var model = {
            schoolId:schoolId,
            studentId:studentId,
            record:[],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                studentRecordsService.getStudentExcuseRecord(schoolId,studentId).then(function (record) {
                    defer.resolve(record);
                    model.record = record;
                });

                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn(null).withTitle('اليوم').notSortable()
                    .renderWith(actionsHtml),
                DTColumnBuilder.newColumn('Departure_time').withTitle(' وقت الخروج'),
                DTColumnBuilder.newColumn('Return_time').withTitle('وقت العوده'),
                DTColumnBuilder.newColumn('Event_Name').withTitle('النشاط'),
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




        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            // App.initAjax();
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });


angular.module('MetronicApp').controller('studentLateRecordsController',
    function (DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,studentRecordsService) {

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

        var studentId = $stateParams.studentId;

        var model = {
            schoolId:schoolId,
            studentId:studentId,
            record:[],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                studentRecordsService.getStudentLateRecord(schoolId,studentId).then(function (record) {
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



   angular.module('MetronicApp').controller('studentAbsentRecordsController',
    function ($compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,studentRecordsService) {

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

        var studentId = $stateParams.studentId;

        var model = {
            schoolId:schoolId,
            studentId:studentId,
            record:[],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                studentRecordsService.getStudentAbsentRecord(schoolId,studentId).then(function (record) {
                    defer.resolve(record);
                    model.record = record;
                });

                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Day').withTitle(' البدايه / اليوم'),
                DTColumnBuilder.newColumn('Date').withTitle(' البدايه / التاريخ'),
                DTColumnBuilder.newColumn('Event_Name').withTitle(' النشاط'),
                DTColumnBuilder.newColumn(null).withTitle('نوع الغياب').notSortable()
                    .renderWith(actionsHtml)

            ],
            dtInstance: {},
        };


        $scope.model = model;


        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {

            if(data.on_vacation ) {
               return  '<span>غائب بعذر </span>';
            }else {
                return '<span>غائب بدون عذر</span>';
            }

            return '';
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
