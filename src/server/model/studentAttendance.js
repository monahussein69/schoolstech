var con = require('../routes/dbConfig.js');
var moment = require('moment');
var workingSettingsMethods = require('../model/schedualProfile.js');
var appSettingsMethods = require('../model/appSettings.js');
var attScheduleMethods = require('../model/sch_att_schedule.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


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
                    condition = 'and sch_att_stdatt.is_absent = 0 and (sch_att_stdatt.late_min != "" OR sch_att_stdatt.late_min != 0)';
                }else if(status == 'غائب'){
                    condition = 'and sch_att_stdatt.is_absent = 1';
                }



                if(breaks.indexOf(lecture_name)  > -1){

                    var query  = con.query('SELECT sch_att_stdexcuse.Start_Date as excuse_date, sch_str_student.student_id as main_student_id , sch_str_student.Name as student_name , sch_att_stdatt.* FROM `sch_str_student` ' +
                        ' left join sch_att_stdatt on ' +
                        '(sch_str_student.student_id = sch_att_stdatt.Student_id and  sch_att_stdatt.Event_Name = ? and (sch_att_stdatt.Calender_id = ? ) ) ' +
                        'left join sch_att_stdexcuse on sch_att_stdexcuse.Student_id = sch_str_student.student_id '+
                        ' where sch_acd_lecturestables.School_Id = ?  ' + condition + ' '+
                        '  group by sch_str_student.student_id order by sch_str_student.name asc', [lecture_name,calendarId,schoolId], function (err, result) {
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
                        '  group by sch_str_student.student_id order by sch_str_student.name asc', [calendarId,schoolId,currentDay,currentDay1,teacherId,lecture_name], function (err, result) {
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
        //attendanceObj.late_min = '';
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

                                if(attendanceObj.is_absent == 2){
                                    var ending_time = moment(attendanceObj.Ending_Time,"h:mm A", 'HH:mm').format('HH:mm');
                                    //var current_time = moment().format('HH:mm');
                                    var current_time = attendanceObj.time_out;
                                    var current_time = moment(current_time,"h:mm A", 'HH:mm').format('HH:mm');
                                    attendanceObj.time_out = current_time;

                                    //attendanceObj.time_in = current_time;
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

                                //if (attendanceObj.is_absent == 0) {

                                //}

                                //attendanceObj.Total_min = attendanceObj.late_min;
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

        sequelizeConfig.studentAttandaceTable.find({where: {Calender_id: attendanceObj.Calender_id,Student_id:attendanceObj.Student_id,Event_Name:attendanceObj.Event_Name}}).then(function (attendance) {
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
                var d = moment.duration(ms);
                total_min = Math.floor(d.hours()) + moment.utc(ms).format(":mm");
                if(attendanceObj.is_absent == 1){
                    total_min = attendanceObj.late_min;
                    attendanceObj.time_in = '';
                    attendanceObj.time_out = '';
                    attendanceObj.short_min = '';

                }
                attendanceObj.Total_min = total_min;
                attendance.updateAttributes(attendanceObj).then(function () {
                    response.success = true;
                    if (attendanceObj.is_absent == 0)
                        response.msg = 'تم تسجيل الحضور بنجاح';
                    if (attendanceObj.is_absent == 1)
                        response.msg = 'تم تسجيل الغياب بنجاح';
                        response.id = attendanceObj.insertId;
                        callback(response);
                    });
            }else{
                var total_min = '';
                if(attendanceObj.is_absent == 2){
                    total_min = attendanceObj.short_min;
                    attendanceObj.is_absent = 0;
                }else{
                    total_min = attendanceObj.late_min;
                }
                attendanceObj.Total_min = total_min;

                sequelizeConfig.studentAttandaceTable.create(attendanceObj).then(attendance => {
                            response.success = true;
                            if (attendance.is_absent == 0)
                                response.msg = 'تم تسجيل الحضور بنجاح';
                            if (attendance.is_absent == 1)
                                response.msg = 'تم تسجيل الغياب بنجاح';

                            response.id = attendance.insertId;
                            callback(response);
                        });
            }
        });
    },
};

module.exports = studentAttendanceMethods;