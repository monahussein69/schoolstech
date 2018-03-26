angular.module('MetronicApp').controller('subJobTitleSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageSubJobTitleService,toastr) {


        var model = {
            subjobTitles: {},
            savesubJobTitle: savesubJobTitle,
            subjobTitle:{},
            editedSubJobTitle:{},
            error: null,
            editSubJobTitle:editJobTitle,
            EnableEditing:EnableEditing
        };

        if ($stateParams.jobTitleId) {
        model.subjobTitle.job_title_id = $stateParams.jobTitleId;
        }else{
            $window.location.href = '#/manageJobTitles';
            toastr.success('المسمى الوظيفي غير موجود');
        }


        $scope.model = model;
        manageSubJobTitleService.getSubJobTitles($stateParams.jobTitleId,function (response) {
            model.subjobTitles = response;
        });


        function EnableEditing(name,id){
            model.editedSubJobTitle.name = name;
            model.editedSubJobTitle.id = id;
            model.editedSubJobTitle.job_title_id = $stateParams.jobTitleId;
        }

        function editJobTitle() {
            if (Object.keys(model.editedSubJobTitle).length && model.editedSubJobTitle.name) {
                manageSubJobTitleService.saveSubJobTitleData(model.editedSubJobTitle, function (response) {
                    if (response.success) {
                        toastr.success(response.msg);
                        manageSubJobTitleService.getSubJobTitles($stateParams.jobTitleId,function (response) {
                            model.subjobTitles = response;
                        });
                    } else {
                        toastr.error(response.msg);
                    }
                    model.jobTitle = {};
                    $scope.enable_to_edit = false;
                });
            }
        }

        function savesubJobTitle() {
            if (Object.keys(model.subjobTitle).length) {

                manageSubJobTitleService.saveSubJobTitleData(model.subjobTitle, function (response) {

                    if (response.success) {
                        manageSubJobTitleService.getSubJobTitles($stateParams.jobTitleId,function (response) {
                            model.subjobTitles = response;
                        });
                        toastr.success(response.msg);
                    } else {
                        toastr.error(response.msg);
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
    }).directive('saveitem', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.parents('td').children().addClass('show');
                element.parents('td').children('div.editForm').addClass('hide');
                element.parents('td').children('div.editForm').removeClass('show');
            })
        },
    }
}).directive('enableedit', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.parents('tr').children('td.job_details').children('div.job_label').addClass('hide');
                element.parents('tr').children('td.job_details').children('div.job_label').removeClass('show');
                element.parents('tr').children('td.job_details').children('div.editForm').addClass('show');
                element.parents('tr').children('td.job_details').children('div.editForm').removeClass('hide');
            })
        },
    }
});