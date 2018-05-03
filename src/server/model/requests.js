var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
let employee = require('./employee');
let employeeVacation = require('./employeeVacation');

var requestsMethods = {
    getEmployeeRequests: function (req, res, callback) {
        console.log('employee_id : ', req.params.employee_id);
        con.query("SELECT * FROM sch_sys_requests JOIN app_def_requeststype ON sch_sys_requests.request_type = app_def_requeststype.Id WHERE created_by = ?", [req.params.employee_id], function (err, result) {
            console.log('result : ', result);
            callback(result);
        });
    },
    getSchoolRequests: function (req, res, callback) {
        console.log('school_id : ', req.params.school_id);
        let sql = con.query("SELECT * , sch_sys_requests.id as request_id  FROM sch_sys_requests " +
            "JOIN app_def_requeststype ON sch_sys_requests.request_type = app_def_requeststype.Id " +
            "JOIN sch_str_employees ON sch_sys_requests.created_by = sch_str_employees.id " +
            "WHERE sch_sys_requests.school_id = ?", [req.params.school_id], function (err, result) {
            console.log('result : ', result);
            console.log('sql : ', sql.sql);
            callback(result);
        });
    },
    getRequestsTypes: function (req, res, callback) {
        con.query("SELECT * FROM app_def_requeststype", [], function (err, result) {
            console.log('result : ', result);
            callback(result);
        });
    },
    saveRequestData: function (req, res, callback) {
        let response = {};
        sequelizeConfig.requestsTable.create(req.body.requestData).then(function (data) {
            if (data) {
                response.success = true;
                response.id = data.id;
                response.msg = 'تمت الاضافة بنجاح'
                callback(response);
            } else {
                console.log("error");
            }
        })
    },

    changeStatusForRequests: function (req, res, callback) {
        let response = {};
        let data = req.body;
        console.log('data : ', data);
        sequelizeConfig.requestsTable.update({status: data.status}, {where: {id: data.id}}).then((result) => {
            response.success = true;
            if (data.status == 'مقبول') {
                response.msg = 'تم قبول الطلب بنجاح';
                sequelizeConfig.requestsTable.find({where: {id: data.id}}).then(function (request) {
                    if (request) {
                        var absentObj = {
                            School_id: request.school_id,
                            Emp_id: request.created_by,
                            Start_Date: moment(request.Start_Date).format('YYYY/MM/DD'),
                            End_Date: moment(request.End_Date).format('YYYY/MM/DD'),
                            No_Of_Days: request.No_Of_Days,
                        };
                        console.log('absentObj : ', absentObj);
                        req.body.AbsentObj = absentObj;
                        req.body.fromAttendance = 0;
                        employeeVacation.sendAbsentRequest(req, res, function (result) {

                        });
                    }
                });
            } else if (data.status == 'مرفوض') {
                response.msg = 'تم رفض الطلب';
            }
            callback(response);

        }).catch(function (error) {
            console.log(error);
        });
    },
};


module.exports = requestsMethods;