angular.module('MetronicApp').factory('CommonService', function ($http, Upload,manageSchoolService) {

    var fac = {};

    fac.nextStep = function (schoolId, callback) {
        manageSchoolService.getSchoolData(schoolId,function(result){
            console.log('in get');
            console.log(result[0]);
            var current_step = result[0].config_steps;
            var new_step = current_step + 1;
            result[0].config_steps = new_step;
            result[0].schoolId = schoolId;
            console.log('add step');
            console.log(result[0]);
            manageSchoolService.saveSchoolData(result[0],function(result){
                console.log('in service result');
                callback(result);
            });
        });
    };




    return fac;

});