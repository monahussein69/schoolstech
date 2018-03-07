angular.module('MetronicApp').controller('WorkingSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,WorkingSettingsService) {
        var model = {
            working_settingsObj : {},
            createLectureArray:createLectureArray,
            lectures:[],
            saveWorkingSettings:saveWorkingSettings
        };
        $scope.model = model;
        $scope.days=
            ['السبت','الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعه'];

        function createLectureArray(){
                var lecture_count = model.working_settingsObj.Max_Lectures;
                if(lecture_count){
                    model.lectures = [];
                    for (var i=1; i<=lecture_count; i++) {
                        model.lectures.push(i);
                    }
                }
        }


        function saveWorkingSettings(type){
            var userObject = localStorageService.get('UserObject');
            var userType = userObject[0].userType;
            var schoolId = 0;
            if (userType == 2) {
                schoolId = userObject[0].schoolId;
            } else {
                schoolId = $stateParams.schoolId;
            }

            if (Object.keys(model.working_settingsObj).length) {
                model.working_settingsObj.schoolId = schoolId;
                var Day_Begining = model.working_settingsObj.Day_Begining;
                model.working_settingsObj.Day_Begining = Day_Begining.toString();

                var Activity_Day = model.working_settingsObj.Activity_Day;
                model.working_settingsObj.Activity_Day = Activity_Day.toString();

                if( model.working_settingsObj.Activity_Day){
                    model.working_settingsObj.Activity_Period = 1;
                }

                WorkingSettingsService.saveSettingsData(model.working_settingsObj, function (response) {

                    if (response.success) {
                        //model.success = response.msg;
                       // $window.location.href = '#/manageEmployees';
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
    });