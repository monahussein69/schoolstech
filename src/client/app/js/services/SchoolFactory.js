angular.module('MetronicApp').factory('manageSchoolService', function($http){

    var fac = {};

    fac.saveSchoolData = function (schoolObj, callback) {
        console.log('in fac');
        $http.post("http://localhost:3000/saveSchoolData", {
            'schoolData':schoolObj
        }).success(function (response) {
            callback(response);
        });
    };

    return fac;

});