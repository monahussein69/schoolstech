var con = require('../routes/dbConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');

var employeesVacationMethods = {

    sendAbsentRequest: function (req, res, callback) {
        var AbsentObj = req.body.AbsentObj;
        //var current_date = moment().format('MM-DD-YYYY');
        var current_date = '03-18-2018';

        var response = {};
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                AbsentObj.Calender_id = calendarObj.Id;
                var query = con.query('insert into sch_att_empvacation set ?',
                    [AbsentObj], function (err, result) {
                    console.log(query.sql);
                        if (err)
                            throw err

                        if (result.affectedRows) {
                            response.success = true;
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
                response.success = false;
                response.msg = 'اليوم غير موجود';
                callback(response);
            }
        });

    },
}

module.exports = employeesVacationMethods;