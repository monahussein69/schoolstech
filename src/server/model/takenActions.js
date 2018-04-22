var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
let actionsMethods = require('./actions');
let employee = require('./employee');
let employeesVacationMethods = require('./employeeVacation');
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

    setActionReply: function (req, res, callback) {
        let response = {};
        let actionReplyObj = req.body;
        console.log('actionReplyObj', actionReplyObj);
        sequelizeConfig.takenActionsTable.update(actionReplyObj, {where: {Id: actionReplyObj.Id}}).then((result) => {
            response.success = true;
            response.msg = 'تم اضافة الرد بنجاح';
            callback(response);
        });
    },

    doAction: function (req, res, callback) {
        let response = {};
        let data = req.body;
        sequelizeConfig.takenActionsTable.update({ACTION_Status: data.status}, {where: {Id: data.id}}).then((result) => {
            response.success = true;
            if (data.status == 'مقبول') {
                response.msg = 'تم قبول المسائلة بنجاح';
            } else if (data.status == 'مرفوض') {
                response.msg = 'لم يتم قبول المسائلة .. تم ارسال قرار حسم غياب';
                takenActionsMethods.sendDecision(req, res, function (employee) {
                });
            }
            callback(response);

        }).catch(function (error) {
            console.log(error);
        });
    },

    sendDecision: function (req, res, callback) {
        let currentDate = moment().format("MM-DD-YYYY");
        sequelizeConfig.takenActionsTable.find({where: {id: req.body.id}}).then((takenAction) => {
            console.log('takenAction : ', takenAction);
            actionsMethods.getActionByName('قرار حسم غياب', function (data) {
                if (data.action_body) {
                    console.log(data.action_body);
                    employee.getEmployeeForActions(takenAction.Emp_id, function (employeeData) {
                        employeesVacationMethods.getLastEmployeeVaction(takenAction.Emp_id, function (employeeVaction) {
                            console.log('EmployeeVaction : ', employeeVaction);
                            data.action_body = data.action_body.replace(/{teacher_name}/g, employeeData[0].name);
                            data.action_body = data.action_body.replace(/{major_name}/g, (employeeData[0].major) ? employeeData[0].major : "-");
                            data.action_body = data.action_body.replace(/{level}/g, (employeeData[0].educational_level) ? employeeData[0].educational_level : "-");
                            data.action_body = data.action_body.replace(/{job_num}/g, (employeeData[0].job_no) ? employeeData[0].job_no : '-');
                            data.action_body = data.action_body.replace(/{positon}/g, (employeeData[0].job_name) ? employeeData[0].job_name : '-');
                            data.action_body = data.action_body.replace(/{absent_days}/g, employeeVaction[0].No_Of_Days);
                            // data.action_body = data.action_body.replace(/{start_Day}/g, takenActionsMethods.getArabicDay(moment(attendanceData.absentData.Start_Date).day()));
                            data.action_body = data.action_body.replace(/{current_date}/g, currentDate);
                            // data.action_body = data.action_body.replace(/{end_Day}/g, takenActionsMethods.getArabicDay(moment(attendanceData.absentData.End_Date).day()));
                            data.action_body = data.action_body.replace(/{school_name}/g, employeeData[0].school_name);
                            req.body.job_title = 'قائد مدرسة الحالي';
                            req.body.schoolId = takenAction.School_id;

                            employee.getEmployeesBasedJob(req, res, function (leaderData) {
                                data.action_body = data.action_body.replace(/{leader_name}/g, leaderData[0].name);
                                data.action_body = data.action_body.replace(/{leader_signature}/g, ' ');
                                data.action_body = data.action_body.replace(/{current_date}/g, currentDate);
                                console.log('action_body : ', data.action_body);
                                let takenActionData = {
                                    Calender_id: takenAction.Calender_id,
                                    School_id: takenAction.School_id,
                                    ACTION_id: data.Id,
                                    Emp_id: takenAction.Emp_id,
                                    ACTION_Status: 'معلق',
                                    TAKEN_BY: leaderData[0].name,
                                    ACTION_body: data.action_body,
                                    issue_date: currentDate,
                                }
                                takenActionsMethods.newTakenAction(takenActionData, function (response) {
                                    console.log("status : ", response);
                                });
                            });
                        });
                    })
                }
            });
            console.log("yes it's time to send Action");
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
    getEmployeeActions: function (req, res, callback) {
        employee.getEmployeeByUserId(req, res, function (employee) {
            console.log(employee[0].id);
            sequelizeConfig.takenActionsTable.query("SELECT * , app_def_actions.action_name FROM sch_att_takenaction JOIN app_def_actions ON sch_att_takenaction.ACTION_id = app_def_actions,Id WHERE sch_att_takenaction.Id = " + employee[0].id).then(actions => {
                callback(actions);
            });
        });

    },

    getSchoolActions: function (req, res, callback) {
        let sql = con.query("SELECT * , app_def_actions.action_name FROM sch_att_takenaction JOIN app_def_actions ON sch_att_takenaction.ACTION_id = app_def_actions.Id WHERE sch_att_takenaction.School_id = ?", [req.params.schoolId], function (err, result) {
            console.log(result);
            callback(result);
        });
        console.log(sql.sql);
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
            params: {},
            body: {}
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
                    req.body.job_title = 'قائد مدرسة الحالي';
                    req.body.schoolId = attendanceData.absentData.School_id;

                    employee.getEmployeesBasedJob(req, res, function (leaderData) {
                        data.action_body = data.action_body.replace(/{leader_name}/g, leaderData[0].name);
                        data.action_body = data.action_body.replace(/{leader_signature}/g, ' ');
                        data.action_body = data.action_body.replace(/{Date}/g, attendanceData.absentData.End_Date);
                        console.log('action_body : ', data.action_body);
                        let takenActionData = {
                            Calender_id: attendanceData.absentData.Calender_id,
                            School_id: attendanceData.absentData.School_id,
                            ACTION_id: data.Id,
                            Emp_id: attendanceData.absentData.Emp_id,
                            ACTION_Status: 'معلق',
                            TAKEN_BY: leaderData[0].name,
                            ACTION_body: data.action_body,
                            issue_date: attendanceData.absentData.End_Date,
                        }
                        takenActionsMethods.newTakenAction(takenActionData, function (response) {
                            console.log("status : ", response);
                        });
                    });

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