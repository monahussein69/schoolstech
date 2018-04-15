var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
let actionsMethods = require('./actions');
let employee = require('./employee');
var takenActionsMethods = {

    getTakenAction: function (req, res, callback) {
        var takenActionId = req.params.takenActionId;
        sequelizeConfig.takenActionsTable.find({where: {id: takenActionId}}).then(function (task) {
            callback(task);
        });
    },

    saveTakenActionData: function (req, res, callback) {

        var TakenActionObj = req.body.TakenActionObj;

        var response = {};

        sequelizeConfig.takenActionsTable.find({where: {id: TakenActionObj.id}}).then(function (TakenAction) {
            if (TakenAction) {
                TakenAction.updateAttributes(TakenActionObj).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = TakenAction.id;
                    response.result = TakenAction;
                    callback(response);
                })
            } else {
                sequelizeConfig.takenActionsTable.create(TakenActionObj).then(TakenAction => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = TakenAction.id;
                    response.result = TakenAction;
                    callback(response);
                });
            }
        });

    },
    newTakenAction: function (takenActionObj, callback) {
        let response = {};
        sequelizeConfig.takenActionsTable.create(takenActionObj).then(takenAction => {
            response.success = true;
            response.msg = 'تم الحفظ بنجاح';
            response.insertId = takenAction.id;
            response.result = takenAction;
            callback(response);
        });
    },

    getAllTakenAction: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.School_id = ?', [schoolId], function (err, result) {
            callback(result);
        });
    },
    getTakenActionByEmpId: function (req, res, callback) {
        var empId = req.body.empId;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.Emp_id = ?', [empId], function (err, result) {
            callback(result);
        });
    },
    getLastTakenActionByEmpIdandActionType: function (req, res, callback) {
        var empId = req.body.empId;
        var actionType = req.body.actionType;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.Emp_id = ? and sch_att_takenaction.ACTION_id = ?', [empId, actionType], function (err, result) {
            callback(result);
        });
    },
    sendActionToEmp: function (attendanceData, callback) {
        let req = {
            params: {}
        };
        let res = {};
        actionsMethods.getActionByName(attendanceData.actionType, function (data) {
            if (data.action_body) {
                employee.getEmployeeForActions(attendanceData.employee_id, function (employeeData) {
                    console.log('employeeData : ', employeeData[0].name);
                    data.action_body = data.action_body.replace(/{teacher_name}/g, employeeData[0].name);
                    data.action_body = data.action_body.replace(/{major_name}/g, (employeeData[0].major) ? employeeData[0].major : "-");
                    data.action_body = data.action_body.replace(/{level}/g, (employeeData[0].educational_level) ? employeeData[0].educational_level : "-");
                    data.action_body = data.action_body.replace(/{job_num}/g, (employeeData[0].job_no) ? employeeData[0].job_no : '-');
                    data.action_body = data.action_body.replace(/{positon}/g, (employeeData[0].job_name) ? employeeData[0].job_name : '-');
                    data.action_body = data.action_body.replace(/{start_Date}/g, attendanceData.absentData.Start_Date);
                    data.action_body = data.action_body.replace(/{start_Day}/g, takenActionsMethods.getArabicDay(moment(attendanceData.absentData.Start_Date).day()));
                    data.action_body = data.action_body.replace(/{end_Date}/g, attendanceData.absentData.End_Date);
                    data.action_body = data.action_body.replace(/{end_Day}/g, takenActionsMethods.getArabicDay(moment(attendanceData.absentData.End_Date).day()));
                    data.action_body = data.action_body.replace(/{school_name}/g, employeeData[0].school_name);

                    console.log('action_body : ', data.action_body)
                })

            }

        });
        console.log("yes it's time to send Action");
    },

    getArabicDay: function (dayNo) {
        var array = [];
        array[0] = 'الاحد';
        array[1] = 'الاثنين';
        array[2] = 'الثلاثاء';
        array[3] = 'الاربعاء';
        array[4] = 'الخميس';
        array[5] = 'الجمعة';
        array[6] = 'السبت';
        return array[dayNo];
    },


};


module.exports = takenActionsMethods;