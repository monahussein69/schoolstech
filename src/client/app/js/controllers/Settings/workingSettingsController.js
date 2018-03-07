angular.module('MetronicApp').controller('WorkingSettingsController',
    function (DTOptionsBuilder, DTColumnBuilder,$q,$stateParams, $rootScope, $scope, $http, $window, localStorageService, toastr, $filter,WorkingSettingsService) {

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

        var model = {
            working_settingsObj : {},
            createLectureArray:createLectureArray,
            lectures:[],
            schoolId:schoolId,
            saveWorkingSettings:saveWorkingSettings,
            getProfileSetting:getProfileSetting,
            deleteProfileSetting:deleteProfileSetting,
            activateProfileSetting:activateProfileSetting,
            DeactivateProfileSetting:DeactivateProfileSetting,
            options: DTOptionsBuilder.fromFnPromise(function () {
                var defer = $q.defer();
                WorkingSettingsService.getAllSettingsProfiles(schoolId).then(function (profiles) {
                    defer.resolve(profiles);
                });

                return defer.promise
            }),
            columns: [
                DTColumnBuilder.newColumn('Profile_Name').withTitle(' الاسم'),
                DTColumnBuilder.newColumn(null).withTitle(' العمليات'),
            ],
            dtInstance: {},
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
            if(type == 'new'){
                model.working_settingsObj.id = '';
            }
            if (Object.keys(model.working_settingsObj).length) {
                model.working_settingsObj.schoolId = model.schoolId;
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
                        var resetPaging = true;
                        model.dtInstance.reloadData(response.data, resetPaging);
                        toastr.success(response.msg);
                    } else {
                        //model.error = response.msg;
                        toastr.error(response.msg);
                        console.log('error');
                    }
                });

            }
        }

        function getProfileSetting(profileId){
            WorkingSettingsService.getSettingsData(profileId, function (response) {
                model.working_settingsObj = response[0];
            });
        }

        function deleteProfileSetting(profileId){
            WorkingSettingsService.deleteSettingProfileData(profileId,model.schoolId, function (response) {
                model.working_settingsObj = response[0];
                var resetPaging = true;
                model.dtInstance.reloadData(response.data, resetPaging);
            });
        }

        function activateProfileSetting(profileId){
            var currentProfile = {};
            WorkingSettingsService.getSettingsData(profileId, function (response) {
                currentProfile = response[0];
                currentProfile.Profile_Active_status = 1;
                WorkingSettingsService.saveSettingsData(currentProfile, function (response) {
                    if (response.success) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(response.data, resetPaging);
                        toastr.success(response.msg);
                    } else {
                        toastr.error(response.msg);
                    }
                });
            });
        }

        function DeactivateProfileSetting(profileId){
            var currentProfile = {};
            WorkingSettingsService.getSettingsData(profileId, function (response) {
                currentProfile = response[0];
                currentProfile.Profile_Active_status = 0;
                WorkingSettingsService.saveSettingsData(currentProfile, function (response) {
                    if (response.success) {
                        var resetPaging = true;
                        model.dtInstance.reloadData(response.data, resetPaging);
                        toastr.success(response.msg);
                    } else {
                        toastr.error(response.msg);
                    }
                });
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