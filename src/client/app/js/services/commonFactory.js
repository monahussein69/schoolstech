angular.module('MetronicApp').factory('CommonService', function ($http, Upload,manageSchoolService,localStorageService,$window) {

    var fac = {};

    fac.nextStep = function (schoolId, callback) {
        manageSchoolService.getSchoolData(schoolId,function(result){
            console.log('in get');
            console.log(result[0]);
            var current_step = result[0].config_steps;
            if(current_step < 2) {
                var new_step = current_step + 1;
                result[0].config_steps = new_step;
                result[0].schoolId = schoolId;
                console.log('add step');
                console.log(result[0]);
                if(new_step == 2){
                    var userObject = localStorageService.get('UserObject');
                    userObject[0].config_flag = false;
                    localStorageService.set('UserObject', userObject);
                }
                manageSchoolService.saveSchoolData(result[0], function (result) {
                    console.log('in service result');
                    callback(result);
                });
            }
        });
    };



    fac.checkPage = function (schoolId) {

        var userObject = localStorageService.get('UserObject');

        if (userObject[0].userType == 2){

            manageSchoolService.getSchoolData(schoolId,function(result){

                var current_step = result[0].config_steps;
                console.log('current_step');
                console.log(current_step);
                if (current_step == 0){
                    $window.location.href = '#/manageEmployees/';

                } else if (current_step == 1) {
                    $window.location.href = '#/manageLeaders';
                }

            });



        }

    };



    return fac;

});