angular.module('MetronicApp').factory('StudentsService', function ($http, Upload) {
    var service = {};
    service.saveStudentData = function (studentObj, callback) {
        console.log(studentObj);
        $http.post("http://138.197.175.116:3000/saveStudentData", {
            'studentData': studentObj
        }).success(function (response) {
            console.log("response : " , typeof studentObj.logoFile);
            if(typeof studentObj.logoFile !== 'string') {
                fac.uploadPhoto(studentObj.logoFile, response.id);
            }
            callback(response);
        });
    };

    service.getStudentData = function (studentId, callback) {
        $http.get("http://138.197.175.116:3000/getStudent/" + studentId).success(function (response) {
            callback(response);
        });
    };

    service.getAllStudents = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllStudents/"+schoolId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };

    service.getAllStudentsByGroup = function (group,schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllStudentsByGroup/"+schoolId+'/'+group).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };

    service.deleteStudentData = function (studentId, callback) {
        $http.get("http://138.197.175.116:3000/deleteStudent/" + studentId).success(function (response) {
            callback(response);
        });
    };

    service.uploadPhoto = function (file , id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://138.197.175.116:3000/upload-photo', //webAPI exposed to upload the file
                data: {files: file , id : id,type:'student_logo'} //pass file as data, should be user ng-model
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
    service.getStudentsByActivityId = function (activityId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getStudentsByActivityId/" + activityId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };

    service.getAllStudentsGroups = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllStudentsGroups/" + schoolId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };
    return service;
});