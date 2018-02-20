angular.module('MetronicApp').controller('appSettingsController',
    function ($stateParams, $rootScope, $scope, $http, $window, localStorageService, manageAppSettingsService,toastr) {


    var model = {
        appSettingsObj: {},
        saveAppSettings: saveAppSettings,
        error: null,
        uploadPhoto : uploadPhoto
    };


    $scope.model = model;
    manageAppSettingsService.getappSettingsData(function (response) {

        if(response.success) {
            console.log(response);
            model.appSettingsObj.country_name = response.data[0].country_name;
            model.appSettingsObj.ministry_name = response.data[0].ministry_name;
            model.appSettingsObj.ministry_logo = response.data[0].ministry_logo;
            model.appSettingsObj.vision_logo = response.data[0].vision_logo;
             var start_f_year_date = new Date(response.data[0].start_f_year * 1000);
            model.appSettingsObj.start_f_year =   ('0' + (start_f_year_date.getMonth() + 1)).slice(-2) + '/' +('0' + start_f_year_date.getDate()).slice(-2)+'/'+ start_f_year_date.getFullYear();
            var end_f_year_date = new Date(response.data[0].end_f_year * 1000);
            model.appSettingsObj.end_f_year =   ('0' + (end_f_year_date.getMonth() + 1)).slice(-2) + '/' +('0' + end_f_year_date.getDate()).slice(-2)+'/'+ end_f_year_date.getFullYear();
            var academic_start_date_format = new Date(response.data[0].academic_start_date * 1000);
            model.appSettingsObj.academic_start_date  =   ('0' + (academic_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + academic_start_date_format.getDate()).slice(-2)+'/'+ academic_start_date_format.getFullYear();
            var academic_end_date_format = new Date(response.data[0].academic_end_date * 1000);
            model.appSettingsObj.academic_end_date  =   ('0' + (academic_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + academic_end_date_format.getDate()).slice(-2)+'/'+ academic_end_date_format.getFullYear();
            var first_term_start_date_format = new Date(response.data[0].first_term_start_date * 1000);
            model.appSettingsObj.first_term_start_date  =   ('0' + (first_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + first_term_start_date_format.getDate()).slice(-2)+'/'+ first_term_start_date_format.getFullYear();
            var first_term_end_date_format = new Date(response.data[0].first_term_end_date * 1000);
            model.appSettingsObj.first_term_end_date  =   ('0' + (first_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + first_term_end_date_format.getDate()).slice(-2)+'/'+ first_term_end_date_format.getFullYear();
            var second_term_start_date_format = new Date(response.data[0].second_term_start_date * 1000);
            model.appSettingsObj.second_term_start_date  =   ('0' + (second_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + second_term_start_date_format.getDate()).slice(-2)+'/'+ second_term_start_date_format.getFullYear();
            var second_term_end_date_format = new Date(response.data[0].second_term_end_date * 1000);
            model.appSettingsObj.second_term_end_date  =   ('0' + (second_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + second_term_start_date_format.getDate()).slice(-2)+'/'+ second_term_start_date_format.getFullYear();
            var summer_term_start_date_format = new Date(response.data[0].summer_term_start_date * 1000);
            model.appSettingsObj.summer_term_start_date  =   ('0' + (summer_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + summer_term_start_date_format.getDate()).slice(-2)+'/'+ summer_term_start_date_format.getFullYear();
            var summer_term_end_date_format = new Date(response.data[0].summer_term_end_date * 1000);
            model.appSettingsObj.summer_term_end_date  =   ('0' + (summer_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + summer_term_end_date_format.getDate()).slice(-2)+'/'+ summer_term_end_date_format.getFullYear();

            model.appSettingsObj.active_term = response.data[0].active_term;
            model.appSettingsObj.marketing = response.data[0].marketing;
            model.appSettingsObj.vision_logo = response.data[0].vision_logo;
            model.appSettingsObj.ministry_logo = response.data[0].ministry_logo;

         }
        });


    function saveAppSettings() {
        if (Object.keys(model.appSettingsObj).length) {
            model.appSettingsObj.start_f_year = new Date(model.appSettingsObj.start_f_year).getTime()/1000;
            model.appSettingsObj.end_f_year = new Date(model.appSettingsObj.end_f_year).getTime()/1000;
            model.appSettingsObj.academic_start_date = new Date(model.appSettingsObj.academic_start_date).getTime()/1000;
            model.appSettingsObj.academic_end_date = new Date(model.appSettingsObj.academic_end_date).getTime()/1000;
            model.appSettingsObj.first_term_start_date = new Date(model.appSettingsObj.first_term_start_date).getTime()/1000;
            model.appSettingsObj.first_term_end_date = new Date(model.appSettingsObj.first_term_end_date).getTime()/1000;
            model.appSettingsObj.second_term_start_date = new Date(model.appSettingsObj.second_term_start_date).getTime()/1000;
            model.appSettingsObj.second_term_end_date = new Date(model.appSettingsObj.second_term_end_date).getTime()/1000;
            model.appSettingsObj.summer_term_start_date = new Date(model.appSettingsObj.summer_term_start_date).getTime()/1000;
            model.appSettingsObj.summer_term_end_date = new Date(model.appSettingsObj.summer_term_end_date).getTime()/1000;
            console.log('after settings : ',model.appSettingsObj.ministry_logo);
            manageAppSettingsService.saveAppSettingsData(model.appSettingsObj, function (response) {

                if (response.success) {
                    //model.success = response.msg;
                    var start_f_year_date = new Date(model.appSettingsObj.start_f_year * 1000);
                    model.appSettingsObj.start_f_year =   ('0' + (start_f_year_date.getMonth() + 1)).slice(-2) + '/' +('0' + start_f_year_date.getDate()).slice(-2)+'/'+ start_f_year_date.getFullYear();
                    var end_f_year_date = new Date(model.appSettingsObj.end_f_year * 1000);
                    model.appSettingsObj.end_f_year =   ('0' + (end_f_year_date.getMonth() + 1)).slice(-2) + '/' +('0' + end_f_year_date.getDate()).slice(-2)+'/'+ end_f_year_date.getFullYear();
                    var academic_start_date_format = new Date(model.appSettingsObj.academic_start_date * 1000);
                    model.appSettingsObj.academic_start_date  =   ('0' + (academic_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + academic_start_date_format.getDate()).slice(-2)+'/'+ academic_start_date_format.getFullYear();
                    var academic_end_date_format = new Date(model.appSettingsObj.academic_end_date * 1000);
                    model.appSettingsObj.academic_end_date  =   ('0' + (academic_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + academic_end_date_format.getDate()).slice(-2)+'/'+ academic_end_date_format.getFullYear();
                    var first_term_start_date_format = new Date(model.appSettingsObj.first_term_start_date * 1000);
                    model.appSettingsObj.first_term_start_date  =   ('0' + (first_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + first_term_start_date_format.getDate()).slice(-2)+'/'+ first_term_start_date_format.getFullYear();
                    var first_term_end_date_format = new Date(model.appSettingsObj.first_term_end_date * 1000);
                    model.appSettingsObj.first_term_end_date  =   ('0' + (first_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + first_term_end_date_format.getDate()).slice(-2)+'/'+ first_term_end_date_format.getFullYear();
                    var second_term_start_date_format = new Date(model.appSettingsObj.second_term_start_date * 1000);
                    model.appSettingsObj.second_term_start_date  =   ('0' + (second_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + second_term_start_date_format.getDate()).slice(-2)+'/'+ second_term_start_date_format.getFullYear();
                    var second_term_end_date_format = new Date(model.appSettingsObj.second_term_end_date * 1000);
                    model.appSettingsObj.second_term_end_date  =   ('0' + (second_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + second_term_start_date_format.getDate()).slice(-2)+'/'+ second_term_start_date_format.getFullYear();
                    var summer_term_start_date_format = new Date(model.appSettingsObj.summer_term_start_date * 1000);
                    model.appSettingsObj.summer_term_start_date  =   ('0' + (summer_term_start_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + summer_term_start_date_format.getDate()).slice(-2)+'/'+ summer_term_start_date_format.getFullYear();
                    var summer_term_end_date_format = new Date(model.appSettingsObj.summer_term_end_date * 1000);
                    model.appSettingsObj.summer_term_end_date  =   ('0' + (summer_term_end_date_format.getMonth() + 1)).slice(-2) + '/' +('0' + summer_term_end_date_format.getDate()).slice(-2)+'/'+ summer_term_end_date_format.getFullYear();

                    toastr.success(response.msg);
                    if(response.ministry_logo){
                        model.appSettingsObj.ministry_logo =  response.ministry_logo;
                    }
                    if(response.vision_logo){
                        model.appSettingsObj.ministry_logo =  response.vision_logo;
                    }
                 console.log(response);
                } else {
                    //model.error = response.msg;
                    toastr.error(response.msg);
                    console.log('error');
                }
            });

        }

    }

    function uploadPhoto(file , name) {
        manageAppSettingsService.uploadPhoto(file).then(function (photo) {
                model.appSettingsObj[name] = photo;

           $scope.$apply();
        });
    }


    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        // App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});