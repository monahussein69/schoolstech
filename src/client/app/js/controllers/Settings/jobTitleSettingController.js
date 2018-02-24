angular.module('MetronicApp').controller('jobTitelSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageJobTitleService,toastr) {


        var model = {
            jobTitles: {},
            saveJobTitle: saveJobTitle,
            jobTitle:{},
            editedJobTitle:{},
            error: null,
            editJobTitle:editJobTitle,
            EnableEditing:EnableEditing
        };



        $scope.model = model;
        manageJobTitleService.getJobTitles(function (response) {
            model.jobTitles = response;
        });


        function EnableEditing(name,id){
            model.editedJobTitle.name = name;
            model.editedJobTitle.id = id;
        }

        function editJobTitle() {
            if (Object.keys(model.editedJobTitle).length && model.editedJobTitle.name) {
                manageJobTitleService.saveJobTitleData(model.editedJobTitle, function (response) {
                    if (response.success) {
                        toastr.success(response.msg);
                        manageJobTitleService.getJobTitles(function (response) {
                            model.jobTitles = response;
                        });
                    } else {
                        toastr.error(response.msg);
                    }
                    model.jobTitle = {};
                    $scope.enable_to_edit = false;
                });
            }
        }

        function saveJobTitle() {
            if (Object.keys(model.jobTitle).length) {

                manageJobTitleService.saveJobTitleData(model.jobTitle, function (response) {

                    if (response.success) {
                        manageJobTitleService.getJobTitles(function (response) {
                            model.jobTitles = response;
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