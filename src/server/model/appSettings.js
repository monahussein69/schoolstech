var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');


var appSettingsMethods = {
    saveAppSettingsData: function (req, res, callback) {
        var AppSettingsData = req.body.appSettingsData;
        var response = {};
        sequelizeConfig.mainsTable.find().then(function (main) {
           if(main){
               main.updateAttributes(AppSettingsData).then(function () {
                   response.success = true;
                   response.id = main.id;
                   response.msg = 'تم التعديل بنجاح';
                   callback(response);
               });
           }else{
               sequelizeConfig.mainsTable.create(AppSettingsData).then(main => {
                   response.success = true;
                   response.msg = 'تم الاضافه بنجاح'
                   response.id = main.insertId;
                   callback(response);
               });
           }
        });

    },


    saveCalender: function (req, res, callback) {
        var calenderData = req.body.calenderData;

        var response = {};
            var sql = "INSERT INTO app_def_calender (Academic_Year, Term_Id,Week_No, Week_Name ,Day ,Date) VALUES ?";
            con.query(sql, [calenderData], function (err, result) {
                    if (err)
                        throw err
                    if (result.affectedRows) {
                        response.success = true;
                        response.msg = 'تم الاضافه بنجاح'
                        response.id = result.insertId;
                    } else {
                        response.success = false;
                        response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                    }
                    callback(response);
                }
            );

    },

    updatePhotos: function (req, res, callback) {

        con.query(" update app_def_mains set vision_logo =?",
            [
                req.body.vision_logo
            ], function (err, result) {
                var response = {};
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                } else {
                    response.success = false;
                    response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    },

    updateMinistryPhoto: function (req, res, callback) {

        con.query(" update app_def_mains set ministry_logo =?",
            [
                req.body.ministry_logo
            ], function (err, result) {
                var response = {};
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                } else {
                    response.success = false;
                    response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    },


    getappSettingsData: function (req, res, callback) {
        con.query('select * from app_def_mains', function (err, result) {
                if (err)
                    throw err
                var response = {};
                if (Object.keys(result).length) {
                    response.success = true;
                    response.data = result;
                } else {
                    response.success = false;
                }
                callback(response);
            }
        );
    },

    getCalender: function (req, res, callback) {
        var daysByweeks = [];

        appSettingsMethods.getappSettingsData(req,res,function(result){
            console.log(result);
            if (Object.keys(result).length) {
                var first_Academic_Year = moment.unix(result.data[0].academic_start_date).format('YYYY');
                var end_Academic_Year = moment.unix(result.data[0].academic_end_date).format('YYYY');
                var active_term  =  result.data[0].active_term;
                con.query('select * from app_def_calender where (Academic_Year = ? or Academic_Year = ?) and Term_Id = ?',[first_Academic_Year,end_Academic_Year,active_term], function (err, result) {
                        if (err)
                            throw err
                        var response = {};
                        if (Object.keys(result).length) {
                            response.success = true;
                            response.data = result;
                        } else {
                            response.success = false;
                        }
                        callback(response);
                    }
                );
            }
        });

    },

    getCalenderByDate: function (req, res, callback) {
        var date = req.body.date;
        //var date = '03-18-2018';
        var query = con.query('select * from app_def_calender where date = ? ',[date], function (err, result) {
            console.log(query.sql);
            if (err)
                    throw err
                callback(result);
            }
        );
    }

};


module.exports = appSettingsMethods;