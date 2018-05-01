var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');

var employeesVacationMethods = {

    sendAbsentRequest: function (req, res, callback) {
        console.log('sendAbsentRequest : ', req.body);
        var AbsentObj = req.body.AbsentObj;
        var fromAttendance = req.body.fromAttendance;
        var current_date = moment(AbsentObj.Start_Date).format('MM-DD-YYYY');
        // var current_date = '03-18-2018';

        var response = {};
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                AbsentObj.Calender_id = calendarObj.Id;
				var absentType = AbsentObj.absentType;
				delete  AbsentObj.absentType;
                console.log("AbsentObj : ", AbsentObj);
                var query = con.query('insert into sch_att_empvacation set ?',
                    [AbsentObj], function (err, result) {
                        console.log(query.sql);
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            for (var i = 0; i < AbsentObj.No_Of_Days; i++) {
								AbsentObj.absentType = absentType;
                                req.body.AbsentObj = AbsentObj;
                                req.body.date = moment(AbsentObj.Start_Date, "MM-DD-YYYY").add(i, 'days').format('MM-DD-YYYY');
                                if(!fromAttendance) {
                                    employeesVacationMethods.setVactionIntoEmpAttendence(req, res, function (result) {
                                    });
                                }
                            }
                            response.success = true;
                            response.msg = 'تم تسجيل الغياب بنجاح';
                            response.id = result.insertId;
                            callback(response);
                        } else {
                            response.success = false;
                            response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            callback(response);
                        }

                    }
                );

            } else {
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }
        });

    },
    getLastEmployeeVaction: function (emp_id, callback) {
        var query = con.query('select * from sch_att_empvacation where Emp_id = ? order by id desc limit 1', [emp_id], function (err, result) {
            if (err)
                throw err
            callback(result);
        });
    },
    setVactionIntoEmpAttendence:function(req, res, callback) {
       

	   
	   var data = {
            school_id: req.body.AbsentObj.school_id,
            employee_id: req.body.AbsentObj.Emp_id,
            is_absent: 1,
            on_vacation: 1,
            working_status: 0,
            Event_Name:'بدايه الدوام',
           time_in:'',
           late_min:'',
           Total_min:''
        };

        appSettingsMethods.getCalenderByDate(req, res, function (calendar) {
            if (Object.keys(calendar).length){
                data.Calender_id = calendar[0].Id;
                sequelizeConfig.employeeAttandaceTable.find({
                    where: {
                        employee_id: req.body.AbsentObj.Emp_id,
                        Calender_id: req.body.AbsentObj.Calender_id,
                        Event_Name:'بدايه الدوام'
                    }
                }).then(function (employeeAttendence) {
                    // Check if record exists in db
                    if (employeeAttendence) {
                        employeeAttendence.updateAttributes(data).then(function () {
                        })
                    }else{
                        sequelizeConfig.employeeAttandaceTable.create(data).then(employeeAttendece => {
                            callback(employeeAttendece);
                        });
                    }
                })
            }

        });
    }
}

module.exports = employeesVacationMethods;