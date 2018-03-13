angular.module('MetronicApp').factory('employeesExcuseService', function ($http, Upload) {

    var fac = {};


    fac.sendExcuseRequest = function(ExcuseObj,callback) {
        $http.post("http://localhost:3000/sendExcuseRequest", {
            'ExcuseObj': ExcuseObj
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});