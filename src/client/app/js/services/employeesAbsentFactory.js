angular.module('MetronicApp').factory('employeesAbsentService', function ($http) {

    var fac = {};


    fac.sendAbsentRequest = function(AbsentObj,callback) {
        $http.post("http://138.197.175.116:3000/sendAbsentRequest", {
            'AbsentObj': AbsentObj
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});