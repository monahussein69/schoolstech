angular.module('MetronicApp').factory('WorkingSettingsService', function ($http, Upload) {

    var fac = {};

    fac.saveSettingsData = function (working_settingsObj, callback) {
        $http.post("http://localhost:3000/saveWorkingSettingsData", {
            'workingSettingsData': working_settingsObj
        }).success(function (response) {
            callback(response);
        });
    };

    fac.getSettingsData = function (profileId, callback) {
        $http.get("http://localhost:3000/getSettingsProfile/" + profileId).success(function (response) {
            callback(response);
        });
    };

    fac.getAllSettingsProfiles = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllSettingsProfiles/"+schoolId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.getAllActivitySchedual = function (profileId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllProfileActivites/"+profileId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.deleteSettingProfileData = function (profileId,schoolId, callback) {
        $http.get("http://localhost:3000/deleteSettingsProfile/" + profileId+'/'+schoolId).success(function (response) {
            callback(response);
        });
    };



    return fac;

});