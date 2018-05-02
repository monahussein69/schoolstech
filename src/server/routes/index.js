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
var workingSettingsMethods = require('../model/schedualProfile.js');
var attScheduleMethods = require('../model/sch_att_schedule.js');
var employeesAttendanceMethods = require('../model/employeesAttendance.js');
var employeeAttendanceRecordMethods = require('../model/employeeAttendanceRecord.js');
var employeesExcuseMethods = require('../model/employeesExcuse.js');
var employeesVacationMethods = require('../model/employeeVacation.js');
var studentAttendanceMethods = require('../model/studentAttendance.js');
var studentAttendanceRecordMethods = require('../model/studentAttendanceRecord.js');
var studentExcuseMethods = require('../model/studentExcuse.js');
var taskMethods = require('../model/tasks.js');
var subTaskMethods = require('../model/subTask.js');
var taskStatusMethods = require('../model/taskStatus.js');
var studentTaskMethods = require('../model/studentTask.js');
var studentGroupsMethods = require('../model/studentGroups.js');
var takenActionsMethods = require('../model/takenActions');
var VacationTypesMethods = require('../model/vacationTypes.js');
var RequestsTypeMethods = require('../model/RequestsType.js');
var ExcuseTypeMethods = require('../model/ExcuseTypes.js');

var fireBaseConn= require('../routes/fireBaseConfig.js');
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
        if (['png', 'jpg', 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
});

var uploadPhoto = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['png', 'jpg', 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).array('files', 10);

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

router.get('/countSchools', function (req, res, next) {
    schoolMethods.countSchools(req, res, function (result) {
        res.send(result);
    });
});

router.get('/countSchoolsAccounts', function (req, res, next) {
    schoolAccountMethods.countSchoolsAccounts(req, res, function (result) {
        res.send(result);
    });
});


