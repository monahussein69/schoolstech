angular.module('MetronicApp').factory('employeesAttendanceService', function ($http, Upload) {

    var fac = {};


    fac.getAllEmployeesAttendance = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllEmployeesAttendance/"+schoolId).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.getAllEmployeesAttendanceByDate = function (schoolId,date) {
        return new Promise(function (resolve, reject) {
            $http.post("http://localhost:3000/getAllEmployeesAttendanceByDate",{'schoolId':schoolId,'date':date}).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.getAllEmployeesAttendanceByActivity = function (schoolId,lecture_name,date) {
        return new Promise(function (resolve, reject) {
            $http.post("http://localhost:3000/getAllEmployeesAttendanceByActivity",{
                'lecture_name':lecture_name,
                'schoolId':schoolId,
                'date':date
            }).success(function (response) {
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
    };

    fac.setEmployeeActivityAttendance = function(attendanceObj,callback) {
        $http.post("http://localhost:3000/setEmployeeActivityAttendance", {
            'attendanceObj': attendanceObj
        }).success(function (response) {
            callback(response);
        });
    };
    fac.getActivityByDayAndSchoolId = function(schoolId,date,callback) {
        $http.post("http://localhost:3000/getActivityByDayAndSchoolId",{'schoolId':schoolId,'date':date}).success(function (response) {
            callback(response);
        });
    }

    fac.getClosingButton = function(schoolId,date,callback) {
        $http.post("http://localhost:3000/getClosingButton",{'schoolId':schoolId,'date':date}).success(function (response) {
            callback(response);
        });
    }

     fac.closeFirstAttendance = function(schoolId,date,callback) {
        $http.post("http://localhost:3000/closeFirstAttendance",
            {'schoolId':schoolId,'date':date})
            .success(function (response) {
            callback(response);
        });
    }

    fac.closeSecondAttendance = function(schoolId,date,callback) {
        $http.post("http://localhost:3000/closeSecondAttendance",
            {'schoolId':schoolId,'date':date})
            .success(function (response) {
            callback(response);
        });
    }

    fac.closeAttendance = function(schoolId,date,callback) {
        $http.post("http://localhost:3000/closeFirstAttendance",
            {'schoolId':schoolId})
            .success(function (response) {
            callback(response);
        });
    }


        return fac;

});