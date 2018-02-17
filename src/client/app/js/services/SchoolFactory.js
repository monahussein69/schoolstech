angular.module('MetronicApp').factory('manageSchoolService', function ($http, Upload) {

    var fac = {};

    fac.saveSchoolData = function (schoolObj, callback) {
        console.log(schoolObj);
        $http.post("http://localhost:3000/saveSchoolData", {
            'schoolData': schoolObj
        }).success(function (response) {
            console.log("response : " , typeof schoolObj.logoFile);
            if(typeof schoolObj.logoFile !== 'string') {
                fac.uploadPhoto(schoolObj.logoFile, response.id);
            }
            callback(response);
        });
    };

    fac.getSchoolData = function (schoolId, callback) {
        $http.get("http://localhost:3000/getSchool/" + schoolId).success(function (response) {
            callback(response);
        });
    };

    fac.getAllSchools = function () {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllSchools").success(function (response) {
                console.log(response);
                resolve(response);
            });
        });

    };

    fac.deleteSchoolData = function (schoolId, callback) {
        $http.get("http://localhost:3000/deleteSchool/" + schoolId).success(function (response) {
            callback(response);
        });
    };

    fac.uploadPhoto = function (file , id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://localhost:3000/upload-photo', //webAPI exposed to upload the file
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