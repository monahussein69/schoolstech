angular.module('MetronicApp').factory('manageJobTitleService', function ($http, Upload) {

    var fac = {

    };

    fac.getJobTitles = function (callback) {
        $http.get("http://138.197.175.116:3000/getAllJobTitles", {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveJobTitleData = function (jobTitleObj, callback) {
       console.log(jobTitleObj);
        $http.post("http://138.197.175.116:3000/saveJobTitle",{'jobTitleData':jobTitleObj}).success(function (response) {
            callback(response);
        });

    };
    return fac;

});