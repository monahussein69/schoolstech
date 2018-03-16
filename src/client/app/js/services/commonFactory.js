angular.module('MetronicApp').factory('CommonService', function ($http, Upload,manageSchoolService,localStorageService,$window) {

    var fac = {};

    fac.nextStep = function (schoolId, callback) {
        manageSchoolService.getSchoolData(schoolId,function(result){

            var current_step = result[0].config_steps;
            if(current_step < 4) {
                var new_step = current_step + 1;
                result[0].config_steps = new_step;
                result[0].schoolId = schoolId;

                if(new_step == 4){
                    var userObject = localStorageService.get('UserObject');
                    userObject[0].config_flag = false;
                    localStorageService.set('UserObject', userObject);
                }
                manageSchoolService.saveSchoolData(result[0], function (result) {
                    callback(result);
                });
            }
        });
    };

    fac.currentStep = function (schoolId, callback) {
        manageSchoolService.getSchoolData(schoolId,function(result){
            var current_step = result[0].config_steps;
            callback(current_step);

        });
    };



    fac.checkPage = function (schoolId) {

        var userObject = localStorageService.get('UserObject');

        if (userObject[0].userType == 2){

            manageSchoolService.getSchoolData(schoolId,function(result){

                var current_step = result[0].config_steps;
                if (current_step == 0){
                    $window.location.href = '#/manageEmployees/';

                } else if (current_step == 1) {
                    $window.location.href = '#/manageLeaders';
                }
                else if (current_step == 2) {
                    $window.location.href = '#/students';
                }
                else if (current_step == 3) {
                    $window.location.href = '#/school-schedule';
                }

            });



        }

    };



    return fac;

});