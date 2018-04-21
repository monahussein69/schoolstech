angular.module('MetronicApp').factory('studentTaskService', function ($http, Upload) {

    var fac = {

    };

    fac.getAllStudentTask = function (subTaskId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllStudentTask/"+subTaskId).success(function (response) {
                resolve(response);
            });
        });
    };

    fac.saveStudentsTask = function (stdTaskObj, callback) {
        $http.post("http://localhost:3000/saveStudentsTask",{'stdTaskObj':stdTaskObj}).success(function (response) {
            callback(response);
        });

    };


    fac.deleteStudentTask = function(id,callback){
        $http.get("http://localhost:3000/deleteStudentTask/"+id).success(function (response) {
            callback(response);
        });
    };

    return fac;

});