router.get('/deleteTask/:taskId', function (req, res, next) {
    taskMethods.deleteTask(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getTaskStatus/:statusId', function (req, res, next) {
    taskStatusMethods.getTaskStatus(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllTaskStatus', function (req, res, next) {
    taskStatusMethods.getAllTaskStatus(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveTaskStatusData', function (req, res, next) {
    taskStatusMethods.saveTaskStatusData(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getVacationType/:typeId', function (req, res, next) {
    VacationTypesMethods.getVacationType(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllVacationTypes', function (req, res, next) {
    VacationTypesMethods.getAllVacationTypes(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveVacationTypeData', function (req, res, next) {
    VacationTypesMethods.saveVacationTypeData(req, res, function (result) {
        res.send(result);
    });
});


router.get('/getRequestType/:typeId', function (req, res, next) {
    RequestsTypeMethods.getRequestType(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllRequestsType', function (req, res, next) {
    RequestsTypeMethods.getAllRequestsType(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveRequestTypeData', function (req, res, next) {
    RequestsTypeMethods.saveRequestTypeData(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getExcuseType/:typeId', function (req, res, next) {
    ExcuseTypeMethods.getExcuseType(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllExcuseTypes', function (req, res, next) {
    ExcuseTypeMethods.getAllExcuseTypes(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveExcuseTypeData', function (req, res, next) {
    ExcuseTypeMethods.saveExcuseTypeData(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getTask/:taskId', function (req, res, next) {
    taskMethods.getTask(req, res, function (result) {
        res.send(result);
    });
});


router.post('/saveStudentsTask', function (req, res, next) {
    studentTaskMethods.saveStudentsTask(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllStudentTask/:subTaskId', function (req, res, next) {
    studentTaskMethods.getAllStudentTask(req, res, function (result) {
        res.send(result);
    });
});

router.get('/deleteStudentTask/:id', function (req, res, next) {
    studentTaskMethods.deleteStudentTask(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllTasks/:schoolId', function (req, res, next) {
    taskMethods.getAllTasks(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveTaskData', function (req, res, next) {
    taskMethods.saveTaskData(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getTaskByEmpId', function (req, res, next) {
    taskMethods.getTaskByEmpId(req, res, function (result) {
        res.send(result);
    });
});

router.get('/deleteSubTask/:subTaskId', function (req, res, next) {
    subTaskMethods.deleteSubTask(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getSubTask/:subTaskId', function (req, res, next) {
    subTaskMethods.getSubTask(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllSubTasks/:taskId', function (req, res, next) {
    subTaskMethods.getAllSubTasks(req, res, function (result) {
        res.send(result);
    });
});

router.post('/saveSubTaskData', function (req, res, next) {
    subTaskMethods.saveSubTaskData(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getSubTaskByEmpId', function (req, res, next) {
    subTaskMethods.getSubTaskByEmpId(req, res, function (result) {
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
router.get('/getAllStudents/:schoolId', function (req, res, next) {
    studentsMethods.getAllStudents(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllStudentsByGroup/:schoolId/:group', function (req, res, next) {
    studentsMethods.getAllStudentsByGroup(req, res, function (result) {
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

router.get('/getAllTeachers/:schoolId', function (req, res, next) {
    employeeMethods.getAllTeachers(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getAllEmployeesAttendanceByActivity', function (req, res, next) {
    employeesAttendanceMethods.getAllEmployeesAttendanceByActivity(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getAllStudentsAttendanceByActivity', function (req, res, next) {
    studentAttendanceMethods.getAllStudentsAttendanceByActivity(req, res, function (result) {
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

router.get('/getEmployeeByUserId/:userId', function (req, res, next) {
    employeeMethods.getEmployeeByUserId(req, res, function (result) {
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
                res.send(result);
            });
        } else if (req.body.type == 'students') {
            studentsMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: result.message});
            });
        } else if (req.body.type == 'schoolSchedule') {
            schoolMethods.UploadExcel(req, res, function (result) {
                console.log("result : ", result);
                res.send({status: true, msg: result.message});
            });
        } else if (req.body.type == 'studentsDegrees') {
            studentsMethods.UploadExcel(req, res, function (result) {
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

router.post('/getCalenderByDate', function (req, res, next) {
    appSettingsMethods.getCalenderByDate(req, res, function (result) {
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


router.get('/getCalender/:first_Academic_Year/:end_Academic_Year/:Term_Id', function (req, res, next) {
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

router.post('/saveWorkingSettingsData', function (req, res, next) {
    workingSettingsMethods.saveWorkingSettingsData(req, res, function (result) {
        if (result.success) {
            req.body.profile_id = result.id;
            attScheduleMethods.saveActivityData(req, res, function (result) {
                //res.send(result);
            });
        }
        res.send(result);
    });
});

router.get('/getAllProfileActivites/:profileId', function (req, res, next) {
    attScheduleMethods.getAttSchedule(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getActiveAttSchedule/:SchoolId', function (req, res, next) {
    workingSettingsMethods.getActiveAttSchedule(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getSettingsProfile/:profileId', function (req, res, next) {
    workingSettingsMethods.getSettingProfile(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getActivityByDayAndSchoolId', function (req, res, next) {
    workingSettingsMethods.getActivityByDayAndSchoolId(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getActivityByEmployeeId', function (req, res, next) {
    employeeMethods.getActivityByEmployeeId(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getStudentsByActivityId/:activityId', function (req, res, next) {
    studentsMethods.getStudentsByActivityId(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllEmployeesAttendance/:schoolId', function (req, res, next) {
    employeesAttendanceMethods.getAllEmployeesAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getAllEmployeesAttendanceByDate', function (req, res, next) {
    employeesAttendanceMethods.getAllEmployeesAttendanceByDate(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getEmployeeLateRecord/:schoolId/:employeeId', function (req, res, next) {
    employeeAttendanceRecordMethods.getEmployeeLateRecord(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getEmployeeAbsentRecord/:schoolId/:employeeId', function (req, res, next) {
    employeeAttendanceRecordMethods.getEmployeeAbsentRecord(req, res, function (result) {
        res.send(result);
    });
});
router.get('/getEmployeeExcuseRecord/:schoolId/:employeeId', function (req, res, next) {
    employeeAttendanceRecordMethods.getEmployeeExcuseRecord(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getStudentExcuseRecord/:schoolId/:studentId', function (req, res, next) {
    studentAttendanceRecordMethods.getStudentExcuseRecord(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getStudentAbsentRecord/:schoolId/:studentId', function (req, res, next) {
    studentAttendanceRecordMethods.getStudentAbsentRecord(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getStudentLateRecord/:schoolId/:studentId', function (req, res, next) {
    studentAttendanceRecordMethods.getStudentLateRecord(req, res, function (result) {
        res.send(result);
    });
});

router.post('/setEmployeeAttendance/', function (req, res, next) {
    employeesAttendanceMethods.setEmployeeAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/setStudentAttendance/', function (req, res, next) {
    studentAttendanceMethods.setStudentAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getjobTitleByName', function (req, res, next) {
    jobTitleMethods.getjobTitleByName(req, res, function (result) {
        res.send(result);
    });
});

router.post('/setEmployeeActivityAttendance/', function (req, res, next) {
    employeesAttendanceMethods.setEmployeeActivityAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/closeFirstAttendance/', function (req, res, next) {
    employeesAttendanceMethods.closeFirstAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/closeSecondAttendance/', function (req, res, next) {
    employeesAttendanceMethods.closeSecondAttendance(req, res, function (result) {
        res.send(result);
    });
});

router.post('/getClosingButton/', function (req, res, next) {
    employeesAttendanceMethods.getClosingButton(req, res, function (result) {
        res.send(result);
    });
});

router.post('/sendExcuseRequest/', function (req, res, next) {
    employeesExcuseMethods.sendExcuseRequest(req, res, function (result) {
        res.send(result);
    });
});

router.post('/sendStudentExcuseRequest/', function (req, res, next) {
    studentExcuseMethods.sendStudentExcuseRequest(req, res, function (result) {
        res.send(result);
    });
});

router.post('/sendAbsentRequest/', function (req, res, next) {
    employeesVacationMethods.sendAbsentRequest(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllSettingsProfiles/:schoolId', function (req, res, next) {
    workingSettingsMethods.getAllSettingsProfiles(req, res, function (result) {
        res.send(result);
    });
});

router.get('/getAllStudentsGroups/:schoolId', function (req, res, next) {
    studentGroupsMethods.getAllStudentsGroups(req, res, function (result) {
        res.send(result);
    });
});

router.get('/deleteSettingsProfile/:profileId/:schoolId', function (req, res, next) {
    workingSettingsMethods.deleteSettingProfile(req, res, function (result) {
        res.send(result);
    });
});
router.get('/getEmployeeActions/:userId', function (req, res, next) {
    takenActionsMethods.getEmployeeActions(req, res, function (result) {
        res.send(result);
    });
});
router.get('/getSchoolActions/:schoolId', function (req, res, next) {
    takenActionsMethods.getSchoolActions(req, res, function (result) {
        res.send(result);
    });
});
router.post('/setActionReply', function (req, res, next) {
    takenActionsMethods.setActionReply(req, res, function (result) {
        res.send(result);
    });
});
router.post('/doAction', function (req, res, next) {
    takenActionsMethods.doAction(req, res, function (result) {
        res.send(result);
    });
});
router.get('/countUnreadNotifications/:user_id', function (req, res, next) {
    fireBaseConn.countUnreadNotifications(req,res,function (result) {
        res.send(result);
    });
});

router.get('/getUserNotifications/:user_id', function (req, res, next) {
    fireBaseConn.getUserNotifications(req,res,function (result) {
        res.send(result);
    });
});

router.post('/sendNotification', function (req, res, next) {
    fireBaseConn.sendNotification(req,res,function (result) {
        res.send(result);
    });
});

router.post('/getStartEndAttendance', function (req, res, next) {
    attScheduleMethods.getStartEndAttendance(req, res, function (result) {
        res.send(result);
    });
});

module.exports = router;