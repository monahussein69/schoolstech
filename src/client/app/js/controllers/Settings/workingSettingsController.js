angular.module('MetronicApp').controller('WorkingSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter) {
        var model = {
            working_settingsObj : {},
            createLectureArray:createLectureArray,
            lectures:[]
        };
        $scope.model = model;


        function createLectureArray(){
                var lecture_count = model.working_settingsObj.lectureCount;
                if(lecture_count){
                    model.lectures = [];
                    for (var i=1; i<=lecture_count; i++) {
                        model.lectures.push(i);
                    }
                }

                console.log(model.lectures);
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