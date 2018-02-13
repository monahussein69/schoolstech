angular.module('MetronicApp').factory('manageSchoolService', function($http){

    var fac = {};

    fac.saveSchoolData = function (schoolObj, callback) {
        $http.post("http://localhost:3000/saveSchoolData", {
            'schoolData':schoolObj
        }).success(function (response) {
            callback(response);
        });
    };

    fac.getSchoolData = function (schoolId, callback) {

        $http.get("http://localhost:3000/getSchool/"+schoolId).success(function (response) {
            callback(response);
        });

    };

    fac.deleteSchoolData = function (schoolId, callback) {

        $http.get("http://localhost:3000/deleteSchool/"+schoolId).success(function (response) {
            callback(response);
        });

    };

    return fac;

});