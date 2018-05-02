angular.module('MetronicApp').factory('manageExcuseTypeService', function ($http, Upload) {

    var fac = {

    };

    fac.getExcuseType = function (ExcuseTypeId,callback) {
        $http.get("http://138.197.175.116:3000/getExcuseType/"+ExcuseTypeId, {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveExcuseTypeData = function (ExcuseType, callback) {
        $http.post("http://138.197.175.116:3000/saveExcuseTypeData",{'ExcuseTypeData':ExcuseType}).success(function (response) {
            callback(response);
        });

    };


    fac.getAllExcuseTypes = function(callback){

        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllExcuseTypes").success(function (response) {
                resolve(response);
            });
        });
    };

    return fac;

});