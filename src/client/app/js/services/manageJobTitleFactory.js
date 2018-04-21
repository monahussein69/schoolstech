angular.module('MetronicApp').factory('manageJobTitleService', function ($http, Upload) {

    var fac = {

    };

    fac.getJobTitles = function (callback) {
        $http.get("http://localhost:3000/getAllJobTitles", {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveJobTitleData = function (jobTitleObj, callback) {
       console.log(jobTitleObj);
        $http.post("http://localhost:3000/saveJobTitle",{'jobTitleData':jobTitleObj}).success(function (response) {
            callback(response);
        });

    };
    
    
    fac.getJobTitleByName = function(name,callback){
        $http.post("http://localhost:3000/getjobTitleByName",{'name':name}).success(function (response) {
            callback(response);
        });
    };
    
    return fac;

});