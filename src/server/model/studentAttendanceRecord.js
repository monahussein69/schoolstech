var con = require('../routes/dbConfig.js');


var studentAttendanceRecordMethods = {

    getStudentLateRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var studentId = req.params.studentId;
        var query = con.query('SELECT app_def_calender.Day, app_def_calender.Date, sch_att_stdatt.*,sch_att_schedule.eventtype FROM `sch_att_stdatt` ' +
            'join app_def_calender on app_def_calender.Id = sch_att_stdatt.Calender_id ' +
            'join sch_att_schedule on sch_att_schedule.Id = sch_att_stdatt.Event_type_id ' +
            'WHERE school_id = ? and Student_id = ? and (late_min <> 0 OR  late_min <> \'\')', [schoolId,studentId], function (err, result) {
                console.log(query.sql);
                if (err)
                    throw err
                callback(result);
            }
        );
    },


    getStudentAbsentRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var studentId = req.params.studentId;
        var query = con.query('SELECT app_def_calender.Day, app_def_calender.Date, sch_att_stdatt.*,sch_att_schedule.eventtype FROM `sch_att_stdatt` ' +
            'join app_def_calender on app_def_calender.Id = sch_att_stdatt.Calender_id ' +
            'join sch_att_schedule on sch_att_schedule.Id = sch_att_stdatt.Event_type_id ' +
            'WHERE school_id = ? and Student_id = ? and is_absent = 1 ', [schoolId,studentId], function (err, result) {
            console.log(query.sql);
                if (err)
                    throw err
                callback(result);
            }
        );
    },

    getStudentExcuseRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        var query = con.query('SELECT sch_att_stdexcuse.*,start.Day as Start_Day,end.Day as End_Day FROM `sch_att_stdexcuse` '+
            ' join app_def_calender as start on start.Date = sch_att_stdexcuse.Start_Date join app_def_calender as end on end.Date = sch_att_stdexcuse.End_Date ' +
            'where School_id = ? and Student_id = ?', [schoolId,studentId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


};

module.exports = studentAttendanceRecordMethods;