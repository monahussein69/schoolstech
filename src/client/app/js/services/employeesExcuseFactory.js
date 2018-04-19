angular.module('MetronicApp').factory('employeesExcuseService', function ($http) {

    var fac = {};


    fac.sendExcuseRequest = function(ExcuseObj,callback) {
        $http.post("http://138.197.175.116:3000/sendExcuseRequest", {
            'ExcuseObj': ExcuseObj
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});