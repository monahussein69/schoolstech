angular.module('MetronicApp').factory('manageTaskStatusService', function ($http, Upload) {

    var fac = {

    };

    fac.getTaskStatus = function (statusId,callback) {
        $http.get("http://localhost:3000/getTaskStatus/"+statusId, {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveTaskStatusData = function (taskStatus, callback) {
        $http.post("http://localhost:3000/saveTaskStatusData",{'taskStatusData':taskStatus}).success(function (response) {
            callback(response);
        });

    };


    fac.getAllTaskStatus = function(callback){

        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllTaskStatus").success(function (response) {
                resolve(response);
            });
        });
    };

    return fac;

});