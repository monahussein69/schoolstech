var con = require('../routes/dbConfig.js');
var jobTitleMethods = require('../model/jobTitle.js');
var subJobTitleMethods = require('../model/subJobTitle.js');
var Excel = require('exceljs');
var fs = require("fs");
var util = require('util');

var workingSettingsMethods = {
    saveWorkingSettingsData: function (req, res, callback) {
        var workingSettingsData = req.body.workingSettingsData;
        var response = {};
        if (workingSettingsData.Id) {
            con.query("select * from sch_att_scheduleprofile where Id = ?", [workingSettingsData.Id], function (err, result) {
             try{
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update sch_att_scheduleprofile set SchoolId = ? ,Profile_Name = ?, queue_Begining = ? ,queue_Begining_Duration = ? ,Day_Begining = ? ,First_Att_Closing = ? ,Second_Att_Closing = ? ,Max_Lectures = ? ,Lecture_Duration = ? ,Lecture_Rest = ? ,Lecture_Rest_Duration = ?,First_Break = ? ,First_Break_Duration = ? ,First_Break_Order = ? ,Second_Break = ? ,Second_Break_Duration = ? ,Second_Break_Order = ? ,Pray_Break_Duration = ? ,Pray_Break_Order = ? ,Activity_Day = ? ,Activity_Period = ? ,Activity_Period_Order = ? ,Activity_Period_Duration = ? ,Profile_Active_status = ? where Id = ?', [
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
                                response.id = workingSettingsData.Id;
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

            }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
            });
        } else {
            con.query("select * from sch_att_scheduleprofile where Profile_Name = ?", [workingSettingsData.Profile_Name], function (err, result) {
              try{
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    response.success = false;
                    response.msg = 'الاعدادات موجوده مسبقا';
                    callback(response);
                } else {


                    con.query("insert into sch_att_scheduleprofile (SchoolId ,Profile_Name, queue_Begining ,queue_Begining_Duration  ,Day_Begining  ,First_Att_Closing,Second_Att_Closing ,Max_Lectures ,Lecture_Duration  ,Lecture_Rest  ,Lecture_Rest_Duration , First_Break,First_Break_Duration  ,First_Break_Order ,Second_Break ,Second_Break_Duration  ,Second_Break_Order ,Pray_Break_Duration ,Pray_Break_Order ,Activity_Day,Activity_Period ,Activity_Period_Order ,Activity_Period_Duration,Profile_Active_status )  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
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
                     try{
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

                    }catch(ex){
                        var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                        log_file_err.write(util.format('Caught exception: '+err) + '\n');
                        callback(ex);
                    }

                        }
                    );
                }

            }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
            });

        }

    },

    getSettingProfile: function (req, res, callback) {
        var profileId = req.params.profileId;
        con.query('select * from sch_att_scheduleprofile where Id = ?', [profileId], function (err, result) {
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

    deleteSettingProfile: function (req, res, callback) {
        var profileId = req.params.profileId;
        var schoolId = req.params.schoolId;
        var response = {};
        con.query('delete from sch_att_scheduleprofile where Id = ?', [profileId], function (err, result) {
         try{
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

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }

            }
        );
    },

    getAllSettingsProfiles: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from sch_att_scheduleprofile where SchoolId = ?',[schoolId], function (err, result) {
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

    getActiveAttSchedule: function (req, res, callback) {
        var schoolId = req.params.SchoolId;
        con.query('select * from sch_att_scheduleprofile where SchoolId = ? and Profile_Active_status = 1', [schoolId], function (err, result) {
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
    getEventByName : function(req,res,callback){
        var event_name = req.body.event_name;
        var schoolId = req.body.schoolId;
        var day = req.body.day;
        con.query('select sch_att_schedule.* from sch_att_scheduleprofile ' +
            'join sch_att_schedule on ' +
            'sch_att_scheduleprofile.Id =  sch_att_schedule.SCHEDULE_Id ' +
            'where SchoolId = ? and Profile_Active_status = 1 ' +
            'and sch_att_schedule.eventtype = ? '+
            'and sch_att_schedule.Day = ? ', [schoolId,event_name,day], function (err, result) {
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

    getActivityByDayAndSchoolId : function (req , res, callback) {
        var currentDay = workingSettingsMethods.getArabicDay(new Date(req.body.date).getDay());
        var schoolId = req.body.schoolId;
        var query = con.query('SELECT * FROM sch_att_schedule JOIN sch_att_scheduleprofile ON sch_att_scheduleprofile.Id = sch_att_schedule.SCHEDULE_Id WHERE sch_att_scheduleprofile.SchoolId = ? AND sch_att_scheduleprofile.Profile_Active_status = 1 AND sch_att_schedule.Day = ? order by  sch_att_schedule.Begining_Time asc', [schoolId , currentDay], function (err, result) {
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
    getArabicDay: function (dayNo) {
		console.log(dayNo);
		//var dayNo = parseInt(dayNo);
        var array = [];
        array['0'] = 'الاحد';
        array['1'] = 'الاثنين';
        array['2'] = 'الثلاثاء';
        array['3'] = 'الاربعاء';
        array['4'] = 'الخميس';
        array['5'] = 'الجمعة';
        array['6'] = 'السبت';
		console.log('array[dayNo]');
		console.log(array[dayNo]);
        return array[dayNo];
    },

};

module.exports = workingSettingsMethods;