angular.module('MetronicApp').factory('subTaskService', function ($http, Upload) {

    var fac = {

    };

    fac.getAllSubTasks = function (taskId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllSubTasks/"+taskId).success(function (response) {
                resolve(response);
            });
        });
    };

    fac.saveSubTaskData = function (subTaskObj, callback) {
        $http.post("http://localhost:3000/saveSubTaskData",{'subTaskObj':subTaskObj}).success(function (response) {
            callback(response);
        });

    };


    fac.getSubTaskByEmpId = function(empId){
        return new Promise(function (resolve, reject) {
            $http.post("http://localhost:3000/getSubTaskByEmpId",{'empId':empId}).success(function (response) {
                resolve(response);
            });
        });

    };

    fac.deleteSubTask = function(subTaskId,callback){
        $http.get("http://localhost:3000/deleteSubTask/"+subTaskId).success(function (response) {
            callback(response);
        });
    };

    fac.getSubTask = function(subTaskId,callback){
        $http.get("http://localhost:3000/getSubTask/"+subTaskId).success(function (response) {
            callback(response);
        });
    };

    return fac;

});