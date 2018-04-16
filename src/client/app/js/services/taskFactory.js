angular.module('MetronicApp').factory('taskService', function ($http, Upload) {

    var fac = {

    };

    fac.getAllTasks = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllTasks/"+schoolId).success(function (response) {
                resolve(response);
            });
        });
    };

    fac.saveTaskData = function (taskObj, callback) {
        $http.post("http://localhost:3000/saveTaskData",{'taskObj':taskObj}).success(function (response) {
            callback(response);
        });

    };


    fac.getTaskByEmpId = function(empId,callback){
        $http.post("http://localhost:3000/getTaskByEmpId",{'empId':empId}).success(function (response) {
            callback(response);
        });
    };

    fac.deleteTask = function(taskId,callback){
        $http.get("http://localhost:3000/deleteTask/"+taskId).success(function (response) {
            callback(response);
        });
    };

    fac.getTask = function(taskId,callback){
        $http.get("http://localhost:3000/getTask/"+taskId).success(function (response) {
            callback(response);
        });
    };

    return fac;

});