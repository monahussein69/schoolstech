angular.module('MetronicApp').factory('manageEmployeeService', function ($http, Upload) {

    var fac = {};

    fac.saveEmpData = function (empObj, callback) {
        $http.post("http://138.197.175.116:3000/saveEmployeeData", {
            'empData': empObj
        }).success(function (response) {
            if (typeof empObj.photo_file !== 'string') {
                fac.uploadPhoto(empObj.photoFile, response.id);
            }
            callback(response);
        });
    };


    fac.getAllEmployeesByActivity = function (schoolId, lecture_name) {
        return new Promise(function (resolve, reject) {
            $http.post("http://138.197.175.116:3000/getAllEmployeesByActivity", {
                'schoolId': schoolId,
                'lecture_name': lecture_name
            }).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });

    };

    fac.getActivityByEmployeeId = function (employeeId,schoolId,date) {
        return new Promise(function (resolve, reject) {
            $http.post("http://138.197.175.116:3000/getActivityByEmployeeId",{'employeeId':employeeId,'date':date,'schoolId':schoolId}).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };



    fac.getEmpData = function (empId, callback) {
        $http.get("http://138.197.175.116:3000/getEmployee/" + empId).success(function (response) {
            callback(response);
        });
    };


    fac.getEmployeeByUserId = function (userId, callback) {
        $http.get("http://138.197.175.116:3000/getEmployeeByUserId/" + userId).success(function (response) {
            callback(response);
        });
    };

    fac.getAllEmployees = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllEmployees/" + schoolId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };

    fac.getAllTeachers = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://138.197.175.116:3000/getAllTeachers/" + schoolId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });
    };

    fac.getEmployeesBasedJob = function (schoolId, job_title, sub_job_title, callback) {

        $http.post("http://138.197.175.116:3000/getAllEmployeesByJobTitle", {
            'schoolId': schoolId,
            'job_title': job_title,
            'sub_job_title': sub_job_title
        }).success(function (response) {
            callback(response);
        });

    };

    fac.deleteEmpData = function (empId, callback) {
        $http.get("http://138.197.175.116:3000/deleteEmployee/" + empId).success(function (response) {
            callback(response);
        });
    };


    fac.uploadPhoto = function (file, id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://138.197.175.116:3000/upload-photo', //webAPI exposed to upload the file
                data: {files: file, id: id, type: 'employee_photo'} //pass file as data, should be user ng-model
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


    fac.DeActivateEmployee = function (empId, callback) {
        $http.post("http://138.197.175.116:3000/DeactivateUser", {
            'empId': empId,
            'type': 'employee'
        }).success(function (response) {
            callback(response);
        });
    };

    fac.ActivateEmployee = function (empId, callback) {
        $http.post("http://138.197.175.116:3000/ActivateUser", {
            'empId': empId,
            'type': 'employee'
        }).success(function (response) {
            callback(response);
        });
    };

    fac.setEmpPostions = function (agentsObj, callback) {
        $http.post("http://138.197.175.116:3000/setEmpPostions", {'agentsObj': agentsObj}).success(function (response) {
            callback(response);
        });
    }


    return fac;

});