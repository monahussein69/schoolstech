angular.module('MetronicApp').factory('employeesAttendanceRecordsService', function ($http, Upload) {

    var fac = {};

    fac.getEmployeeLateRecord = function (schoolId,employeeId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getEmployeeLateRecord/"+schoolId+"/"+employeeId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.getEmployeeAbsentRecord = function (schoolId,employeeId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getEmployeeAbsentRecord/"+schoolId+"/"+employeeId).success(function (response) {
                resolve(response);
            });
        });

    } ;

    fac.getEmployeeExcuseRecord = function (schoolId,employeeId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getEmployeeExcuseRecord/"+schoolId+"/"+employeeId).success(function (response) {
                resolve(response);
            });
        });

    };

    return fac;

});