var con = require('../routes/dbConfig.js');
var moment = require('moment');
var workingSettingsMethods = require('../model/schedualProfile.js');
var appSettingsMethods = require('../model/appSettings.js');
var attScheduleMethods = require('../model/sch_att_schedule.js');
var employeesVacationMethods = require('../model/employeeVacation.js');

var employeesAttendanceMethods = {




    getAllEmployeesAttendanceByActivity: function (req, res, callback) {

        var current_date = moment().format('MM-DD-YYYY');
        req.body.date = current_date;
        req.body.date = '03-18-2018';
        var lecture_name = req.body.lecture_name;
        var breaks = [  'طابور','صلاه', 'فسحه (1)' ,'فسحه (2)'];
        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var schoolId = req.body.schoolId;
                var currentDay = workingSettingsMethods.getArabicDay(new Date().getDay());
                currentDay = 'الاحد';
                var currentDay1 = currentDay;
                if(currentDay ==  'الاحد'){
                    currentDay1 = 'الأحد';
                }
                if(currentDay ==  'الاثنين'){
                    currentDay1 = 'الأثنين';
                }
                if(currentDay ==  'الاربعاء'){
                    currentDay1 = 'الأربعاء';
                }

                if(breaks.indexOf(lecture_name)  > -1){
                    var query  = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,sch_att_empexcuse.Start_Date as excuse_date,sch_att_empvacation.Start_Date as vacation_date from sch_str_employees  left join sch_att_empatt  on (sch_str_employees.id = sch_att_empatt.employee_id and sch_att_empatt.Event_Name = ?) left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id left join sch_att_empvacation on sch_att_empvacation.Emp_id = sch_str_employees.id where (sch_att_empatt.Event_Name = ? or sch_att_empatt.Event_Name IS NULL ) and sch_str_employees.school_id = ? and (sch_att_empatt.Calender_id = ? or sch_att_empatt.Calender_id IS NULL) order by main_employee_id asc', [lecture_name,lecture_name,schoolId,calendarId], function (err, result) {
                            console.log(query.sql);
                            if (err)
                                throw err
                            callback(result);
                        }
                    );
                }else{
                    var query  = con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,sch_att_empexcuse.Start_Date as excuse_date,sch_att_empvacation.Start_Date as vacation_date from sch_str_employees join sch_acd_lecturestables '+
                        'on sch_acd_lecturestables.Teacher_Id = sch_str_employees.id '+
                        'join sch_acd_lectures on sch_acd_lecturestables.Lecture_NO = sch_acd_lectures.id '+
                        ' left join sch_att_empatt '+
                        ' on (sch_str_employees.id = sch_att_empatt.employee_id and sch_acd_lectures.name = sch_att_empatt.Event_Name)'+
                        'left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id '+
                        'left join sch_att_empvacation on sch_att_empvacation.Emp_id = sch_str_employees.id '+
                        'where sch_acd_lectures.name = ? and (sch_acd_lecturestables.Day = ? OR sch_acd_lecturestables.Day = ?) and sch_str_employees.school_id = ? and (sch_att_empatt.Calender_id = ? or sch_att_empatt.Calender_id IS NULL)', [lecture_name,currentDay,currentDay1,schoolId,calendarId], function (err, result) {
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
        req.body.date = '03-18-2018';
        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var schoolId = req.params.schoolId;
                con.query('select sch_str_employees.id as main_employee_id,sch_str_employees.name ,sch_att_empatt.*,sch_att_empexcuse.Start_Date as excuse_date,sch_att_empvacation.Start_Date as vacation_date from sch_str_employees left join sch_att_empatt '+
                    'on sch_str_employees.id = sch_att_empatt.employee_id '+
                    'left join sch_att_empexcuse on sch_str_employees.id = sch_att_empexcuse.Emp_id '+
                    'left join sch_att_empvacation on sch_att_empvacation.Emp_id = sch_str_employees.id '+
                    'where sch_str_employees.school_id = ? and (sch_att_empatt.Calender_id = ? or sch_att_empatt.Calender_id IS NULL)', [schoolId,calendarId], function (err, result) {
                        if (err)
                            throw err
                        callback(result);
                    }
                );
            }else{
                callback(response);
            }
        });

    },

    getAllEmployeesNotAttendance:function(req,res,callback){
      var schoolId = req.body.schoolId;
      var calenderId = req.body.calenderId;
        con.query('SELECT id FROM sch_str_employees where school_id = ? and id not in (select employee_id from sch_att_empatt where school_id = ? and Calender_id = ? )', [schoolId,schoolId,calenderId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );

    },

    getClosingButton : function(req,res,callback){

        //var current_date = moment().format('MM-DD-YYYY');
        var current_date = '03-18-2018';

        var schoolId = req.body.schoolId;
        req.body.date = current_date;
        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var query = con.query('select * from closing_att_buttons where calendarId = ? and schoolId = ?',[calendarId,schoolId], function (err, result) {
                    if (err)
                        throw err;
                    console.log('close button');
                    console.log(query.sql);
                    console.log(result);
                    callback(result);
                });
            }else{
                callback([]);
            }
        });


    },
    saveClosingStatus :function(req,res,callback){
        var closingObj = req.body.closingObj;
        var response = {};
        var closing_type = req.body.closing_type;


        con.query('select * from closing_att_buttons where calendarId = ? and schoolId = ?',[closingObj.calendarId,closingObj.schoolId], function (err, result) {
           if(err)
            throw err;

            if (Object.keys(result).length) {
                if(closing_type == 1){
                    closingObj.second_att_closing_time = result[0].second_att_closing_time;
                    closingObj.second_att_closing = result[0].second_att_closing;
                }else if(closing_type == 2) {
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

    closeSecondAttendance:function(req,res,callback){
        var schoolId = req.body.schoolId;
        var closing_type = req.body.closing_type;
        var current_date = moment().format('MM-DD-YYYY');
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
                closingObj.second_att_closing_time = moment().format('MM-DD-YYYY HH:mm'),
                closingObj.second_att_closing = 1;
                closingObj.calendarId = calendarObj.Id;
                closingObj.schoolId = schoolId;
                req.body.closingObj = closingObj;
                req.body.closing_type = closing_type;

                employeesAttendanceMethods.saveClosingStatus(req,res,function(result){
                   if(result.success){
                       response.success = true;
                       response.msg = 'تم اغلاق الدوام بنجاح';
                       callback(response);
                   }else{
                       response.success = false;
                       response.msg = 'خطأ الرجاء المحاوله مره اخرى';
                       callback(response);
                   }
                });

            }else{
                response.success = false;
                response.msg = 'اليوم ليس موجود';
                callback(response);

            }
        });

    },


    closeFirstAttendance:function(req,res,callback){
        var schoolId = req.body.schoolId;
        var closing_type = req.body.closing_type;
        var current_date = moment().format('MM-DD-YYYY');
        req.body.date = current_date;
        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                req.body.calenderId = calendarObj.Id;
                req.body.schoolId = schoolId;
                var closingObj = {};
                closingObj.first_att_closing_time = moment().format('MM-DD-YYYY HH:mm');
                closingObj.first_att_closing = 1;
                //closingObj.second_att_closing_time = moment().format('MM-DD-YYYY HH:mm'),
                //closingObj.second_att_closing = 1;
                closingObj.calendarId = calendarObj.Id;
                closingObj.schoolId = schoolId;
                req.body.closingObj = closingObj;
                req.body.closing_type = closing_type;
                employeesAttendanceMethods.saveClosingStatus(req,res,function(result){
                    // callback(result);
                });
                employeesAttendanceMethods.getAllEmployeesNotAttendance(req,res,function(employees){
                    if (Object.keys(employees).length) {
                        req.body.event_name = 'طابور';
                        req.body.schoolId = schoolId;
                        req.body.day = calendarObj.Day;
                        workingSettingsMethods.getEventByName(req,res,function(result){
                            if (Object.keys(result).length) {
                                employees.forEach(function(row){
                                    var attendanceObj = {};
                                    attendanceObj.employee_id = row.id;
                                    attendanceObj.Calender_id = calendarObj.Id;
                                    attendanceObj.school_id = schoolId;
                                    attendanceObj.Event_Name = 'طابور';
                                    attendanceObj.Event_type_id = result[0].Id;
                                    attendanceObj.is_absent = 1;
                                    req.body.attendanceObj = attendanceObj;
                                    employeesAttendanceMethods.addEmployeeAttendance(req,res,function(result){
                                        // callback(result);
                                    });




                                });
                                response.success = true;
                                response.msg = 'تم اغلاق الدوام بنجاح';
                                callback(response);
                            }else{
                                response.success = false;
                                response.msg = 'الفعاليه غير موجوده';
                                callback(response);
                            }
                        });

                    }else{
                        response.success = true;
                        response.msg = 'تم اغلاق الدوام بنجاح';
                        callback(response);
                    }
                });
            }else{
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
        attendanceObj.late_min = '';

            var current_date = moment().format('MM-DD-YYYY');
            var current_date = '03-18-2018';

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
                            attScheduleMethods.getAttScheduleByEventNameAndDay(req,res,function(result){
                                console.log(result);
                                if (Object.keys(result).length) {
                                    attendanceObj.Event_type_id = result[0].Id;
                                    if(attendanceObj.is_absent == 0) {
                                        var queue_Begining_time = moment(schoolProfile.queue_Begining, 'HH:mm').format('HH:mm');
                                        //var current_time = moment().format('HH:mm');
                                        var current_time = attendanceObj.time_in;
                                        attendanceObj.time_in = current_time;

                                        var ms = moment(current_time, "HH:mm").diff(moment(queue_Begining_time, "HH:mm"));
                                       console.log('ms');
                                       console.log(ms);
                                        if (ms <= 0) {
                                            ms = moment(current_time, "HH:mm").diff(moment(queue_Begining_time, "HH:mm"));
                                        }

                                        var d = moment.duration(ms);
                                        var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                                        attendanceObj.late_min = hours;
                                    }

                                    req.body.attendanceObj = attendanceObj;
                                    employeesAttendanceMethods.addEmployeeAttendance(req,res,function(result){
                                        if(result.success){
                                            var currentTime = moment().format('HH:mm');
                                            var Start_Date = moment().format('MM-DD-YYYY');
                                            var End_Date = moment().add(1, 'days');
                                            End_Date = End_Date.format('MM-DD-YYYY');

                                            var AbsentObj = {};
                                            AbsentObj.school_id = attendanceObj.school_id;
                                            AbsentObj.Emp_id = attendanceObj.employee_id;
                                            AbsentObj.Start_Date = Start_Date;
                                            AbsentObj.End_Date = End_Date;
                                            AbsentObj.No_Of_Days = 1;
                                            console.log(AbsentObj);
                                            req.body.AbsentObj = AbsentObj;
                                            employeesVacationMethods.sendAbsentRequest(req,res,function(result){});
                                        }
                                        callback(result);
                                    });
                                }else{
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



                }else{
                    response.success = false;
                    response.msg = 'اليوم ليس موجود';
                    callback(response);

                }

            });




    },

    addEmployeeAttendance :function(req,res,callback){
      var attendanceObj = req.body.attendanceObj;
        var response = {};

        con.query('select * from sch_att_empatt where Calender_id = ? and employee_id = ? and Event_Name = ?',[attendanceObj.Calender_id,attendanceObj.employee_id,attendanceObj.Event_Name], function (err, result) {
            if(err)
                throw err;

            if (Object.keys(result).length) {

                var query = con.query('update sch_att_empatt set on_vacation = ?, school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ?,Event_type_id = ? where Calender_id = ? and employee_id = ? and Event_Name=?',
                    [
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
                            response.id = result.insertId;
                            callback(response);
                        } else {
                            response.success = false;
                            response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            callback(response);
                        }

                    }
                );

            }else{
                con.query('insert into sch_att_empatt (on_vacation,Calender_id,school_id,employee_id,Event_Name,Event_type_id,time_in,late_min,is_absent) values (?,?,?,?,?,?,?,?,?) ',
                    [   attendanceObj.on_vacation,
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
                            if(attendanceObj.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if(attendanceObj.is_absent == 1)
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
        //req.body.date = current_date;
        req.body.date = '03-18-2018';
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
                            console.log(result);
                            if (Object.keys(result).length) {
                                attendanceObj.Event_type_id = result[0].Id;
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
                    }else{
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
        console.log('eventtype');
        console.log(attendanceObj.Event_type_id);
        var response = {};

        con.query('select * from sch_att_empatt where Calender_id = ? and employee_id = ? and Event_Name = ?', [attendanceObj.Calender_id, attendanceObj.employee_id , attendanceObj.Event_Name], function (err, result) {
            if (err)
                throw err;

            if (Object.keys(result).length) {

                con.query('update sch_att_empatt set  school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ?, Event_type_id = ? where Calender_id = ? and employee_id = ? ',
                    [
                        attendanceObj.school_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                        attendanceObj.Event_type_id,
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
                con.query('insert into sch_att_empatt (Calender_id,school_id,employee_id,Event_Name,time_in,late_min,is_absent,Event_type_id) values (?,?,?,?,?,?,?,?) ',
                    [attendanceObj.Calender_id,
                        attendanceObj.school_id,
                        attendanceObj.employee_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                        attendanceObj.Event_type_id,
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