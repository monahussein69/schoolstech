angular.module('MetronicApp').factory('taskService', function ($http, Upload) {

    var fac = {

    };

    fac.getAllTasks = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllTasks/"+schoolId).success(function (response) {
                resolve(response);
            });
        });
    };

    fac.saveTaskData = function (taskObj, callback) {
        $http.post("http://138.197.175.116:3000/saveTaskData",{'taskObj':taskObj}).success(function (response) {
            callback(response);
        });

    };


    fac.getTaskByEmpId = function(empId){
        return new Promise(function (resolve, reject) {
            $http.post("http://138.197.175.116:3000/getTaskByEmpId",{'empId':empId}).success(function (response) {
                console.log('dddddddddd');
                console.log(response);
                resolve(response);
            });
        });
    };

    fac.deleteTask = function(taskId,callback){
        $http.get("http://138.197.175.116:3000/deleteTask/"+taskId).success(function (response) {
            callback(response);
        });
    };

    fac.getTask = function(taskId,callback){
        $http.get("http://138.197.175.116:3000/getTask/"+taskId).success(function (response) {
            callback(response);
        });
    };

    return fac;

});