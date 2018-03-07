angular.module('MetronicApp').factory('WorkingSettingsService', function ($http, Upload) {

    var fac = {};

    fac.saveSettingsData = function (working_settingsObj, callback) {
        $http.post("http://localhost:3000/saveWorkingSettingsData", {
            'workingSettingsData': working_settingsObj
        }).success(function (response) {
            callback(response);
        });
    };

    return fac;

});