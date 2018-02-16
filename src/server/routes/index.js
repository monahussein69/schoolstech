var express = require('express');
var router = express.Router();
var loginMethod = require('../model/login.js');
var schoolMethods = require('../model/school.js');
var schoolAccountMethods = require('../model/schoolAccount.js');

var app = express();
var multer = require('multer');
var filename = '';

//Multer Configration
//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
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


var uploadPhoto = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['png', 'jpg' , 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

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
        schoolMethods.UploadExcel(req, res, function (result) {
            console.log("result : ", result);
            res.send({status: true, msg: 'تم اضافة الملف بنجاح'});
        });
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
        if (!req.file) {
            res.json({error_code: 1, err_desc: "No file passed"});
            return;
        }
        req.body.logoFile = filename;
        schoolMethods.updatePhoto(req, res, function (result) {
            res.send(filename);
        });

    });
});

module.exports = router;