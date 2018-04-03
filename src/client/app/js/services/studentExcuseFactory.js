angular.module('MetronicApp').factory('studentExcuseService', function ($http) {

    var fac = {};


    fac.sendStudentExcuseRequest = function(ExcuseObj,callback) {
        $http.post("http://138.197.175.116:3000/sendStudentExcuseRequest", {
            'ExcuseObj': ExcuseObj
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});