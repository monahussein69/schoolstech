angular.module('MetronicApp').controller('vacationTypesSettingsController',
    function (manageVacationTypesService,$compile,DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService,toastr) {


        var model = {
            VacationTypes: [],
            saveVacationType: saveVacationType,
            VacationType:{},
            EditVacationType:EditVacationType,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();

                manageVacationTypesService.getAllVacationTypes().then(function (VacationTypes) {
                    model.VacationTypes = VacationTypes;
                    defer.resolve(VacationTypes);
                    $scope.$apply();
                });
                return defer.promise
            }).withOption('createdRow', createdRow),
            columns: [
                DTColumnBuilder.newColumn('Name_A').withTitle('الاسم بالعربي'),
                DTColumnBuilder.newColumn('Name_E').withTitle('الاسم بالانجليزي'),
                DTColumnBuilder.newColumn('MaxAnount').withTitle('اعلى قيمه'),
                DTColumnBuilder.newColumn('MinLength').withTitle('اقل قيمه'),
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
                '<a href="#" ng-click="model.EditVacationType('+data.Id+')">'+
                '<i class="icon-pencil"></i>&nbsp; تعديل </a>';


        }



        function saveVacationType() {
            if (Object.keys(model.VacationType).length) {

                manageVacationTypesService.saveVacationTypeData(model.VacationType, function (response) {

                    if (response.success) {
                        model.dtInstance.reloadData();
                        toastr.success(response.msg);
                        model.VacationType = {};
                    } else {
                        toastr.error(response.msg);
                    }
                });
            }
        }

        function EditVacationType(VacationTypeId){
            manageVacationTypesService.getVacationType(VacationTypeId,function (result){
                model.VacationType = result;
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