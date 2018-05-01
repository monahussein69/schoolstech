angular.module('MetronicApp').factory('studentRecordsService', function ($http) {

    var fac = {};



        fac.getStudentExcuseRecord = function (schoolId,studentId) {
            return new Promise(function (resolve, reject) {
                $http.get("http://localhost:3000/getStudentExcuseRecord/" + schoolId + "/" + studentId).success(function (response) {
                    resolve(response);
                });
            });
        };

            fac.getStudentLateRecord = function (schoolId,studentId) {
            return new Promise(function (resolve, reject) {
                $http.get("http://localhost:3000/getStudentLateRecord/"+schoolId+"/"+studentId).success(function (response) {
                    resolve(response);
                });
            });

        };

            fac.getStudentAbsentRecord = function (schoolId,studentId) {
            return new Promise(function (resolve, reject) {
                $http.get("http://localhost:3000/getStudentAbsentRecord/"+schoolId+"/"+studentId).success(function (response) {
                    resolve(response);
                });
            });

        };


    return fac;

});