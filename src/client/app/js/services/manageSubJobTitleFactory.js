angular.module('MetronicApp').factory('manageSubJobTitleService', function ($http, Upload) {

    var fac = {

    };

    fac.getSubJobTitles = function (jobTitleId,callback) {
        console.log('jobTitleId');
        console.log(jobTitleId);
        $http.post("http://localhost:3000/getAllSubJobTitles/", {'jobTitleId':jobTitleId
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveSubJobTitleData = function (subjobTitleObj, callback) {
        $http.post("http://localhost:3000/saveSubJobTitle",{'SubjobTitleData':subjobTitleObj}).success(function (response) {
            callback(response);
        });

    };
    return fac;

});