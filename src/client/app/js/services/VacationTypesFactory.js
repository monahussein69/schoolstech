angular.module('MetronicApp').factory('manageVacationTypesService', function ($http, Upload) {

    var fac = {

    };

    fac.getVacationType = function (VacationTypeId,callback) {
        $http.get("http://138.197.175.116:3000/getVacationType/"+VacationTypeId, {
        }).success(function (response) {
            callback(response);
        });
    };

    fac.saveVacationTypeData = function (VacationType, callback) {
        $http.post("http://138.197.175.116:3000/saveVacationTypeData",{'vacationTypeData':VacationType}).success(function (response) {
            callback(response);
        });

    };


    fac.getAllVacationTypes = function(callback){

        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllVacationTypes").success(function (response) {
                resolve(response);
            });
        });
    };

    return fac;

});