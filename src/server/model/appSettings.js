var con = require('../routes/dbConfig.js');


var appSettingsMethods = {
    saveAppSettingsData: function (req, res, callback) {
        var AppSettingsData = req.body.appSettingsData;
        var response = {};
            con.query("select * from APP_DEF_Mains", function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query(" update APP_DEF_Mains set country_name = ? , ministry_name = ?,start_f_year=?, end_f_year=?,academic_start_date=? ,academic_end_date =?,first_term_start_date=?,first_term_end_date=?,second_term_start_date=?,second_term_end_date=?,summer_term_start_date=?,summer_term_end_date=?, active_term=?,marketing=? , ministry_logo=? , vision_logo=?",
                        [AppSettingsData.country_name,
                            AppSettingsData.ministry_name,
                            AppSettingsData.start_f_year,
                            AppSettingsData.end_f_year,
                            AppSettingsData.academic_start_date,
                            AppSettingsData.academic_end_date,
                            AppSettingsData.first_term_start_date,
                            AppSettingsData.first_term_end_date,
                            AppSettingsData.second_term_start_date,
                            AppSettingsData.second_term_end_date,
                            AppSettingsData.summer_term_start_date,
                            AppSettingsData.summer_term_end_date,
                            AppSettingsData.active_term,
                            AppSettingsData.marketing,
                            AppSettingsData.ministry_logo,
                            AppSettingsData.vision_logo
                        ], function (err, updateresult) {
                            if (err)
                                throw err
                            if (updateresult.affectedRows) {
                                response.success = true;
                                response.id = result[0].id;
                                response.msg = 'تم التعديل بنجاح'
                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                } else {
                    con.query(" insert into APP_DEF_Mains  (country_name, ministry_name,start_f_year, end_f_year ,academic_start_date ,academic_end_date,first_term_start_date,first_term_end_date,second_term_start_date,second_term_end_date,summer_term_start_date,summer_term_end_date,active_term,marketing , ministry_logo , vision_logo) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [   AppSettingsData.country_name,
                            AppSettingsData.ministry_name,
                            AppSettingsData.start_f_year,
                            AppSettingsData.end_f_year,
                            AppSettingsData.academic_start_date,
                            AppSettingsData.academic_end_date,
                            AppSettingsData.first_term_start_date,
                            AppSettingsData.first_term_end_date,
                            AppSettingsData.second_term_start_date,
                            AppSettingsData.second_term_end_date,
                            AppSettingsData.summer_term_start_date,
                            AppSettingsData.summer_term_end_date,
                            AppSettingsData.active_term,
                            AppSettingsData.marketing,
                            AppSettingsData.ministry_logo,
                            AppSettingsData.vision_logo
                        ], function (err, result) {
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
                }


            });


    },

    updatePhotos: function (req, res, callback) {

        con.query(" update APP_DEF_Mains set vision_logo =?",
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

        con.query(" update APP_DEF_Mains set ministry_logo =?",
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
        con.query('select * from APP_DEF_Mains', function (err, result) {
                if (err)
                    throw err
            var response = {};
            if (Object.keys(result).length) {
                    response.success = true;
                    response.data=result;
            }else{
                response.success = false;
            }
                callback(response);
            }
        );
    },

};


module.exports = appSettingsMethods;