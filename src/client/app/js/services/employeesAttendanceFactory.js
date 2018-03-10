angular.module('MetronicApp').factory('employeesAttendanceService', function ($http, Upload) {

    var fac = {};


    fac.getAllEmployeesAttendance = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllEmployeesAttendance/"+schoolId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.setEmployeeAttendance = function(attendanceObj,callback) {
        $http.post("http://localhost:3000/setEmployeeAttendance", {
            'attendanceObj': attendanceObj
        }).success(function (response) {
            callback(response);
        });
    }


        return fac;

});