var con = require('../routes/dbConfig.js');


var employeeAttendanceRecordMethods = {

    getEmployeeLateRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        con.query('SELECT app_def_calender.Day, app_def_calender.Date, sch_att_empatt.*,sch_att_schedule.eventtype FROM `sch_att_empatt` ' +
            'join app_def_calender on app_def_calender.Id = sch_att_empatt.Calender_id ' +
            'join sch_att_schedule on sch_att_schedule.Id = sch_att_empatt.Event_type_id ' +
            'WHERE school_id = ? and employee_id = ? and (late_min <> NULL OR  late_min <> \'\')', [schoolId,employeeId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


    getEmployeeAbsentRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        con.query('SELECT app_def_calender.Day, app_def_calender.Date, sch_att_empatt.*,sch_att_schedule.eventtype FROM `sch_att_empatt` ' +
            'join app_def_calender on app_def_calender.Id = sch_att_empatt.Calender_id ' +
            'join sch_att_schedule on sch_att_schedule.Id = sch_att_empatt.Event_type_id ' +
            'WHERE school_id = ? and employee_id = ? and (late_min <> NULL OR  late_min <> \'\')', [schoolId,employeeId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


};

module.exports = employeeAttendanceRecordMethods;