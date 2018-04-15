angular.module('MetronicApp').controller('taskStatusSettingsController',
    function (manageTaskStatusService,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService,toastr) {


        var model = {
            TaskStatus: [],
            saveTaskStatus: saveTaskStatus,
            taskStatus:{},
            EditStatus:EditStatus,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();

                manageTaskStatusService.getAllTaskStatus().then(function (taskStatus) {
                    model.TaskStatus = taskStatus;
                    defer.resolve(taskStatus);
                    $scope.$apply();
                });
                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Name').withTitle(' اسم الحاله'),
                DTColumnBuilder.newColumn(null).withTitle('العمليات').notSortable()
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

            return ''+
                '<a href="#" ng-click="model.EditStatus('+data.Id+')">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>';


        }



        function saveTaskStatus() {
            if (Object.keys(model.taskStatus).length) {

                manageTaskStatusService.saveTaskStatusData(model.taskStatus, function (response) {

                    if (response.success) {
                        model.dtInstance.reloadData();
                        toastr.success(response.msg);
                        model.taskStatus = {};
                    } else {
                        toastr.error(response.msg);
                    }
                });
            }
        }

        function EditStatus(statusId){
            manageTaskStatusService.getTaskStatus(statusId,function (result){
                model.taskStatus = result;
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