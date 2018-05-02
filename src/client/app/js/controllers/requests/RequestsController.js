angular.module('MetronicApp').controller('RequestsController',
    function ($compile, $rootScope, $scope, $http, $window, localStorageService, RequestsService, Upload, toastr, DTOptionsBuilder, DTColumnBuilder, $q, CommonService) {

        var userObject = localStorageService.get('UserObject');
        console.log(userObject);
        var model = {
            requests: [],
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                if (userObject[0].userType == 3) {
                    let employee_id = userObject[0].employeeData[0].id;
                    RequestsService.getEmployeeRequests(employee_id, function (requests) {
                        defer.resolve(requests);
                        model.requests = requests;
                    });
                    return defer.promise
                } else if (userObject[0].userType == 2) {
                    let school_id = userObject[0].schoolId;
                    RequestsService.getSchoolRequests(school_id, function (requests) {
                        defer.resolve(requests);
                        model.requests = requests;
                    });
                    return defer.promise
                }
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Name').withTitle('نوع الطلب').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('reason').withTitle('السبب').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('created_at').withTitle('وقت الطلب').withOption('type', 'date'),
                DTColumnBuilder.newColumn('status').withTitle('الحالة').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('Start_Date').withTitle('بداية الاجازة').withOption('defaultContent', 'غير مدخل'),
                DTColumnBuilder.newColumn('End_Date').withTitle('نهاية الاجازة').withOption('defaultContent', 'غير مدخل')

            ],
            dtInstance: {},
            changeStatusForRequests: changeStatusForRequests
        };
        $scope.model = model;
        if (userObject[0].userType == 2) {
            model.columns[5] = DTColumnBuilder.newColumn('name').withTitle('الموظف').withOption('defaultContent', 'غير مدخل');
            model.columns[6] = DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
                .renderWith(actionsHtml);
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            if (userObject[0].userType == 2) {
                console.log('data : ', data);
                if (data.status == "مقبول") {
                    return '' + '<button class="btn btn-danger" ng-click="model.changeStatusForRequests(\'مرفوض\' ,' + data.request_id + ')"> رفض </button>';
                } else if (data.status == "مرفوض") {
                    return '' + '<button class="btn btn-primary" ng-click="model.changeStatusForRequests(\'مقبول\' , ' + data.request_id + ')"> قبول  </button>'
                } else {
                    return '' + '<button class="btn btn-primary" ng-click="model.changeStatusForRequests(\'مقبول\' , ' + data.request_id + ')"> قبول  </button>'
                        + '<button class="btn btn-danger" ng-click="model.changeStatusForRequests(\'مرفوض\' ,' + data.request_id + ')"> رفض </button>'
                }
            }
        }

        function changeStatusForRequests(status, id) {
            RequestsService.changeStatusForRequests(status, id, function (result) {
                if (result.success) {
                    model.dtInstance.reloadData();
                    toastr.success(result.msg);
                } else {
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
    }).directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);

angular.module('MetronicApp').controller('ManageRequestsController', function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, RequestsService, toastr) {
    var userObject = localStorageService.get('UserObject');
    console.log(userObject);
    var model = {
        requestObj: {
            school_id: userObject[0].schoolId,
            created_at: moment().format('YYYY/MM/DD'),
            created_by: userObject[0].employeeData[0].id,
            status: 'معلق',
            last_update: moment().format('YYYY/MM/DD'),
            last_update_By: userObject[0].employeeData[0].id,
        },
        requestsTypes: [],
        saveRequest: saveRequest,
        error: null,
        vacationsDays: vacationsDays
    };

    RequestsService.getRequestsTypes(function (response) {
        console.log('response : ', response);
        model.requestsTypes = response;
    });
    $scope.model = model;


    if ($stateParams.createdBy) {
        model.requestObj.createdBy = $stateParams.createdBy;
        RequestsService.getStudentData($stateParams.createdBy, function (response) {
            model.requestObj = response[0];
        });
    }

    function vacationsDays() {
        var start = moment(model.requestObj.Start_Date);
        var end = moment(model.requestObj.End_Date);
        var duration = moment.duration(end.diff(start));
        var days = duration.asDays();
        console.log(days);
        model.requestObj.No_Of_Days = days;
    };

    function saveRequest() {
        if (Object.keys(model.requestObj).length) {
            model.requestObj.request_type = parseInt(model.requestObj.request_type);
            model.requestObj.Start_Date = moment(model.requestObj.Start_Date).format('YYYY-MM-DD');
            model.requestObj.End_Date = moment(model.requestObj.End_Date).format('YYYY-MM-DD');
            RequestsService.saveRequestData(model.requestObj, function (response) {
                if (response.success) {
                    //model.success = response.msg;
                    $window.location.href = '#/requests';
                    toastr.success(response.msg);
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });
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
}).filter('isValidObject', function () {
    return function (obj) {
        return !(obj === undefined || obj === null || Object.keys(obj).length === 0);
    }
});