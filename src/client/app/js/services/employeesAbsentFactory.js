angular.module('MetronicApp').factory('employeesAbsentService', function ($http) {

    var fac = {};


    fac.sendAbsentRequest = function(AbsentObj,callback) {
        $http.post("http://localhost:3000/sendAbsentRequest", {
            'AbsentObj': AbsentObj
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});