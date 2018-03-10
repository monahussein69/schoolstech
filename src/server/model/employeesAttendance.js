var con = require('../routes/dbConfig.js');
var moment = require('moment');

var employeesAttendanceMethods = {

    getAllEmployeesAttendance: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select sch_att_empatt.*,sch_str_employees.name from sch_att_empatt right join sch_str_employees on sch_att_empatt.school_id = sch_str_employees.school_id where sch_str_employees.school_id = ? ', [schoolId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


    setEmployeeAttendance: function (req, res, callback) {
        var attendanceObj = req.body.attendanceObj;
        getActiveAttSchedule(req,res,function (result){

        })
        attendanceObj.time_in =
        con.query('select sch_att_empatt.*,sch_str_employees.name from sch_att_empatt right join sch_str_employees on sch_att_empatt.school_id = sch_str_employees.school_id where sch_str_employees.school_id = ? ', [schoolId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },


};

module.exports = employeesAttendanceMethods;