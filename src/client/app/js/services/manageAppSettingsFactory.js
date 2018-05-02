angular.module('MetronicApp').factory('manageAppSettingsService', function ($http, Upload) {

    var fac = {};

    fac.saveAppSettingsData = function (appSettingsObj, callback) {
        $http.post("http://138.197.175.116:3000/saveAppSettingsData", {
            'appSettingsData': appSettingsObj
        }).success(function (response) {
            callback(response);
        });
    };

    fac.getappSettingsData = function (callback) {

        $http.get("http://138.197.175.116:3000/getAppSettings/").success(function (response) {
            callback(response);
        });

    };

    fac.getCalender = function (first_Academic_Year,end_Academic_Year,Term_Id,callback) {
        $http.get("http://138.197.175.116:3000/getCalender/"+first_Academic_Year+"/"+end_Academic_Year+"/"+Term_Id).success(function (response) {
            callback(response);
        });

    };

    fac.getCalenderByDate = function (date,callback) {
        $http.post("http://138.197.175.116:3000/getCalenderByDate",{'date':date}).success(function (response) {
            callback(response);
        });

    };

    fac.uploadPhoto = function (files, id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://138.197.175.116:3000/upload-app-photo', //webAPI exposed to upload the file
                data: {files: files, id: id} //pass file as data, should be user ng-model
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

    fac.uploadVisionPhoto = function (file, id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://138.197.175.116:3000/upload-vision-photo', //webAPI exposed to upload the file
                data: {file: file, id: id} //pass file as data, should be user ng-model
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

    fac.saveCalender = function (calenderData, callback) {
        $http.post("http://138.197.175.116:3000/saveCalender", {
            'calenderData': calenderData
        }).success(function (response) {
            callback(response);
        });
    };

    return fac;

});