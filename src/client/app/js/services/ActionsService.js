angular.module('MetronicApp').factory('ActionsService', function ($http, Upload) {
    var service = {};
    service.getEmployeeActions = function (userId, callback) {
        $http.get("http://138.197.175.116:3000/getEmployeeActions/" + userId).success(function (response) {
            callback(response);
        });
    };
    service.getSchoolActions = function (schoolId, callback) {
        $http.get("http://138.197.175.116:3000/getSchoolActions/" + schoolId).success(function (response) {
            callback(response);
        });
    };
    service.setActionReply = function (data, callback) {
        $http.post("http://138.197.175.116:3000/setActionReply", data).success(function (response) {
            callback(response);
        });
    };
    service.doAction = function (status , id , callback) {
        $http.post("http://138.197.175.116:3000/doAction", {id : id , status : status}).success(function (response) {
            callback(response);
        });
    };
    return service;
});