var express = require('express');
var router = express.Router();
var loginMethod = require('../model/login.js');
var schoolMethods = require('../model/school.js');
var schoolAccountMethods = require('../model/schoolAccount.js');
var appSettingsMethods = require('../model/appSettings.js');
var employeeMethods = require('../model/employee.js');
var jobTitleMethods = require('../model/jobTitle.js');
var subJobTitleMethods = require('../model/subJobTitle.js');
var studentsMethods = require('../model/students');
var userMethods = require('../model/user.js');

var app = express();
var multer = require('multer');
var filename = '';

//Multer Configration
//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/client/app/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        console.log(filename);
        cb(null, filename);
    }
});
//multer settings
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');
// End Multer Configration;

var uploads = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['png', 'jpg' , 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
});

var uploadPhoto = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['png', 'jpg' , 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).array('files' , 10);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("Salim Quta");
});

router.post('/login', function (req, res, next) {
    loginMethod.userLogin(req, res, function (result) {
        res.send(result);
    });

});

router.post('/saveSchoolData', function (req, res, next) {
    schoolMethods.saveSchool(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getSchool/:schoolId', function (req, res, next) {
    schoolMethods.getSchool(req, res, function (result) {
        res.send(result);
    });
});
router.get('/getLectursTable/:schoolId', function (req, res, next) {
    schoolMethods.getLectursTable(req.params.schoolId).then(function (result) {
        res.send(result);
    });
});
router.get('/getAllStudents', function (req, res, next) {
    studentsMethods.getAllStudents(req, res, function (result) {
        res.send(result);
    });
});
router.get('/deleteSchool/:schoolId', function (req, res, next) {
    schoolMethods.deleteSchool(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveSchoolAccountData', function (req, res, next) {
    schoolAccountMethods.saveSchoolAccount(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getSchoolAccount/:schoolId', function (req, res, next) {
    schoolAccountMethods.getSchoolAccount(req, res, function (result) {
        res.send(result);
    });
});
router.get('/deleteSchoolAccount/:schoolId', function (req, res, next) {
    schoolAccountMethods.deleteSchoolAccount(req, res, function (result) {
        res.send(result);
    });
});
router.get('/getAllSchools', function (req, res, next) {
    schoolMethods.getSchools(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllEmployees/:schoolId', function (req, res, next) {
    employeeMethods.getEmployees(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getAllEmployeesByJobTitle', function (req, res, next) {
    employeeMethods.getEmployeesBasedJob(req, res, function (result) {
        res.send(result);
    });
});

router.post('/setEmpPostions', function (req, res, next) {
    employeeMethods.setEmpPostions(req, res, function (result) {
        res.send(result);
    });
});


router.post('/saveEmployeeData', function (req, res, next) {
    employeeMethods.saveEmployee(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getEmployee/:empId', function (req, res, next) {
    employeeMethods.getEmployee(req, res, function (result) {
        res.send(result);
    });
});
router.get('/deleteEmployee/:empId', function (req, res, next) {
    employeeMethods.deleteEmployee(req, res, function (result) {
        res.send(result);
    });
});

/** API path that will upload the files */
router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log('error : ', err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({error_code: 1, err_desc: "No file passed"});
            return;
        }
        req.body.filename = filename;
        if (req.body.type == 'school') {
            schoolMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: 'تم اضافة الملف بنجاح'});
            });
        } else if (req.body.type == 'employee') {
            employeeMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: 'تم اضافة الملف بنجاح'});
            });
        } else if (req.body.type == 'student') {
            studentsMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: result.message});
            });
        } else if (req.body.type == 'schoolSchedule') {
            schoolMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: result.message});
            });
        }

        // if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
        //     var array = xlsx.parse(__dirname + '/file_name.xlsx');
        // }
    });
});
/** API path that will upload the files */
router.post('/upload-photo', function (req, res) {
    uploadPhoto(req, res, function (err) {
        if (err) {
            console.log('error : ', err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.files) {
            res.json({error_code: 1, err_desc: "No file passed"});
            return;
        }
        if (req.body.type == 'school_logo') {
            req.body.logoFile = filename;
            schoolMethods.updatePhoto(req, res, function (result) {
                res.send(filename);
            });
        }

        if (req.body.type == 'employee_photo') {
            req.body.photoFile = filename;
            employeeMethods.updatePhoto(req, res, function (result) {
                res.send(filename);
            });
        }


    });
});

router.post('/upload-app-photo', function (req, res) {
    uploadPhoto(req, res, function (err) {
        if (err) {
            console.log('error : ', err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.files) {
            res.json({error_code: 1, err_desc: "No file passed"});
            return;
        }
        console.log('File Name : ', filename);
        res.send(filename);
        // req.body.ministry_logo = filename;
        // appSettingsMethods.updatePhotos(req, res, function (result) {
        //     res.send(filename);
        // });

    });
});


router.post('/saveAppSettingsData', function (req, res, next) {
    appSettingsMethods.saveAppSettingsData(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getAppSettings', function (req, res, next) {
    appSettingsMethods.getappSettingsData(req, res, function (result) {
        res.send(result);
    });
});
router.post('/saveCalender', function (req, res, next) {
    appSettingsMethods.saveCalender(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getCalender', function (req, res, next) {
    appSettingsMethods.getCalender(req, res, function (result) {
        res.send(result);
    });
});

// job title settings routes

router.post('/saveJobTitle', function (req, res, next) {
    jobTitleMethods.saveJobTitle(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getAllJobTitles', function (req, res, next) {
    jobTitleMethods.getJobTitles(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveSubJobTitle', function (req, res, next) {
    subJobTitleMethods.saveSubJobTitle(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getAllSubJobTitles', function (req, res, next) {
    subJobTitleMethods.getSubJobTitles(req, res, function (result) {
        res.send(result);
    });
});


router.post('/saveStudentData', function (req, res, next) {
    studentsMethods.saveStudent(req, res, function (result) {
        res.send(result);
    });
});

router.post('/DeactivateUser', function (req, res, next) {
    userMethods.DeactivateUser(req, res, function (result) {
        res.send(result);
    });
});

router.post('/ActivateUser', function (req, res, next) {
    userMethods.ActivateUser(req, res, function (result) {
        res.send(result);
    });
});

module.exports = router;