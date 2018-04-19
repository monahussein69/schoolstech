var con = require('../routes/dbConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');
var studentAttendanceMethods = require('../model/studentAttendance.js');


var studentExcuseMethods = {

    sendStudentExcuseRequest: function (req, res, callback) {
       // var current_date = '03-18-2018';
        var ExcuseObj = req.body.ExcuseObj;
        var Event_Name = req.body.Event_Name;
        var response = {};
        var current_date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
        req.body.date = current_date;
		console.log(ExcuseObj);
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                ExcuseObj.Calender_id = calendarObj.Id;
                con.query('insert into sch_att_stdexcuse set ?',
                    [ExcuseObj], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            response.msg = 'تم تقديم الطلب بنجاح';
                            response.id = result.insertId;
                            req.body.attendanceObj = {
                                Calender_id:calendarObj.Id,
                                School_id:ExcuseObj.School_id,
                                Student_id:ExcuseObj.Student_id,
                                is_excused:1,
                                Event_Name:Event_Name
                            };
                            studentAttendanceMethods.addStudentAttendance(req,res,function(){});
                            callback(response);
                        } else {
                            response.success = false;
                            response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            callback(response);
                        }

                    }
                );
            }else{
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }

        });

    },
}

module.exports = studentExcuseMethods;