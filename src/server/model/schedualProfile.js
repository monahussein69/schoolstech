var con = require('../routes/dbConfig.js');
var jobTitleMethods = require('../model/jobTitle.js');
var subJobTitleMethods = require('../model/subJobTitle.js');
var Excel = require('exceljs');

var workingSettingsMethods = {
    saveWorkingSettingsData: function (req, res, callback) {
        var workingSettingsData = req.body.workingSettingsData;
        var response = {};
        if (workingSettingsData.Id) {
            con.query("select * from SCH_ATT_SCHEDULEProfile where Id = ?", [workingSettingsData.Id], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update SCH_ATT_SCHEDULEProfile set SchoolId = ? ,Profile_Name = ?, queue_Begining = ? ,queue_Begining_Duration = ? ,Day_Begining = ? ,First_Att_Closing = ? ,Second_Att_Closing = ? ,Max_Lectures = ? ,Lecture_Duration = ? ,Lecture_Rest = ? ,Lecture_Rest_Duration = ?,First_Break = ? ,First_Break_Duration = ? ,First_Break_Order = ? ,Second_Break = ? ,Second_Break_Duration = ? ,Second_Break_Order = ? ,Pray_Break_Duration = ? ,Pray_Break_Order = ? ,Activity_Day = ? ,Activity_Period = ? ,Activity_Period_Order = ? ,Activity_Period_Duration = ? ,Profile_Active_status = ? where Id = ?', [
                            workingSettingsData.SchoolId,
                            workingSettingsData.Profile_Name,
                            workingSettingsData.queue_Begining,
                            workingSettingsData.queue_Begining_Duration,
                            workingSettingsData.Day_Begining,
                            workingSettingsData.First_Att_Closing,
                            workingSettingsData.Second_Att_Closing,
                            workingSettingsData.Max_Lectures,
                            workingSettingsData.Lecture_Duration,
                            workingSettingsData.Lecture_Rest,
                            workingSettingsData.Lecture_Rest_Duration,
                            workingSettingsData.First_Break,
                            workingSettingsData.First_Break_Duration,
                            workingSettingsData.First_Break_Order,
                            workingSettingsData.Second_Break,
                            workingSettingsData.Second_Break_Duration,
                            workingSettingsData.Second_Break_Order,
                            workingSettingsData.Pray_Break_Duration,
                            workingSettingsData.Pray_Break_Order,
                            workingSettingsData.Activity_Day,
                            workingSettingsData.Activity_Period,
                            workingSettingsData.Activity_Period_Order,
                            workingSettingsData.Activity_Period_Duration,
                            workingSettingsData.Profile_Active_status,
                            workingSettingsData.Id
                        ]
                        , function (err, result) {
                            if (err)
                                throw err
                            console.log(result);
                            if (result.affectedRows) {
                                response.success = true;
                                response.id = workingSettingsData.id;
                                response.msg = 'تم التعديل بنجاح';
                                req.params.schoolId = workingSettingsData.SchoolId;

                                workingSettingsMethods.getAllSettingsProfiles(req,res,function (result) {
                                    response.data = result;
                                    callback(response);
                                });

                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                                callback(response);
                            }



                        }
                    );
                } else {
                    response.success = false;
                    response.msg = 'لا يمكن العثور على الاعدادات الرجاء المحاوله مره اخرى';
                    callback(response);
                }
            });
        } else {
            con.query("select * from SCH_ATT_SCHEDULEProfile where Profile_Name = ?", [workingSettingsData.Profile_Name], function (err, result) {

                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    response.success = false;
                    response.msg = 'الاعدادات موجوده مسبقا';
                    callback(response);
                } else {


                    con.query("insert into SCH_ATT_SCHEDULEProfile (SchoolId ,Profile_Name, queue_Begining ,queue_Begining_Duration  ,Day_Begining  ,First_Att_Closing,Second_Att_Closing ,Max_Lectures ,Lecture_Duration  ,Lecture_Rest  ,Lecture_Rest_Duration , First_Break,First_Break_Duration  ,First_Break_Order ,Second_Break ,Second_Break_Duration  ,Second_Break_Order ,Pray_Break_Duration ,Pray_Break_Order ,Activity_Day,Activity_Period ,Activity_Period_Order ,Activity_Period_Duration,Profile_Active_status )  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                        workingSettingsData.schoolId,
                        workingSettingsData.Profile_Name,
                        workingSettingsData.queue_Begining,
                        workingSettingsData.queue_Begining_Duration,
                        workingSettingsData.Day_Begining,
                        workingSettingsData.First_Att_Closing,
                        workingSettingsData.Second_Att_Closing,
                        workingSettingsData.Max_Lectures,
                        workingSettingsData.Lecture_Duration,
                        workingSettingsData.Lecture_Rest,
                        workingSettingsData.Lecture_Rest_Duration,
                        workingSettingsData.First_Break,
                        workingSettingsData.First_Break_Duration,
                        workingSettingsData.First_Break_Order,
                        workingSettingsData.Second_Break,
                        workingSettingsData.Second_Break_Duration,
                        workingSettingsData.Second_Break_Order,
                        workingSettingsData.Pray_Break_Duration,
                        workingSettingsData.Pray_Break_Order,
                        workingSettingsData.Activity_Day,
                        workingSettingsData.Activity_Period,
                        workingSettingsData.Activity_Period_Order,
                        workingSettingsData.Activity_Period_Duration,
                        workingSettingsData.Profile_Active_status], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم الاضافه بنجاح'
                                response.id = result.insertId;
                                req.params.schoolId = workingSettingsData.SchoolId;

                                workingSettingsMethods.getAllSettingsProfiles(req,res,function (result) {
                                    response.data = result;
                                    callback(response);
                                });
                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                                callback(response);
                            }

                        }
                    );
                }
            });

        }

    },

    getSettingProfile: function (req, res, callback) {
        var profileId = req.params.profileId;
        con.query('select * from SCH_ATT_SCHEDULEProfile where id = ?', [profileId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    deleteSettingProfile: function (req, res, callback) {
        var profileId = req.params.profileId;
        var schoolId = req.params.schoolId;
        var response = {};
        con.query('delete from SCH_ATT_SCHEDULEProfile where Id = ?', [profileId], function (err, result) {
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                    response.msg = 'تم حذف الاعدادات بنجاح';
                    req.params.schoolId = schoolId;

                    workingSettingsMethods.getAllSettingsProfiles(req,res,function (result) {
                        response.rest_data = result;
                        callback(response);
                    });
                } else {
                    response.success = false;
                    response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
                    callback(response);
                }

            }
        );
    },

    getAllSettingsProfiles: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from SCH_ATT_SCHEDULEProfile where SchoolId = ?',[schoolId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    getActiveAttSchedule: function (req, res, callback) {
        var schoolId = req.params.SchoolId;
        con.query('select * from sch_att_scheduleprofile where SchoolId = ? and Profile_Active_status = 1', [schoolId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

};

module.exports = workingSettingsMethods;