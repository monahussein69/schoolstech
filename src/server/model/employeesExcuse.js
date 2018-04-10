var con = require('../routes/dbConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');

var employeesExcuseMethods = {
    sendExcuseRequest: function (req, res, callback) {
        var ExcuseObj = req.body.ExcuseObj;
        var current_date = moment(ExcuseObj.Start_Date).format('MM-DD-YYYY');
        var response = {};
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
                if (Object.keys(result).length) {
                var calendarObj = result[0];
                ExcuseObj.Calender_id = calendarObj.Id;
                con.query('insert into sch_att_empexcuse set ?',
                    [ExcuseObj], function (err, result) {
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
                            response.msg = 'تم تقديم الطلب بنجاح';
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
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }

        });

    },
}

module.exports = employeesExcuseMethods;