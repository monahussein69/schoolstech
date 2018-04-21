angular.module('MetronicApp').factory('studentExcuseService', function ($http) {

    var fac = {};


    fac.sendStudentExcuseRequest = function(ExcuseObj,Event_Name,callback) {
        $http.post("http://localhost:3000/sendStudentExcuseRequest", {
            'ExcuseObj': ExcuseObj,
            'Event_Name':Event_Name
        }).success(function (response) {
            callback(response);
        });
    },

    fac.getStudentExcuseRecord = function (schoolId,studentId) {
            return new Promise(function (resolve, reject) {
                $http.get("http://138.197.175.116:3000/getStudentExcuseRecord/"+schoolId+"/"+studentId).success(function (response) {
                    resolve(response);
                });
            });

        };


    return fac;

});