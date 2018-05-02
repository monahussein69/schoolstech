var con = require('../routes/dbConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');
var studentAttendanceMethods = require('../model/studentAttendance.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var fs = require("fs");
var util = require('util');


var studentExcuseMethods = {

    sendStudentExcuseRequest: function (req, res, callback) {
       // var current_date = '03-18-2018';
        var ExcuseObj = req.body.ExcuseObj;
        var Event_Name = req.body.Event_Name;
        var response = {};
        var current_date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
        req.body.date = current_date;
        ExcuseObj.Start_Date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
        ExcuseObj.End_Date = moment(ExcuseObj.End_Date).format('MM-DD-YYYY');
		console.log(ExcuseObj);
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                ExcuseObj.Calender_id = calendarObj.Id;

                sequelizeConfig.studentExcuseTable.find({where: {id: ExcuseObj.Calender_id}}).then(function (Excuse) {
                    if (Excuse) {
                        Excuse.updateAttributes(ExcuseObj).then(function () {
                            response.success = true;
                            response.msg = 'تم تقديم الطلب بنجاح';
                            req.body.attendanceObj = {
                                Calender_id:calendarObj.Id,
                                School_id:ExcuseObj.School_id,
                                Student_id:ExcuseObj.Student_id,
                                is_excused:1,
                                Event_Name:Event_Name
                            };
                            studentAttendanceMethods.addStudentAttendance(req,res,function(){});
                            callback(response);
                        })
                    } else {

                        sequelizeConfig.studentExcuseTable.create(ExcuseObj).then(result => {
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
                        });

                    }

                });

            }else{
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }

        });

    },

    getStudentExcuseRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var studentId = req.params.studentId;
        var query = con.query('SELECT sch_att_stdexcuse.*,start.Day as Start_Day,end.Day as End_Day FROM `sch_att_stdexcuse` '+
            ' join app_def_calender as start on start.Date = sch_att_stdexcuse.Start_Date join app_def_calender as end on end.Date = sch_att_stdexcuse.End_Date ' +
            'where School_id = ? and Student_id = ?', [schoolId,studentId], function (err, result) {
                console.log(query.sql);
         try{
                if (err)
                    throw err
                callback(result);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
            }
        );
    },
}

module.exports = studentExcuseMethods;