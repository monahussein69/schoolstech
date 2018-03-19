angular.module('MetronicApp').factory('studentsAttendanceService', function ($http, Upload) {

    var fac = {};

    fac.getAllStudentsAttendanceByActivity = function (schoolId,teacherId,lecture_name,date) {
        return new Promise(function (resolve, reject) {
            $http.post("http://localhost:3000/getAllStudentsAttendanceByActivity",{
                'lecture_name':lecture_name,
                'schoolId':schoolId,
                'teacherId':teacherId,
                'date':date
            }).success(function (response) {
                resolve(response);
            });
        });

    };


    fac.setStudentAttendance = function(attendanceObj,callback) {
        $http.post("http://localhost:3000/setStudentAttendance", {
            'attendanceObj': attendanceObj
        }).success(function (response) {
            callback(response);
        });
    };

    return fac;

});