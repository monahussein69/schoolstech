var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');
var fs = require("fs");
var util = require('util');

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
                   try {
                       if (err)
                           throw err;

                       if (result.affectedRows) {
                           response.success = true;
                           response.msg = 'تم الاضافه بنجاح'
                           response.id = result.insertId;
                       } else {
                           response.success = false;
                           response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                       }
                       callback(response);
                   }catch(ex){
                       var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                       log_file_err.write(util.format('Caught exception: '+err) + '\n');
                       callback(ex);
                       }
                }
            );

    },

    updatePhotos: function (req, res, callback) {

        con.query(" update app_def_mains set vision_logo =?",
            [
                req.body.vision_logo
            ], function (err, result) {
                var response = {};
             try{
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                } else {
                    response.success = false;
                    response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                }
                callback(response);

            }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
            }
        );
    },

    updateMinistryPhoto: function (req, res, callback) {

        con.query(" update app_def_mains set ministry_logo =?",
            [
                req.body.ministry_logo
            ], function (err, result) {
            try{
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

            }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
            }
        );
    },


    getappSettingsData: function (req, res, callback) {
        con.query('select * from app_def_mains', function (err, result) {
          try{
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
        }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
            }
        );
    },

    getCalender: function (req, res, callback) {
        var daysByweeks = [];
        var Term_Id = req.params.Term_Id;
        var first_Academic_Year = req.params.first_Academic_Year;
        var end_Academic_Year = req.params.end_Academic_Year;
        con.query('select * from app_def_calender where (Academic_Year = ? or Academic_Year = ?) and Term_Id = ?',[first_Academic_Year,end_Academic_Year,Term_Id], function (err, result) {
           try{
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

        }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
                        }
                    );
                },

    getCalenderByDate: function (req, res, callback) {
        var date = req.body.date;
        //var date = '03-18-2018';
        var query = con.query('select * from app_def_calender where date = ? ',[date], function (err, result) {

            try {
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
    }

};


module.exports = appSettingsMethods;