var con = require('../routes/dbConfig.js');
var workingSettingsMethods = require('../model/schedualProfile.js');
var moment = require('moment');

var attScheduleMethods = {
    saveActivityData: function (req, res, callback) {
        var profile_id = req.body.profile_id;
        req.params.profileId = profile_id;
        var days =
            ['السبت','الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعه'];

        workingSettingsMethods.getSettingProfile(req,res,function(result) {
            var profileData = result[0];
            console.log(profileData);
            req.params.profileId = profile_id;
            attScheduleMethods.deleteAttSchedule(req, res, function (result) {

            var Day_Begining = profileData['Day_Begining'];
            var Max_Lectures = profileData['Max_Lectures'];
            var Lecture_Duration = profileData['Lecture_Duration'];
            var queue_Begining = profileData['queue_Begining'];
            var queue_Begining_Duration = profileData['queue_Begining_Duration'];
            var Lecture_Rest = (profileData['Lecture_Rest']) ? profileData['Lecture_Rest'] : 0;
            var Lecture_Rest_Duration = (profileData['Lecture_Rest_Duration']) ? profileData['Lecture_Rest_Duration'] : 0;

            var First_Break = (profileData['First_Break']) ? profileData['First_Break'] : 0;
            var First_Break_Duration = (profileData['First_Break_Duration']) ? profileData['First_Break_Duration'] : 0;
            var First_Break_Order = (profileData['First_Break_Order']) ? profileData['First_Break_Order'] : 0;

            var Second_Break = (profileData['Second_Break']) ? profileData['Second_Break'] : 0;
            var Second_Break_Duration = (profileData['Second_Break_Duration']) ? profileData['Second_Break_Duration'] : 0;
            var Second_Break_Order = (profileData['Second_Break_Order']) ? profileData['Second_Break_Order'] : 0;

            var Pray_Break_Duration = (profileData['Pray_Break_Duration']) ? profileData['Pray_Break_Duration'] : 0;
            var Pray_Break_Order = (profileData['Pray_Break_Order']) ? profileData['Pray_Break_Order'] : 0;
            var Activity_Period = (profileData['Activity_Period']) ? profileData['Activity_Period'] : 0;
            var Activity_Period_Order = (profileData['Activity_Period_Order']) ? profileData['Activity_Period_Order'] : 0;
            var Activity_Period_Duration = (profileData['Activity_Period_Duration']) ? profileData['Activity_Period_Duration'] : 0;
            var Activity_Day = profileData['Activity_Day'];
            Day_Begining = Day_Begining.split(",");
            if (Activity_Day) {
                Activity_Day = Activity_Day.split(",");
            }
            var activityObj = {};
            var first_lecture_time = 0;
            var rest_count = 0;
            var breaks = 0;



            for (var Day = 0; Day < Day_Begining.length; Day++) {
                var queue_Begining_time = moment(queue_Begining, 'HH:mm');
                var Ending_Time = moment(queue_Begining_time, 'HH:mm').add(queue_Begining_Duration, 'm').format('HH:mm');
                activityObj.SCHEDULE_Id = profile_id;
                activityObj.Day = Day_Begining[Day];
                activityObj.eventtype = 'طابور';
                activityObj.event_Nam = 'طابور';
                activityObj.Begining_Time = queue_Begining_time;
                activityObj.Ending_Time = Ending_Time;
                activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                req.body.activityObj = activityObj;
                attScheduleMethods.addAttSchedule(req, res, function (result) {
                });


                for (var i = 1; i <= Max_Lectures; i++) {
                    var lecture_Begining_time = 0;
                    var lecture_end_time = 0;
                    var rest_count = 0;
                    var breaks = 0;
                    if (i == 1) {
                        var queue_Begining_time = moment(queue_Begining, 'HH:mm');
                        lecture_Begining_time = moment(queue_Begining_time, 'HH:mm').add(queue_Begining_Duration, 'm').format('HH:mm');
                        first_lecture_time = lecture_Begining_time;
                        lecture_end_time = moment(lecture_Begining_time, 'HH:mm').add(Lecture_Duration, 'm').format('HH:mm');
                    } else {

                        if (i >= (First_Break_Order + 1) && First_Break) {
                            rest_count = rest_count + 1;
                            breaks = breaks + First_Break_Duration;
                        }

                        if (i >= (Second_Break_Order + 1) && Second_Break) {
                            rest_count = rest_count + 1;
                            breaks = breaks + Second_Break_Duration;
                        }

                        if (i >= (Pray_Break_Order + 1)) {
                            rest_count = rest_count + 1;
                            breaks = breaks + Pray_Break_Duration;
                        }

                        if ((i >= (Activity_Period_Order + 1)) && (Activity_Day.indexOf(Day_Begining[Day]) > -1)) {
                            rest_count = rest_count + 1;
                            breaks = breaks + Activity_Period_Duration;
                        }

                        lecture_Begining_time = ((i - 1) * (Lecture_Duration + Lecture_Rest_Duration)) - (rest_count * Lecture_Rest_Duration) + breaks;
                        lecture_Begining_time = moment(first_lecture_time, 'HH:mm').add(lecture_Begining_time, 'm').format('HH:mm');
                        lecture_end_time = moment(lecture_Begining_time, 'HH:mm').add(Lecture_Duration, 'm').format('HH:mm');

                    }


                    activityObj.SCHEDULE_Id = profile_id;
                    activityObj.Day = Day_Begining[Day];
                    activityObj.eventtype = 'حصه';
                    activityObj.event_Nam = 'حصه(' + i + ')';
                    activityObj.Begining_Time = lecture_Begining_time;
                    activityObj.Ending_Time = lecture_end_time;
                    activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                    req.body.activityObj = activityObj;
                    attScheduleMethods.addAttSchedule(req, res, function (result) {
                    });

                    if (First_Break) {
                        if (First_Break_Order == i) {
                            break_Begining_time = lecture_end_time;
                            break_end_time = moment(lecture_end_time, 'HH:mm').add(First_Break_Duration, 'm').format('HH:mm');

                            activityObj.SCHEDULE_Id = profile_id;
                            activityObj.Day = Day_Begining[Day];
                            activityObj.eventtype = 'فسحه';
                            activityObj.event_Nam = 'فسحه (1)';
                            activityObj.Begining_Time = break_Begining_time;
                            activityObj.Ending_Time = break_end_time;
                            activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                            req.body.activityObj = activityObj;

                            attScheduleMethods.addAttSchedule(req, res, function (result) {
                            });
                        }

                    }

                    if (Second_Break) {
                        if (Second_Break_Order == i) {
                            break_Begining_time = lecture_end_time;
                            break_end_time = moment(lecture_end_time, 'HH:mm').add(Second_Break_Duration, 'm').format('HH:mm');

                            activityObj.SCHEDULE_Id = profile_id;
                            activityObj.Day = Day_Begining[Day];
                            activityObj.eventtype = 'فسحه';
                            activityObj.event_Nam = 'فسحه (2)';
                            activityObj.Begining_Time = break_Begining_time;
                            activityObj.Ending_Time = break_end_time;
                            activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                            req.body.activityObj = activityObj;
                            attScheduleMethods.addAttSchedule(req, res, function (result) {
                            });
                        }

                    }


                    if (Pray_Break_Order == i) {
                        break_Begining_time = lecture_end_time;
                        break_end_time = moment(lecture_end_time, 'HH:mm').add(Pray_Break_Duration, 'm').format('HH:mm');

                        activityObj.SCHEDULE_Id = profile_id;
                        activityObj.Day = Day_Begining[Day];
                        activityObj.eventtype = 'فسحه';
                        activityObj.event_Nam = 'الصلاه';
                        activityObj.Begining_Time = break_Begining_time;
                        activityObj.Ending_Time = break_end_time;
                        activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                        req.body.activityObj = activityObj;
                        attScheduleMethods.addAttSchedule(req, res, function (result) {
                        });
                    }


                    if (Activity_Period) {
                        for (var att_day = 0; att_day < Activity_Day.length; att_day++) {
                            if (Activity_Day[att_day] == Day_Begining[Day]) {
                                if (Activity_Period_Order == i) {
                                    break_Begining_time = lecture_end_time;
                                    break_end_time = moment(lecture_end_time, 'HH:mm').add(Activity_Period_Duration, 'm').format('HH:mm');
                                    activityObj.SCHEDULE_Id = profile_id;
                                    activityObj.Day = Day_Begining[Day];
                                    activityObj.eventtype = 'نشاط';
                                    activityObj.event_Nam = 'نشاط';
                                    activityObj.Begining_Time = break_Begining_time;
                                    activityObj.Ending_Time = break_end_time;
                                    activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                                    req.body.activityObj = activityObj;
                                    attScheduleMethods.addAttSchedule(req, res, function (result) {
                                    });
                                    break;
                                } else {
                                    break;
                                }
                            } else {
                                continue;
                            }
                        }
                    }


                }



            }

         });
        });

    },

    getAttSchedule: function (req, res, callback) {
        var profileId = req.params.profileId;
        con.query('select * from sch_att_schedule where SCHEDULE_Id = ? order by Day_no,Begining_Time asc', [profileId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    addAttSchedule: function (req, res, callback) {
        var activityObj = req.body.activityObj;
        var response = {};
        con.query('insert into sch_att_schedule (SCHEDULE_Id,Day,eventtype,event_Nam,Begining_Time,Ending_Time,Day_no) values (?,?,?,?,?,?,?) ',
            [   activityObj.SCHEDULE_Id,
                activityObj.Day,
                activityObj.eventtype ,
                activityObj.event_Nam,
                activityObj.Begining_Time,
                activityObj.Ending_Time ,
                activityObj.Day_no ,
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
                    callback(response);
                }

            }
        );
    },
    deleteAttSchedule : function(req,res,callback){
        var profileId = req.params.profileId;
        var response = {};
        con.query('delete from sch_att_schedule where SCHEDULE_Id = ?', [profileId], function (err, result) {
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                    response.msg = 'تم حذف الموظف بنجاح';
                } else {
                    response.success = false;
                    response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    }


};

module.exports = attScheduleMethods;