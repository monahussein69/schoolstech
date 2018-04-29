angular.module('MetronicApp').factory('manageSchoolAccountService', function($http){

    var fac = {};

    fac.saveSchoolAccountData = function (schoolAccountObj, callback) {
        $http.post("http://138.197.175.116:3000/saveSchoolAccountData", {
            'schoolAccountData':schoolAccountObj
        }).success(function (response) {
            callback(response);
        });
    };

    fac.getSchoolAccountData = function (schoolId, callback) {

        $http.get("http://138.197.175.116:3000/getSchoolAccount/"+schoolId).success(function (response) {
            callback(response);
        });

    };

    fac.deleteSchoolAccountData = function (schoolId, callback) {

        $http.get("http://138.197.175.116:3000/deleteSchoolAccount/"+schoolId).success(function (response) {
            callback(response);
        });

    };
	
	
	
	fac.countSchoolsAccounts = function (callback) {
            $http.get("http://138.197.175.116:3000/countSchoolsAccounts").success(function (response) {
                console.log(response);
                callback(response);
        });

    };

    return fac;

});