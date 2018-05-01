angular.module('MetronicApp').controller('RequestsTypeSettingsController',
    function (manageRequestsTypeService,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService,toastr) {


        var model = {
            RequestTypes: [],
            saveRequestType: saveRequestType,
            RequestType:{},
            EditRequestType:EditRequestType,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();

                manageRequestsTypeService.getAllRequestsType().then(function (RequestTypes) {
                    model.RequestTypes = RequestTypes;
                    defer.resolve(RequestTypes);
                    $scope.$apply();
                });
                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Name').withTitle('الاسم'),
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
                '<a href="#" ng-click="model.EditRequestType('+data.Id+')">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>';


        }



        function saveRequestType() {
            if (Object.keys(model.RequestType).length) {

                manageRequestsTypeService.saveRequestTypeData(model.RequestType, function (response) {

                    if (response.success) {
                        model.dtInstance.reloadData();
                        toastr.success(response.msg);
                        model.RequestType = {};
                    } else {
                        toastr.error(response.msg);
                    }
                });
            }
        }

        function EditRequestType(RequestTypeId){
            manageRequestsTypeService.getRequestType(RequestTypeId,function (result){
                model.RequestType = result;
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