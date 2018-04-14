var con = require('../routes/dbConfig.js');
var moment = require('moment');
var workingSettingsMethods = require('../model/schedualProfile.js');
var appSettingsMethods = require('../model/appSettings.js');
var attScheduleMethods = require('../model/sch_att_schedule.js');

var studentAttendanceMethods = {



    getAllStudentsAttendanceByActivity: function (req, res, callback) {

        var current_date = moment(req.body.date).format('MM-DD-YYYY');
        req.body.date = current_date;
        //req.body.date = '03-18-2018';
        var schoolId = req.body.schoolId;
        var teacherId = req.body.teacherId;
        var lecture_name = req.body.lecture_name;
        var status = req.body.status;
        var breaks = [  'طابور','صلاه', 'فسحه (1)' ,'فسحه (2)'];
        var response = [];
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                var currentDay = workingSettingsMethods.getArabicDay(new Date(current_date).getDay());
                //currentDay = 'الاحد';
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
                var condition = '';
                if(status == 'حاضر'){
                    condition = 'and sch_att_stdatt.is_absent = 0 and (sch_att_stdatt.late_min = "" OR sch_att_stdatt.late_min IS  NULL)';
                }else  if(status == 'متأخر'){
                    condition = 'and sch_att_stdatt.is_absent = 0 and (sch_att_stdatt.late_min != "" OR sch_att_stdatt.late_min IS NOT NULL)';
                }else if(status == 'غائب'){
                    condition = 'and sch_att_stdatt.is_absent = 1';
                }



                if(breaks.indexOf(lecture_name)  > -1){

                    var query  = con.query('SELECT sch_att_stdexcuse.Start_Date as excuse_date, sch_str_student.student_id as main_student_id , sch_str_student.Name as student_name , sch_att_stdatt.* FROM `sch_str_student` ' +
                        ' left join sch_att_stdatt on ' +
                        '(sch_str_student.student_id = sch_att_stdatt.Student_id and  sch_att_stdatt.Event_Name = ? and (sch_att_stdatt.Calender_id = ? ) ) ' +
                        'left join sch_att_stdexcuse on sch_att_stdexcuse.Student_id = sch_str_student.student_id '+
                        ' where sch_acd_lecturestables.School_Id = ?  ' + condition + ' '+
                        '  group by sch_str_student.student_id', [lecture_name,calendarId,schoolId], function (err, result) {
                            console.log(query.sql);
                            if (err)
                                throw err
                            callback(result);
                        }
                    );

                }else{
                    var query  = con.query('SELECT sch_att_stdexcuse.Start_Date as excuse_date, sch_str_student.student_id as main_student_id , sch_str_student.Name as student_name , sch_att_stdatt.* FROM `sch_str_student` ' +
                        ' join sch_acd_studentsections on sch_str_student.student_id = sch_acd_studentsections.Student_Id ' +
                        ' join sch_acd_lecturestables on ' +
                        ' (sch_acd_lecturestables.Section_Id = sch_acd_studentsections.Section_Id and sch_acd_lecturestables.Course_Id = sch_acd_studentsections.Course_Id) ' +
                        ' join sch_acd_lectures on sch_acd_lectures.id = sch_acd_lecturestables.Lecture_NO ' +
                        ' left join sch_att_stdatt on ' +
                        '(sch_str_student.student_id = sch_att_stdatt.Student_id and sch_acd_lectures.name = sch_att_stdatt.Event_Name and sch_att_stdatt.Calender_id = ? )' +
                        'left join sch_att_stdexcuse on sch_att_stdexcuse.Student_id = sch_str_student.student_id '+
                        ' where sch_acd_lecturestables.School_Id = ? and ' +
                        ' (sch_acd_lecturestables.Day = ? or sch_acd_lecturestables.Day = ?) ' +
                        ' and sch_acd_lecturestables.Teacher_Id = ? and sch_acd_lectures.name = ?  ' + condition + ' '+
                        '  group by sch_str_student.student_id', [calendarId,schoolId,currentDay,currentDay1,teacherId,lecture_name], function (err, result) {
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


    setStudentAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        req.params.SchoolId = attendanceObj.school_id;
        var response = {};
        attendanceObj.late_min = '';

        var current_date = moment(attendanceObj.attendance_day).format('MM-DD-YYYY');
        req.body.date = current_date;
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
                                attendanceObj.Begining_Time = result[0].Begining_Time;

                                if (attendanceObj.is_absent == 0) {
                                    var begining_time = moment(attendanceObj.Begining_Time, 'HH:mm').format('HH:mm');
                                    var current_time = attendanceObj.time_in;
                                    attendanceObj.time_in = current_time;
                                    var ms = moment(current_time, "HH:mm").diff(moment(begining_time, "HH:mm"));
                                    console.log('mmmmms');
                                    console.log(ms);
                                    if (ms <= 0) {
                                        attendanceObj.late_min = '';
                                    }else{
                                        var d = moment.duration(ms);
                                        var hours = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                                        attendanceObj.late_min = hours;
                                    }
                                }

                                attendanceObj.Total_min = attendanceObj.late_min;
                                req.body.attendanceObj = attendanceObj;
                                studentAttendanceMethods.addStudentAttendance(req, res, function (result) {
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
    addStudentAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        delete attendanceObj.attendance_day;
        delete attendanceObj.Begining_Time;
        var response = {};
        if(attendanceObj.is_absent == 1){
            attendanceObj.time_in = '';
        }

        con.query('select * from sch_att_stdatt where Calender_id = ? and Student_id = ? and Event_Name = ?', [attendanceObj.Calender_id, attendanceObj.Student_id , attendanceObj.Event_Name], function (err, result) {
            if (err)
                throw err;

            if (Object.keys(result).length) {

                con.query('update sch_att_stdatt set  school_id = ?, Event_Name=?,time_in=?, late_min =?,is_absent = ?, Event_type_id = ?,Total_min =? where Calender_id = ? and Student_id = ? and Event_Name = ?',
                    [
                        attendanceObj.school_id,
                        attendanceObj.Event_Name,
                        attendanceObj.time_in,
                        attendanceObj.late_min,
                        attendanceObj.is_absent,
                        attendanceObj.Event_type_id,
                        attendanceObj.Total_min,
                        attendanceObj.Calender_id,
                        attendanceObj.Student_id,
                        attendanceObj.Event_Name,
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
                con.query('insert into sch_att_stdatt set ?',
                    [attendanceObj], function (err, result) {
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


};

module.exports = studentAttendanceMethods;