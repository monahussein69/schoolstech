var con = require('../routes/dbConfig.js');
var fs = require("fs");
var util = require('util');

var employeeAttendanceRecordMethods = {

    getEmployeeLateRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        var query = con.query('SELECT app_def_calender.Day, app_def_calender.Date, sch_att_empatt.*,sch_att_schedule.eventtype FROM `sch_att_empatt` ' +
            'join app_def_calender on app_def_calender.Id = sch_att_empatt.Calender_id ' +
            'join sch_att_schedule on sch_att_schedule.Id = sch_att_empatt.Event_type_id ' +
            'WHERE school_id = ? and employee_id = ? and (late_min <> 0 OR  late_min <> \'\')', [schoolId,employeeId], function (err, result) {
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


    getEmployeeAbsentRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        var query = con.query('SELECT *,app_def_excusetype.Name as excusetype_name,sch_att_empatt.on_vacation FROM sch_att_empvacation left join app_def_excusetype on sch_att_empvacation.ExcuseType = app_def_excusetype.Id '+
        ' join sch_att_empatt on (sch_att_empatt.Calender_id = sch_att_empvacation.Calender_id and sch_att_empatt.employee_id = sch_att_empvacation.Emp_id)'+
        ' where sch_att_empvacation.School_id = ? and Emp_id = ? group by sch_att_empatt.Calender_id', [schoolId,employeeId], function (err, result) {
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

    getEmployeeExcuseRecord: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        var employeeId = req.params.employeeId;
        var query = con.query('SELECT sch_att_empexcuse.*,start.Day as Start_Day,end.Day as End_Day FROM `sch_att_empexcuse` '+
            ' join app_def_calender as start on start.Date = sch_att_empexcuse.Start_Date join app_def_calender as end on end.Date = sch_att_empexcuse.End_Date ' +
            'where School_id = ? and Emp_id = ?', [schoolId,employeeId], function (err, result) {
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


};

module.exports = employeeAttendanceRecordMethods;