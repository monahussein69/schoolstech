angular.module('MetronicApp').controller('ExcuseTypesSettingsController',
    function (manageExcuseTypeService,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService,toastr) {


        var model = {
            ExcuseTypes: [],
            saveExcuseType: saveExcuseType,
            ExcuseType:{},
            EditExcuseType:EditExcuseType,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();

                manageExcuseTypeService.getAllExcuseTypes().then(function (ExcuseTypes) {
                    model.ExcuseTypes = ExcuseTypes;
                    defer.resolve(ExcuseTypes);
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
                '<a href="#" ng-click="model.EditExcuseType('+data.Id+')">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>';


        }



        function saveExcuseType() {
            if (Object.keys(model.ExcuseType).length) {

                manageExcuseTypeService.saveExcuseTypeData(model.ExcuseType, function (response) {

                    if (response.success) {
                        model.dtInstance.reloadData();
                        toastr.success(response.msg);
                        model.ExcuseType = {};
                    } else {
                        toastr.error(response.msg);
                    }
                });
            }
        }

        function EditExcuseType(ExcuseTypeId){
            manageExcuseTypeService.getExcuseType(ExcuseTypeId,function (result){
                model.ExcuseType = result;
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