angular.module('MetronicApp').factory('manageEmployeeService', function ($http, Upload) {

    var fac = {};

    fac.saveEmpData = function (empObj, callback) {
        $http.post("http://localhost:3000/saveEmployeeData", {
            'empData': empObj
        }).success(function (response) {
			 if(typeof empObj.photo_file !== 'string') {
                fac.uploadPhoto(empObj.photoFile, response.id);
            }
            callback(response);
        });
    };

    fac.getEmpData = function (empId, callback) {
        $http.get("http://localhost:3000/getEmployee/" + empId).success(function (response) {
            callback(response);
        });
    };

    fac.getAllEmployees = function (schoolId) {
        return new Promise(function (resolve, reject) {
            $http.get("http://localhost:3000/getAllEmployees/"+schoolId).success(function (response) {
                console.log(response);
                resolve(response);
            });
        });

    };

    fac.deleteEmpData = function (empId, callback) {
        $http.get("http://localhost:3000/deleteEmployee/" + empId).success(function (response) {
            callback(response);
        });
    };
	
	
	 fac.uploadPhoto = function (file , id) {
        return new Promise(function (resolve) {
            Upload.upload({
                url: 'http://localhost:3000/upload-photo', //webAPI exposed to upload the file
                data: {files: file , id : id,type:'employee_photo'} //pass file as data, should be user ng-model
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
         $http.post("http://localhost:3000/DeactivateUser",{'empId':empId,'type':'employee'}).success(function (response) {
             callback(response);
         });
     };

    fac.ActivateEmployee = function (empId, callback) {
        $http.post("http://localhost:3000/ActivateUser",{'empId':empId,'type':'employee'}).success(function (response) {
            callback(response);
        });
    };


    return fac;

});