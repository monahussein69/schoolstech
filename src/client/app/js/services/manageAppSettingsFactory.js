angular.module('MetronicApp').factory('manageAppSettingsService', function ($http, Upload) {

    var fac = {};

    fac.saveAppSettingsData = function (appSettingsObj, callback) {
        $http.post("http://localhost:3000/saveAppSettingsData", {
            'appSettingsData':appSettingsObj
        }).success(function (response) {
            if(typeof appSettingsObj.ministry_logo !== 'string') {
                fac.uploadMinistryPhoto(appSettingsObj.ministry_logo, response.id).then(function (data) {
                    response.ministry_logo_file = data;
                    //callback(response);
                });
            }
            /*if(typeof appSettingsObj.vision_logo !== 'string') {
                fac.uploadVisionPhoto(appSettingsObj.vision_logo, response.id).then(function (data) {
                    response.vision_logo_file = data;
                    //callback(response);
                });
            }*/
                callback(response);

        });
    };

    fac.getappSettingsData = function (callback) {

        $http.get("http://localhost:3000/getAppSettings/").success(function (response) {
            callback(response);
        });

    };




    fac.uploadMinistryPhoto = function (files , id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://localhost:3000/upload-app-photo', //webAPI exposed to upload the file
                data: {files: files , id : id} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                console.log(resp);
                if (resp.status === 200) { //validate success
                    console.log(resp);
                    resolve(resp.data);
                    // toastr.success("تم رفع الملف بنجاح");
                } else {
                    // toastr.error('هناك مشكلة في رفع الملف');
                }
            }, function (resp) { //catch error
                // toastr.error('Error status: ' + resp.status);
            }, function (evt) {
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                // model.progress = progressPercentage; // capture upload progress
            });
        });

    };

    fac.uploadVisionPhoto = function (file , id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://localhost:3000/upload-vision-photo', //webAPI exposed to upload the file
                data: {file: file , id : id} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                console.log(resp);
                if (resp.status === 200) { //validate success
                    console.log(resp);
                    resolve(resp.status);
                    // toastr.success("تم رفع الملف بنجاح");
                } else {
                    // toastr.error('هناك مشكلة في رفع الملف');
                }
            }, function (resp) { //catch error
                // toastr.error('Error status: ' + resp.status);
            }, function (evt) {
                // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                // model.progress = progressPercentage; // capture upload progress
            });
        });

    };

    return fac;

});