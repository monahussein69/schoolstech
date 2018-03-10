angular.module('MetronicApp').factory('employeesAttendanceService', function ($http, Upload) {

    var fac = {};


    fac.getAllEmployeesAttendance = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllEmployeesAttendance/"+schoolId).success(function (response) {
                resolve(response);
            });
        });

    };

    return fac;

});