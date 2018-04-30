var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');


var employeesExcuseMethods = {
    sendExcuseRequest: function (req, res, callback) {
        var ExcuseObj = req.body.ExcuseObj;
        var current_date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
        var response = {};
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                ExcuseObj.Calender_id = calendarObj.Id;
                ExcuseObj.Start_Date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
                ExcuseObj.End_Date = moment(ExcuseObj.End_Date).format('MM-DD-YYYY');
				var Event_Name = ExcuseObj.Event_Name;
   
                sequelizeConfig.employeeExcuseTable.find({where: {id: ExcuseObj.Calender_id}}).then(function (Excuse) {
                    if (Excuse) {
                        Excuse.updateAttributes(ExcuseObj).then(function () {
                            sequelizeConfig.employeeAttandaceTable.find({
                                where: {
                                    employee_id: ExcuseObj.Emp_id,
                                    Calender_id: ExcuseObj.Calender_id,
									Event_Name:Event_Name
                                }
                            })
                                .then(function (employeeAttendence) {
                                    // Check if record exists in db
									console.log(employeeAttendence);
                                    if (employeeAttendence) {
                                        employeeAttendence.updateAttributes({
                                            is_excused: 1
                                        }).then(function () {
                                            console.log("yes");
                                        })
                                    }
                                })
                            response.success = true;
                            response.msg = 'تم تقديم الطلب بنجاح';
                            callback(response);
                        })
                    } else {

                        sequelizeConfig.employeeExcuseTable.create(ExcuseObj).then(result => {
                            sequelizeConfig.employeeAttandaceTable.find({
                                where: {
                                    employee_id: ExcuseObj.Emp_id,
                                    Calender_id: ExcuseObj.Calender_id,
									Event_Name:Event_Name
                                }
                            })
                                .then(function (employeeAttendence) {
                                    // Check if record exists in db
									console.log(employeeAttendence);
                                    if (employeeAttendence) {
                                        employeeAttendence.updateAttributes({
                                            is_excused: 1
                                        }).then(function () {
                                            console.log("yes");
                                        })
                                    }
                                })
                            response.success = true;
                            response.msg = 'تم تقديم الطلب بنجاح';
                            callback(response);
                        });

                    }

                });
            }
            else {
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }

        });

    },
}

module.exports = employeesExcuseMethods;