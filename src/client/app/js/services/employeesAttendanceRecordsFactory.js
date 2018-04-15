angular.module('MetronicApp').factory('employeesAttendanceRecordsService', function ($http, Upload) {

    var fac = {};

    fac.getEmployeeLateRecord = function (schoolId,employeeId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getEmployeeLateRecord/"+schoolId+"/"+employeeId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.getEmployeeAbsentRecord = function (schoolId,employeeId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getEmployeeAbsentRecord/"+schoolId+"/"+employeeId).success(function (response) {
                resolve(response);
            });
        });

    };

    return fac;

});