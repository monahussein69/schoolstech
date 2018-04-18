angular.module('MetronicApp').factory('studentExcuseService', function ($http) {

    var fac = {};


    fac.sendStudentExcuseRequest = function(ExcuseObj,Event_Name,callback) {
        $http.post("http://localhost:3000/sendStudentExcuseRequest", {
            'ExcuseObj': ExcuseObj,
            'Event_Name':Event_Name
        }).success(function (response) {
            callback(response);
        });
    }


    return fac;

});