angular.module('MetronicApp').factory('RequestsService', function ($http, Upload) {
    var service = {};
    service.saveRequestData = function (requestObj, callback) {
        $http.post("http://localhost:3000/saveRequestData", {
            'requestData': requestObj
        }).success(function (response) {
            callback(response);
        });
    };

      service.changeStatusForRequests = function (status , id , callback) {
          $http.post("http://localhost:3000/changeStatusForRequests", {id : id , status : status}).success(function (response) {
              callback(response);
          });
    };

    service.getEmployeeRequests = function (employee_id, callback) {
        $http.get("http://localhost:3000/getEmployeeRequests/" + employee_id).success(function (response) {
            callback(response);
        });
    };

    service.getSchoolRequests = function (school_id, callback) {
        console.log(school_id);
        $http.get("http://localhost:3000/getSchoolRequests/" + school_id).success(function (response) {
            callback(response);
        });
    };

    service.getRequestsTypes = function (callback) {
        console.log("get Requests ");
        $http.get("http://localhost:3000/getRequestsTypes").success(function (response) {
            console.log(response);
            callback(response);
        });
    };

    return service;
});