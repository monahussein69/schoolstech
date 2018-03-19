var con = require('../routes/dbConfig.js');
var moment = require('moment');
var appSettingsMethods = require('../model/appSettings.js');

var studentExcuseMethods = {

    sendStudentExcuseRequest: function (req, res, callback) {

       // var current_date = '03-18-2018';
        var ExcuseObj = req.body.ExcuseObj;
        var response = {};
        var current_date = moment(ExcuseObj.currentDate).format('MM-DD-YYYY');
        req.body.date = current_date;
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                ExcuseObj.Calender_id = calendarObj.Id;
                con.query('insert into SCH_ATT_STDEXCUSE set ?',
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

module.exports = studentExcuseMethods;