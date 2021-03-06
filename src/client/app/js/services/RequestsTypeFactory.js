angular.module('MetronicApp').factory('manageRequestsTypeService', function ($http, Upload) {

    var fac = {

    };

    fac.getRequestType = function (RequestTypeId,callback) {
        $http.get("http://138.197.175.116:3000/getRequestType/"+RequestTypeId, {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveRequestTypeData = function (RequestType, callback) {
        $http.post("http://138.197.175.116:3000/saveRequestTypeData",{'RequestTypeData':RequestType}).success(function (response) {
            callback(response);
        });

    };


    fac.getAllRequestsType = function(callback){

        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllRequestsType").success(function (response) {
                resolve(response);
            });
        });
    };

    return fac;

});