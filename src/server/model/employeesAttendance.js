var con = require('../routes/dbConfig.js');
var moment = require('moment');
var workingSettingsMethods = require('../model/schedualProfile.js');
var appSettingsMethods = require('../model/appSettings.js');
var attScheduleMethods = require('../model/sch_att_schedule.js');
var employeesVacationMethods = require('../model/employeeVacation.js');
var takenActionsMethods = require('../model/takenActions.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');

var employeesAttendanceMethods = {


    getAllEmployeesAttendanceByActivity: function (req, res, callback) {

        var current_date = moment(req.body.date).format('MM-DD-YYYY');
        req.body.date = current_date;
        var lecture_name = req.body.lecture_name;
        var breaks = ['طابور', 'صلاه', 'فسحه (1)', 'فسحه (2)'];

        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var schoolId = req.body.schoolId;
                var currentDay = workingSettingsMethods.getArabicDay(new Date(req.body.date).getDay());
                currentDay = 'الاحد';
                var currentDay1 = currentDay;
                if (currentDay == 'الاحد') {
                    currentDay1 = 'الأحد';
                }
                if (currentDay == 'الاثنين') {
                    currentDay1 = 'الأثنين';
                }
                if (currentDay == 'الاربعاء') {
                    currentDay1 = 'الأربعاء';
                }

                if (breaks.indexOf(lecture_name) > -1) {
                    var query = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,TIME_FORMAT(sch_att_empatt.time_in, "%h:%i %p") as time_in_formmated,sch_att_empexcuse.Start_Date as excuse_date,sch_att_empvacation.Start_Date as vacation_date from sch_str_employees  left join sch_att_empatt  on (sch_str_employees.id = sch_att_empatt.employee_id and sch_att_empatt.Event_Name = ?) left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id left join sch_att_empvacation on sch_att_empvacation.Emp_id = sch_str_employees.id where (sch_att_empatt.Event_Name = ? or sch_att_empatt.Event_Name IS NULL ) and sch_str_employees.school_id = ? and (sch_att_empatt.Calender_id = ? or sch_att_empatt.Calender_id IS NULL) group by main_employee_id order by sch_str_employees.name asc', [lecture_name, lecture_name, schoolId, calendarId], function (err, result) {
                            console.log(query.sql);
                            if (err)
                                throw err
                            callback(result);
                        }
                    );
                }else{
                    var query  = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,TIME_FORMAT(sch_att_empatt.time_in, "%h:%i %p") as time_in_formmated,sch_att_empexcuse.Start_Date as excuse_date,sch_att_empvacation.Start_Date as vacation_date from sch_str_employees join sch_acd_lecturestables '+
                        'on sch_acd_lecturestables.Teacher_Id = sch_str_employees.id '+
                        'join sch_acd_lectures on sch_acd_lecturestables.Lecture_NO = sch_acd_lectures.id '+
                        ' left join sch_att_empatt '+
                        ' on (sch_att_empatt.Calender_id = ? and sch_str_employees.id = sch_att_empatt.employee_id and sch_acd_lectures.name = sch_att_empatt.Event_Name)'+
                        'left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id '+
                        'left join sch_att_empvacation on sch_att_empvacation.Emp_id = sch_str_employees.id '+
                        'where sch_acd_lectures.name = ? and (sch_acd_lecturestables.Day = ? OR sch_acd_lecturestables.Day = ?) and sch_str_employees.school_id = ?  and sch_str_employees.id not in (select employee_id from sch_att_empatt where Calender_id = ? and school_id = ? and Event_Name = "طابور" and is_absent = 1) group by main_employee_id  order by sch_str_employees.name asc', [calendarId,lecture_name,currentDay,currentDay1,schoolId,calendarId,schoolId], function (err, result) {
                            console.log(query.sql);
                            if (err)
                                throw err
                            callback(result);
                        }
                    );
                }


            }else{
                callback(response);
            }
        });

    },

    getAllEmployeesAttendance: function (req, res, callback) {

        var current_date = moment().format('MM-DD-YYYY');
        req.body.date = current_date;
        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var schoolId = req.params.schoolId;
                var query = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,TIME_FORMAT(sch_att_empatt.time_in, "%h:%i %p") as time_in_formmated,sch_att_empexcuse.Start_Date as excuse_date , emp_vacation.Start_Date as vacation_date_start ,emp_vacation.End_Date as vacation_date_end from sch_str_employees left join sch_att_empatt on (sch_str_employees.id = sch_att_empatt.employee_id and sch_att_empatt.Calender_id = ?)left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id left join (SELECT s1.* FROM sch_att_empvacation as s1 LEFT JOIN sch_att_empvacation AS s2 ON s1.Emp_id = s2.Emp_id AND s1.Start_Date < s2.Start_Date WHERE s2.Emp_id IS NULL) as emp_vacation on emp_vacation.Emp_id = sch_str_employees.id where sch_str_employees.school_id = ?  group by main_employee_id order by sch_str_employees.name asc', [calendarId, schoolId], function (err, result) {
                        console.log('query');
                        console.log(query.sql);
                        if (err)
                            throw err
                        callback(result);
                    }
                );
            } else {
                callback(response);
            }
        });

    },


    getAllEmployeesAttendanceByDate: function (req, res, callback) {

        var current_date = req.body.date;
        current_date = moment(current_date).format('MM-DD-YYYY');
        console.log(current_date);
        req.body.date = current_date;
        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var schoolId = req.body.schoolId;
                var query = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,TIME_FORMAT(sch_att_empatt.time_in, "%h:%i %p") as time_in_formmated,sch_att_empexcuse.Start_Date as excuse_date , emp_vacation.Start_Date as vacation_date_start ,emp_vacation.End_Date as vacation_date_end from sch_str_employees ' +
                    'left join sch_att_empatt on (sch_str_employees.id = sch_att_empatt.employee_id and sch_att_empatt.Calender_id = ?)left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id left join (SELECT s1.* FROM sch_att_empvacation as s1 LEFT JOIN sch_att_empvacation AS s2 ON s1.Emp_id = s2.Emp_id AND s1.Start_Date < s2.Start_Date WHERE s2.Emp_id IS NULL) as emp_vacation on emp_vacation.Emp_id = sch_str_employees.id where sch_str_employees.school_id = ?  group by main_employee_id order by sch_str_employees.name ASC', [calendarId, schoolId], function (err, result) {
                        console.log(query.sql);
                        if (err)
                            throw err
                        callback(result);
                    }
                );
            } else {
                callback(response);
            }
        });

    },

    getAllEmployeesNotAttendance: function (req, res, callback) {
        var schoolId = req.body.schoolId;
        var calenderId = req.body.calenderId;
        con.query('SELECT id FROM sch_str_employees where school_id = ? and id not in (select employee_id from sch_att_empatt where school_id = ? and Calender_id = ? )', [schoolId, schoolId, calenderId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );

    },

    getClosingButton: function (req, res, callback) {

        var current_date = moment(req.body.date).format('MM-DD-YYYY');
        // var current_date = '03-18-2018';

        var schoolId = req.body.schoolId;
        req.body.date = current_date;
        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var query = con.query('select * from closing_att_buttons where calendarId = ? and schoolId = ?', [calendarId, schoolId], function (err, result) {
                    if (err)
                        throw err;
                    console.log('close button');
                    console.log(query.sql);
                    console.log(result);
                    callback(result);
                });
            } else {
                callback([]);
            }
        });


    },
    saveClosingStatus: function (req, res, callback) {
        var closingObj = req.body.closingObj;
        var response = {};
        var closing_type = req.body.closing_type;


        con.query('select * from closing_att_buttons where calendarId = ? and schoolId = ?', [closingObj.calendarId, closingObj.schoolId], function (err, result) {
            if (err)
                throw err;

            if (Object.keys(result).length) {
                if (closing_type == 1) {
                    closingObj.second_att_closing_time = result[0].second_att_closing_time;
                    closingObj.second_att_closing = result[0].second_att_closing;
                } else if (closing_type == 2) {
                    closingObj.first_att_closing_time = result[0].first_att_closing_time;
                    closingObj.first_att_closing = result[0].first_att_closing;
                }

                var query = con.query('update closing_att_buttons set first_att_closing_time = ?, first_att_closing = ?, second_att_closing_time=?,second_att_closing=?, calendarId =?,schoolId = ?  where calendarId =? and schoolId = ?',
                    [
                        closingObj.first_att_closing_time,
                        closingObj.first_att_closing,
                        closingObj.second_att_closing_time,
                        closingObj.second_att_closing,
                        closingObj.calendarId,
                        closingObj.schoolId,
                        closingObj.calendarId,
                        closingObj.schoolId,

                    ], function (err, result) {

                        console.log(query.sql);
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            response.msg = 'تم اغلاق الدوام بنجاح';
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


                var query = con.query('insert into closing_att_buttons set ? ',
                    [closingObj], function (err, result) {
                        console.log(query.sql);
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            response.msg = 'تم اغلاق الدوام بنجاح'
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

    closeSecondAttendance: function (req, res, callback) {
        var schoolId = req.body.schoolId;
        var closing_type = req.body.closing_type;
        var current_date = moment(req.body.date).format('MM-DD-YYYY');
        req.body.date = current_date;
        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                req.body.calenderId = calendarObj.Id;
                req.body.schoolId = schoolId;

                var closingObj = {};
                //closingObj.first_att_closing_time = moment().format('MM-DD-YYYY HH:mm');
                //closingObj.first_att_closing = 1;
                closingObj.second_att_closing_time = moment(current_date).format('MM-DD-YYYY HH:mm') + ' ' + moment().format('HH:mm');
                closingObj.second_att_closing = 1;
                closingObj.calendarId = calendarObj.Id;
                closingObj.schoolId = schoolId;
                req.body.closingObj = closingObj;
                req.body.closing_type = closing_type;

                employeesAttendanceMethods.saveClosingStatus(req, res, function (result) {
                    if (result.success) {
                        response.success = true;
                        response.msg = 'تم اغلاق الدوام بنجاح';
                        callback(response);
                    } else {
                        response.success = false;
                        response.msg = 'خطأ الرجاء المحاوله مره اخرى';
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


    closeFirstAttendance: function (req, res, callback) {
        var schoolId = req.body.schoolId;
        var closing_type = req.body.closing_type;
        var current_date = moment(req.body.date).format('MM-DD-YYYY');
        req.body.date = current_date;
        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                req.body.calenderId = calendarObj.Id;
                req.body.schoolId = schoolId;
                var closingObj = {};
                closingObj.first_att_closing_time = moment(current_date).format('MM-DD-YYYY HH:mm') + ' ' + moment().format('HH:mm');
                closingObj.first_att_closing = 1;
                //closingObj.second_att_closing_time = moment().format('MM-DD-YYYY HH:mm'),
                //closingObj.second_att_closing = 1;
                closingObj.calendarId = calendarObj.Id;
                closingObj.schoolId = schoolId;
                req.body.closingObj = closingObj;
                req.body.closing_type = closing_type;
                employeesAttendanceMethods.saveClosingStatus(req, res, function (result) {
                    // callback(result);
                });
                employeesAttendanceMethods.getAllEmployeesNotAttendance(req, res, function (employees) {
                    if (Object.keys(employees).length) {
                        req.body.event_name = 'طابور';
                        req.body.schoolId = schoolId;
                        req.body.day = calendarObj.Day;
                        workingSettingsMethods.getEventByName(req, res, function (result) {
                            if (Object.keys(result).length) {
                                employees.forEach(function (row) {
                                    var attendanceObj = {};
                                    attendanceObj.employee_id = row.id;
                                    attendanceObj.Calender_id = calendarObj.Id;
                                    attendanceObj.school_id = schoolId;
                                    attendanceObj.Event_Name = 'طابور';
                                    attendanceObj.Event_type_id = result[0].Id;
                                    attendanceObj.is_absent = 1;
                                    req.body.attendanceObj = attendanceObj;
                                    employeesAttendanceMethods.addEmployeeAttendance(req, res, function (result) {
                                        // callback(result);
                                    });


                                });
                                response.success = true;
                                response.msg = 'تم اغلاق الدوام بنجاح';
                                callback(response);
                            } else {
                                response.success = false;
                                response.msg = 'الفعاليه غير موجوده';
                                callback(response);
                            }
                        });

                    } else {
                        response.success = true;
                        response.msg = 'تم اغلاق الدوام بنجاح';
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

    setEmployeeAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        req.params.SchoolId = attendanceObj.school_id;
        var response = {};
        // attendanceObj.late_min = '';

        var current_date = moment(attendanceObj.attendance_day).format('MM-DD-YYYY');
        //var current_date = '03-18-2018';

        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {

            if (Object.keys(result).length) {
                var calendarObj = result[0];
                attendanceObj.Calender_id = calendarObj.Id;


                workingSettingsMethods.getActiveAttSchedule(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var schoolProfile = result[0];
                        req.body.Day = calendarObj.Day;
                        req.body.eventtype = 'طابور';
                        req.body.eventname = 'طابور';
                        req.body.SCHEDULE_Id = schoolProfile.Id;
                        attScheduleMethods.getAttScheduleByEventNameAndDay(req, res, function (result) {
                            console.log('result ', result);
                            if (Object.keys(result).length) {
                                attendanceObj.Event_type_id = result[0].Id;
                                if (!( attendanceObj.late_min)) {
                                    if (attendanceObj.is_absent == 0) {
                                        var queue_Begining_time = moment(schoolProfile.queue_Begining, "h:mm A", 'HH:mm').format('HH:mm');
                                        //var current_time = moment().format('HH:mm');
                                        var current_time = moment(attendanceObj.time_in, "h:mm A", "HH:mm").format('HH:mm');
                                        attendanceObj.time_in = current_time;
                                        console.log('attendanceObj : ', attendanceObj);
                                        var ms = moment(current_time, "h:mm A", "HH:mm").diff(moment(queue_Begining_time, "HH:mm"));
                                        console.log('ms');
                                        console.log(ms);
                                        if (ms <= 0) {
                                           // ms = moment(current_time, "h:mm A", "HH:mm").diff(moment(queue_Begining_time, "HH:mm"));
                                            attendanceObj.late_min = 0;
                                        }else{
                                            var d = moment.duration(ms);
                                            var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                                            attendanceObj.late_min = hours;
                                        }


                                        //employeesAttendanceMethods.checkEmployeeVacation(attendanceObj);
                                    }
                                }

                                req.body.attendanceObj = attendanceObj;
                                employeesAttendanceMethods.addEmployeeAttendance(req, res, function (result) {
                                    if (result.success && (attendanceObj.is_absent == 1)) {
                                        var currentTime = moment().format('HH:mm');
                                        var Start_Date = moment(attendanceObj.attendance_day, "MM-DD-YYYY").format('MM-DD-YYYY');
                                        var End_Date = moment(attendanceObj.attendance_day, "MM-DD-YYYY").add(1, 'days').format("MM-DD-YYYY");
                                        // End_Date = End_Date.format('MM-DD-YYYY');

                                        var AbsentObj = {};
                                        AbsentObj.school_id = attendanceObj.school_id;
                                        AbsentObj.Emp_id = attendanceObj.employee_id;
                                        AbsentObj.Start_Date = Start_Date;
                                        AbsentObj.End_Date = End_Date;
                                        AbsentObj.No_Of_Days = 1;
                                        console.log(AbsentObj);
                                        req.body.AbsentObj = AbsentObj;
                                        req.body.fromAttendance = 1;
                                        employeesVacationMethods.sendAbsentRequest(req, res, function (result) {
                                        });
                                    }
                                    result.late_min = attendanceObj.late_min;
                                    callback(result);
                                });
                            } else {
                                response.success = false;
                                response.msg = 'لا يوجد فعاليه';
                                callback(response);
                            }
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

        if(attendanceObj.is_absent == 1){
            attendanceObj.time_in = '';
        }

        con.query('select * from sch_att_empatt where Calender_id = ? and employee_id = ? and Event_Name = ?',[attendanceObj.Calender_id,attendanceObj.employee_id,attendanceObj.Event_Name], function (err, result1) {
            if(err)
                throw err;

            if (Object.keys(result1).length) {
                if(attendanceObj.is_absent == 0) {
                    var ms = 0;
                    var total_min = result1[0].Total_min;
                    if (!total_min) {
                        total_min = '00:00';
                    }

                    var total_min = moment(total_min, 'HH:mm').format('HH:mm');
                    var lateTimeAsSeconds = moment.duration(attendanceObj.late_min).asSeconds();
                    ms = moment(total_min, "HH:mm").add(lateTimeAsSeconds, 'seconds');

                    var d = moment.duration(ms);
                    var total_min = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                    attendanceObj.Total_min = total_min;
                }

                var query = con.query('update sch_att_empatt set Total_min = ? ,on_vacation = ?, school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ?,Event_type_id = ? where Calender_id = ? and employee_id = ? and Event_Name=?',
                    [
                        attendanceObj.Total_min,
                        attendanceObj.on_vacation,
                        attendanceObj.school_id,
                        attendanceObj.Event_Name ,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent ,
                        attendanceObj.Event_type_id ,
                        attendanceObj.Calender_id,
                        attendanceObj.employee_id,
                        attendanceObj.Event_Name,
                    ], function (err, result) {

                        console.log(query.sql);
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            if (attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if (attendanceObj.is_absent == 1)
                                response.msg = 'تم تسجيل الغياب بنجاح';
                            if (attendanceObj.is_absent == 2)
                                response.msg = 'تم تسجيل خروج مبكر بنجاح';

                            response.id = result1[0].id;
                            callback(response);
                        } else {
                            response.success = false;
                            response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            callback(response);
                        }

                    }
                );

            }else{

                var total_min = attendanceObj.late_min;
                attendanceObj.Total_min = total_min;
                con.query('insert into sch_att_empatt (entered_by,Total_min,on_vacation,Calender_id,school_id,employee_id,Event_Name,Event_type_id,time_in,late_min,is_absent) values (?,?,?,?,?,?,?,?,?,?,?) ',
                    [   attendanceObj.entered_by,
                       attendanceObj.Total_min,
                        attendanceObj.on_vacation,
                        attendanceObj.Calender_id,
                        attendanceObj.school_id,
                        attendanceObj.employee_id,
                        attendanceObj.Event_Name ,
                        attendanceObj.Event_type_id ,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent ,
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


        var current_date = moment(attendanceObj.Attendance_Day).format('MM-DD-YYYY');
        req.body.date = current_date;

        //req.body.date = '03-18-2018';
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                attendanceObj.Calender_id = calendarObj.Id;

                workingSettingsMethods.getActiveAttSchedule(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var schoolProfile = result[0];
                        req.body.Day = calendarObj.Day;
                        req.body.eventname = attendanceObj.Event_Name;
                        req.body.SCHEDULE_Id = schoolProfile.Id;
                        attScheduleMethods.getAttScheduleByEventNameAndDay(req, res, function (result) {

                            if (Object.keys(result).length) {
                                attendanceObj.Event_type_id = result[0].Id;
                                 if(attendanceObj.is_absent == 2){
                                    var ending_time = moment(attendanceObj.Ending_Time,"h:mm A", 'HH:mm').format('HH:mm');
                                    //var current_time = moment().format('HH:mm');
                                    var current_time = attendanceObj.time_out;
                                    var current_time = moment(current_time,"h:mm A", 'HH:mm').format('HH:mm');
                                     attendanceObj.time_out = current_time;

                                    //attendanceObj.time_in = current_time;
                                     console.log('ending_time');
                                     console.log(ending_time);
                                     console.log('current_time');
                                     console.log(current_time);

                                    var ms = moment(ending_time, "HH:mm").diff(moment(current_time, "HH:mm"));

                                    if (ms <= 0) {
                                        // ms = moment(current_time, "HH:mm").diff(moment(begining_time, "HH:mm"));
                                        attendanceObj.short_min = '';
                                    }else{
                                        var d = moment.duration(ms);
                                        var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                                        attendanceObj.short_min = hours;
                                    }
                                }else{
                                     var begining_time = moment(attendanceObj.Begining_Time, "h:mm A", 'HH:mm').format('HH:mm');
                                     console.log(begining_time)
                                     //var current_time = moment().format('HH:mm');
                                     var current_time = attendanceObj.time_in;
                                     attendanceObj.time_in = moment(current_time,"h:mm A", "HH:mm").format('HH:mm');

                                     var ms = moment(attendanceObj.time_in, "HH:mm").diff(moment(begining_time, "HH:mm"));
                                     console.log(ms);
                                     console.log('ms');
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
                                console.log(attendanceObj);
                                employeesAttendanceMethods.addEmployeeActivityAttendance(req, res, function (result) {
                                    callback(result);
                                });
                            } else {
                                response.success = false;
                                response.msg = 'لا يوجد فعاليه';
                                callback(response);
                            }
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


    addEmployeeActivityAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        var response = {};



        console.log('attendanceObj in total');
        console.log(attendanceObj);
        if(attendanceObj.is_absent == 1){
            attendanceObj.time_in = '';
            attendanceObj.time_out = '';
            attendanceObj.short_min = '';
        }

        console.log('attendanceObj in total222');
        console.log(attendanceObj);

        sequelizeConfig.employeeAttandaceTable.find({where: {Calender_id: attendanceObj.Calender_id,employee_id:attendanceObj.employee_id,Event_Name:attendanceObj.Event_Name}}).then(function (attendance) {
            console.log(attendance);
            if (attendance) {
                delete attendanceObj.entery_date;
                delete attendanceObj.entered_by;
                var ms = 0;
                var total_min = '00:00';


                if(attendanceObj.is_absent == 2){
                    var late_min = '00:00';
                    attendanceObj.is_absent = 0;
                    if(attendance.late_min)
                        late_min = attendance.late_min;
                    var shortTimeAsSeconds = moment.duration(attendanceObj.short_min).asSeconds();
                    ms = moment(late_min, "HH:mm").add(shortTimeAsSeconds,'seconds');
                }else if(attendanceObj.is_absent == 0){
                    var short_min = '00:00';
                    if(attendance.short_min)
                        short_min = attendance.short_min;
                    var lateTimeAsSeconds = moment.duration(attendanceObj.late_min).asSeconds();
                    ms = moment(short_min, "HH:mm").add(lateTimeAsSeconds,'seconds');
                }
                console.log('lateTimeAsSeconds');
                console.log(lateTimeAsSeconds);
                console.log(ms);
                var d = moment.duration(ms);
                 total_min = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                console.log(total_min);
                if(attendanceObj.is_absent == 1){
                    total_min = attendanceObj.late_min;
                }
                attendanceObj.Total_min = total_min;
                attendance.updateAttributes(attendanceObj).then(function () {
                    response.success = true;
                    if (attendanceObj.is_absent == 0)
                        response.msg = 'تم تسجيل الحضور بنجاح';
                    if (attendanceObj.is_absent == 1)
                        response.msg = 'تم تسجيل الغياب بنجاح';
                    if (attendanceObj.is_absent == 2)
                        response.msg = 'تم تسجيل خروج مبكر بنجاح';
                    response.insertId = attendanceObj.id;
                    callback(response);
                })
            } else {
                var total_min = '';

                if(attendanceObj.is_absent == 2){
                    total_min = attendanceObj.short_min;
                    attendanceObj.is_absent = 0;
                }else{
                    total_min = attendanceObj.late_min;
                }
                attendanceObj.Total_min = total_min;
                console.log(attendanceObj);
                sequelizeConfig.employeeAttandaceTable.create(attendanceObj).then(attendance => {
                    response.success = true;
                    response.insertId = attendance.id;
                    if (attendanceObj.is_absent == 0)
                        response.msg = 'تم تسجيل الحضور بنجاح';
                    if (attendanceObj.is_absent == 1)
                        response.msg = 'تم تسجيل الغياب بنجاح';
                    if (attendanceObj.is_absent == 2)
                        response.msg = 'تم تسجيل خروج مبكر بنجاح';
                    callback(response);
                });

            }
        });


    },

    checkEmployeeVacation: function (attendanceData) {
        console.log("attendanceData : ", attendanceData);
        let employee_id = attendanceData.employee_id;
        var current_date = attendanceData.attendance_day;
        employeesVacationMethods.getLastEmployeeVaction(employee_id, function (response) {
            console.log("response : ", response);
            attendanceData.absentData = response[0];
            var vacationEndDate = moment(response[0].End_Date).format("MM/DD/YYYY");
            // var VacationEndDateplus = moment(VacationEndDate, "MM-DD-YYYY").add(1, 'day').format("MM-DD-YYYY");
            console.log('current_date : ', current_date);
            console.log('VacationEndDate : ', vacationEndDate);
            // console.log('VacationEndDateplus : ',VacationEndDateplus);

            if (current_date === vacationEndDate) {
                attendanceData.actionType = 'مساءله غياب';
                console.log("attendanceData : ", attendanceData);
                takenActionsMethods.sendActionToEmp(attendanceData);
            }
        });
    },


};

module.exports = employeesAttendanceMethods;