var con = require('../routes/dbConfig.js');
var workingSettingsMethods = require('../model/schedualProfile.js');
var moment = require('moment');

var attScheduleMethods = {
    saveActivityData: function (req, res, callback) {
        var profile_id = req.body.profile_id;
        req.params.profileId = profile_id;
        var days =
            ['السبت','الاحد','الاثنين','الثلاثاء','الاربعاء','الخميس','الجمعة'];

        var numbers = ['الأولى' , 'الثانية','الثالثة', 'الرابعة' , 'الخامسة' , 'السادسة' , 'السابعة' , 'الثامنة' , 'التاسعة' , 'العاشرة'];

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
			var queue_ending_time = 0;



            for (var Day = 0; Day < Day_Begining.length; Day++) {
				var queue_ending_time = 0;
                if (Day_Begining[Day]){
                    var queue_Begining_time = moment(queue_Begining, "h:mm A").format('YYYY-MM-DD HH:mm:ss');
                    var Ending_Time = moment(queue_Begining_time, 'YYYY-MM-DD HH:mm:ss').add(queue_Begining_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');
                    					
                    activityObj.SCHEDULE_Id = profile_id;
                    activityObj.Day = Day_Begining[Day];
                    activityObj.eventtype = 'طابور';
                    activityObj.event_Nam = 'طابور';
                    activityObj.Begining_Time = queue_Begining_time;
                    activityObj.Ending_Time = Ending_Time;
                    activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                    req.body.activityObj = activityObj;
                    //queue_ending_time = moment(queue_Begining_time, "HH:mm").add(queue_Begining_Duration, 'm');
                    queue_ending_time = Ending_Time;

                    console.log('queue_ending_time');
                    console.log(queue_ending_time);
                    console.log(queue_Begining_Duration);
                    attScheduleMethods.addAttSchedule(req, res, function (result) {
                    });


                    for (var i = 1; i <= Max_Lectures; i++) {
                        var lecture_Begining_time = 0;
                        var lecture_end_time = 0;
                        var rest_count = 0;
                        var breaks = 0;
                        if (i == 1) {
                            var queue_Begining_time = moment(queue_Begining, "h:mm A").format('YYYY-MM-DD HH:mm:ss');
                            lecture_Begining_time = moment(queue_Begining_time, 'YYYY-MM-DD HH:mm:ss').add(queue_Begining_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');
                            first_lecture_time = lecture_Begining_time;
                            lecture_end_time = moment(lecture_Begining_time, 'YYYY-MM-DD HH:mm:ss').add(Lecture_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');
							
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
                            lecture_Begining_time = moment(first_lecture_time, 'YYYY-MM-DD HH:mm:ss').add(lecture_Begining_time, 'm').format('YYYY-MM-DD HH:mm:ss');
                            lecture_end_time = moment(lecture_Begining_time, 'YYYY-MM-DD HH:mm:ss').add(Lecture_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');

                        }


                        activityObj.SCHEDULE_Id = profile_id;
                        activityObj.Day = Day_Begining[Day];
                        activityObj.eventtype = 'حصه';
                        activityObj.event_Nam = 'الحصة '+numbers[i-1];
                        activityObj.Begining_Time = lecture_Begining_time;
                        activityObj.Ending_Time = lecture_end_time;
                        activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                        req.body.activityObj = activityObj;
                        var queue_ending_time = moment(queue_ending_time).format("HH:mm");
                        queue_ending_time = moment(queue_ending_time, "HH:mm").add(Lecture_Duration, 'm');
                        attScheduleMethods.addAttSchedule(req, res, function (result) {
                        });

                        if (First_Break) {
                            if (First_Break_Order == i) {
                                break_Begining_time = lecture_end_time;
                                break_end_time = moment(lecture_end_time, 'YYYY-MM-DD HH:mm:ss').add(First_Break_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');

                                activityObj.SCHEDULE_Id = profile_id;
                                activityObj.Day = Day_Begining[Day];
                                activityObj.eventtype = 'فسحه';
                                activityObj.event_Nam = 'فسحه (1)';
                                activityObj.Begining_Time = break_Begining_time;
                                activityObj.Ending_Time = break_end_time;
                                activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                                req.body.activityObj = activityObj;
                                var queue_ending_time = moment(queue_ending_time).format("HH:mm");
                               queue_ending_time = moment(queue_ending_time, "HH:mm").add(First_Break_Duration, 'm');

                                console.log('فسحه');
                                console.log(First_Break_Duration);
                                console.log(queue_ending_time);

                                attScheduleMethods.addAttSchedule(req, res, function (result) {
                                });
                            }

                        }

                        if (Second_Break) {
                            if (Second_Break_Order == i) {
                                break_Begining_time = lecture_end_time;
                                break_end_time = moment(lecture_end_time, 'YYYY-MM-DD HH:mm:ss').add(Second_Break_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');
                                activityObj.SCHEDULE_Id = profile_id;
                                activityObj.Day = Day_Begining[Day];
                                activityObj.eventtype = 'فسحه';
                                activityObj.event_Nam = 'فسحه (2)';
                                activityObj.Begining_Time = break_Begining_time;
                                activityObj.Ending_Time = break_end_time;
                                activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                                req.body.activityObj = activityObj;
                                var queue_ending_time = moment(queue_ending_time).format("HH:mm");
                                queue_ending_time = moment(queue_ending_time, "HH:mm").add(Second_Break_Duration, 'm');

                                console.log('فسحه');
                                console.log(Second_Break_Duration);
                                console.log(queue_ending_time);
							   
                                attScheduleMethods.addAttSchedule(req, res, function (result) {
                                });
                            }

                        }


                        if (Pray_Break_Order == i) {
                            break_Begining_time = lecture_end_time;
                            break_end_time = moment(lecture_end_time, 'YYYY-MM-DD HH:mm:ss').add(Pray_Break_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');

                            activityObj.SCHEDULE_Id = profile_id;
                            activityObj.Day = Day_Begining[Day];
                            activityObj.eventtype = 'فسحه';
                            activityObj.event_Nam = 'الصلاه';
                            activityObj.Begining_Time = break_Begining_time;
                            activityObj.Ending_Time = break_end_time;
                            var queue_ending_time = moment(queue_ending_time).format("HH:mm");
                            queue_ending_time = moment(queue_ending_time, "HH:mm").add(Pray_Break_Duration, 'm');

                            console.log('فسحه');
                            console.log(Pray_Break_Duration);
                            console.log(queue_ending_time);
					
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
                                        break_end_time = moment(lecture_end_time, 'YYYY-MM-DD HH:mm:ss').add(Activity_Period_Duration, 'm').format('YYYY-MM-DD HH:mm:ss');
                                        activityObj.SCHEDULE_Id = profile_id;
                                        activityObj.Day = Day_Begining[Day];
                                        activityObj.eventtype = 'نشاط';
                                        activityObj.event_Nam = 'نشاط';
                                        activityObj.Begining_Time = break_Begining_time;
                                        activityObj.Ending_Time = break_end_time;
                                        activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                                        var queue_ending_time = moment(queue_ending_time).format("HH:mm");
                                        queue_ending_time = moment(queue_ending_time, "HH:mm").add(Activity_Period_Duration, 'm');
                                        console.log('activity');
                                        console.log(Activity_Period_Duration);
                                        console.log(queue_ending_time);
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
					
					var queue_Begining_time = moment(queue_Begining, "h:mm A").format('YYYY-MM-DD HH:mm:ss');
                    var Ending_Time = moment(queue_ending_time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                    activityObj.SCHEDULE_Id = profile_id;
                    activityObj.Day = Day_Begining[Day];
                    activityObj.eventtype = 'بدايه الدوام';
                    activityObj.event_Nam = 'بدايه الدوام';
                    activityObj.Begining_Time = queue_Begining_time;
                    activityObj.Ending_Time = Ending_Time;
                    activityObj.Day_no = days.indexOf(Day_Begining[Day]);
                    req.body.activityObj = activityObj;
                    console.log('بدايه الدوام');
                    console.log(activityObj);
                    attScheduleMethods.addAttSchedule(req, res, function (result) {
                    });


                }
            }

            });
        });

    },

    getAttSchedule: function (req, res, callback) {
        var profileId = req.params.profileId;
        var query = con.query('select *, TIME_FORMAT(Begining_Time, "%h:%i %p") as Begining_Time_formated, TIME_FORMAT(Ending_Time, "%h:%i %p") as Ending_Time_formated  from sch_att_schedule where SCHEDULE_Id = ? order by Day_no,Begining_Time asc', [profileId], function (err, result) {
            console.log(query.sql);
            if (err)
                    throw err

                callback(result);
            }
        );
    },

    getAttScheduleByEventNameAndDay: function (req, res, callback) {
        var Day = req.body.Day;
        var eventname = req.body.eventname;
        var SCHEDULE_Id = req.body.SCHEDULE_Id;

        var query =con.query('select * from sch_att_schedule where Day = ? and event_Nam = ? and SCHEDULE_Id = ? ', [Day,eventname,SCHEDULE_Id], function (err, result) {
               console.log(query.sql);
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    addAttSchedule: function (req, res, callback) {
        var activityObj = req.body.activityObj;
        var response = {};
		var current_date = moment().format('MM-DD-YYYY');
		var begining_date = moment().format('MM-DD-YYYY');
		var current_date_time1 = current_date + ' '+activityObj.Begining_Time;
		var current_date_time2 = current_date + ' '+activityObj.Ending_Time;
		var Begining_timestamp = moment(current_date_time1).format('MM-DD-YYYY HH:mm');
		var ending_timestamp =  moment(current_date_time2).format('MM-DD-YYYY HH:mm');

		/*console.log(moment(current_date_time1).hours());
        if(moment(current_date_time1).hours() >= 0 && moment(current_date_time1).hours() <= 12){
            current_date = moment(current_date, "MM-DD-YYYY").add(1, 'days');
        }*/


        var query = con.query('insert into sch_att_schedule (SCHEDULE_Id,Day,eventtype,event_Nam,Begining_Time,Ending_Time,Day_no) values (?,?,?,?,?,?,?) ',
            [   activityObj.SCHEDULE_Id,
                activityObj.Day,
                activityObj.eventtype ,
                activityObj.event_Nam,
                activityObj.Begining_Time,
                activityObj.Ending_Time ,
                activityObj.Day_no,

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
    },
	getStartEndAttendance : function(req,res,callback){

        var schoolId = req.body.schoolId;
        var currentDay = workingSettingsMethods.getArabicDay(new Date(req.body.date).getDay());



        var query = con.query("select sch_att_schedule.* from sch_att_schedule JOIN sch_att_scheduleprofile ON sch_att_scheduleprofile.Id = sch_att_schedule.SCHEDULE_Id where sch_att_scheduleprofile.SchoolId = ? AND sch_att_scheduleprofile.Profile_Active_status = 1 AND sch_att_schedule.Day = ? and sch_att_schedule.event_Nam = 'بدايه الدوام'",
            [schoolId,currentDay], function (err, result) {

            console.log(query.sql);
            console.log(result);
                if (err)
                    throw err

                callback(result);
            });
    }




};



module.exports = attScheduleMethods;