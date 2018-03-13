var con = require('../routes/dbConfig.js');
var moment = require('moment');
var workingSettingsMethods = require('../model/schedualProfile.js');
var appSettingsMethods = require('../model/appSettings.js');

var employeesAttendanceMethods = {

    getAllEmployeesAttendance: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select sch_att_empatt.*,sch_str_employees.name ,sch_str_employees.id as emp_id from sch_att_empatt join sch_str_employees on sch_att_empatt.school_id = sch_str_employees.school_id where sch_str_employees.school_id = ? group by sch_str_employees.id', [schoolId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


    setEmployeeAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        req.params.SchoolId = attendanceObj.school_id;
        var response = {};
        attendanceObj.late_min = '';

        var current_date = moment().format('MM-DD-YYYY');
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {

            if (Object.keys(result).length) {
                var calendarObj = result[0];
                attendanceObj.Calender_id = calendarObj.Id;

                workingSettingsMethods.getActiveAttSchedule(req, res, function (result) {
                    if (Object.keys(result).length) {
                        if (attendanceObj.is_absent == 0) {
                            var schoolProfile = result[0];
                            var queue_Begining_time = moment(schoolProfile.queue_Begining, 'HH:mm').format('HH:mm');
                            //var current_time = moment().format('HH:mm');
                            var current_time = attendanceObj.time_in;
                            attendanceObj.time_in = current_time;

                            var ms = moment(current_time, "HH:mm").diff(moment(queue_Begining_time, "HH:mm"));

                            if (ms <= 0) {
                                ms = moment(current_time, "HH:mm").diff(moment(queue_Begining_time, "HH:mm")) / 2;
                            }

                            var d = moment.duration(ms);
                            var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                            attendanceObj.late_min = hours;
                        }

                        req.body.attendanceObj = attendanceObj;
                        employeesAttendanceMethods.addEmployeeAttendance(req, res, function (result) {
                            callback(result);
                        });

                    } else {
                        response.success = false;
                        response.msg = 'لا يوجد حساب مفعل الرجاء التفعيل';
                        callback(response);
                    }
                });
            } else {
                response.success = false;
                response.msg = 'اليوم ليس موجود';
                callback(response);
            }
        });
    },

    addEmployeeAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        var response = {};

        con.query('select * from sch_att_empatt where Calender_id = ? and employee_id = ?', [attendanceObj.Calender_id, attendanceObj.employee_id], function (err, result) {
            if (err)
                throw err;

            if (Object.keys(result).length) {

                con.query('update sch_att_empatt set  school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ? where Calender_id = ? and employee_id = ? ',
                    [
                        attendanceObj.school_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                        attendanceObj.Calender_id,
                        attendanceObj.employee_id,
                    ], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            if (attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if (attendanceObj.is_absent == 1)
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
                con.query('insert into sch_att_empatt (Calender_id,school_id,employee_id,Event_Name,time_in,late_min,is_absent) values (?,?,?,?,?,?,?) ',
                    [attendanceObj.Calender_id,
                        attendanceObj.school_id,
                        attendanceObj.employee_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                    ], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            if (attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if (attendanceObj.is_absent == 1)
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
            }
        });
    },

    setEmployeeActivityAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        req.params.SchoolId = attendanceObj.school_id;
        var response = {};
        attendanceObj.late_min = '';

        var current_date = moment().format('MM-DD-YYYY');
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                attendanceObj.Calender_id = calendarObj.Id;
                if (attendanceObj.is_absent == 0) {
                    var begining_time = moment(attendanceObj.Begining_Time, 'HH:mm').format('HH:mm');
                    //var current_time = moment().format('HH:mm');
                    var current_time = attendanceObj.time_in;
                    attendanceObj.time_in = current_time;

                    var ms = moment(current_time, "HH:mm").diff(moment(begining_time, "HH:mm"));

                    if (ms <= 0) {
                        // ms = moment(current_time, "HH:mm").diff(moment(begining_time, "HH:mm"));
                        attendanceObj.late_min = '';
                    }else{
                        var d = moment.duration(ms);
                        var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                        attendanceObj.late_min = hours;
                    }
                }else if(attendanceObj.is_absent == 2){
                    var ending_time = moment(attendanceObj.Ending_Time, 'HH:mm').format('HH:mm');
                    //var current_time = moment().format('HH:mm');
                    var current_time = attendanceObj.time_in;
                    attendanceObj.time_in = current_time;

                    var ms = moment(ending_time, "HH:mm").diff(moment(current_time, "HH:mm"));

                    if (ms <= 0) {
                        // ms = moment(current_time, "HH:mm").diff(moment(begining_time, "HH:mm"));
                        attendanceObj.late_min = '';
                    }else{
                        var d = moment.duration(ms);
                        var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                        attendanceObj.late_min = hours;
                    }
                }

                req.body.attendanceObj = attendanceObj;
                employeesAttendanceMethods.addEmployeeActivityAttendance(req, res, function (result) {
                    callback(result);
                });
            } else {
                response.success = false;
                response.msg = 'اليوم ليس موجود';
                callback(response);
            }
        });
    },
    addEmployeeActivityAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        var response = {};

        con.query('select * from sch_att_empatt where Calender_id = ? and employee_id = ? and Event_Name = ?', [attendanceObj.Calender_id, attendanceObj.employee_id , attendanceObj.Event_Name], function (err, result) {
            if (err)
                throw err;

            if (Object.keys(result).length) {

                con.query('update sch_att_empatt set  school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ? where Calender_id = ? and employee_id = ? ',
                    [
                        attendanceObj.school_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                        attendanceObj.Calender_id,
                        attendanceObj.employee_id,
                    ], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            if (attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if (attendanceObj.is_absent == 1)
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
                con.query('insert into sch_att_empatt (Calender_id,school_id,employee_id,Event_Name,time_in,late_min,is_absent) values (?,?,?,?,?,?,?) ',
                    [attendanceObj.Calender_id,
                        attendanceObj.school_id,
                        attendanceObj.employee_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                    ], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            if (attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل التأخر بنجاح';
                            if (attendanceObj.is_absent == 1)
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
            }
        });
    },


};

module.exports = employeesAttendanceMethods;