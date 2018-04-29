var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var fireBaseConn = require('../routes/fireBaseConfig.js');
var appSettingsMethods = require('../model/appSettings.js');
var moment = require('moment');

var taskMethods = {

    getTask:function(req,res,callback){
        var taskId = req.params.taskId;

        con.query('select sch_att_tasks.*,app_def_calender.Date as CurrentDate  from sch_att_tasks join app_def_calender on app_def_calender.Id = sch_att_tasks.Calender_id where sch_att_tasks.id = ?',[taskId],function(err,result){
            callback(result);
        });

        /*sequelizeConfig.tasksTable.find({where: {id: taskId}}).then(function (task) {
            callback(task);
        });*/
    },

    saveTaskData: function(req,res,callback) {

        var taskObj = req.body.taskObj;
        var current_date = moment(taskObj.CurrentDate).format('MM-DD-YYYY');
        req.body.date = current_date;
        delete taskObj.current_date;

        var response = {};
        appSettingsMethods.getCalenderByDate(req, res, function (result) {
            if (Object.keys(result).length) {
                var calendarObj = result[0];
                var calendarId = calendarObj.Id;
                taskObj.Calender_id = calendarId;
                    sequelizeConfig.tasksTable.find({where: {id: taskObj.id}}).then(function (task) {
                       if(task){
                           var current_superVisor = task.Suppervisor_Emp_id;
						   
						   delete taskObj.Issued_Date;
                           delete taskObj.Issued_By;
                           task.updateAttributes(taskObj).then(function () {
                               response.success = true;
                               response.msg = 'تم الحفظ بنجاح';
                               response.insertId = task.id;
                               response.updated = 1;
                               response.result = task;
                               if(response.updated && (current_superVisor != taskObj.Suppervisor_Emp_id)){
                                    var msg = 'تم الغاء اشرافك على مهمه';
                                   req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-danger"><i class="fa fa-bolt"></i></span> '+msg+' </span> </a>';
                                    req.body.user_id = current_superVisor;
                                   fireBaseConn.sendNotification(req,res,function(result){});
                                   var msg = 'تم تعيينك كمشرف على مهمه';
                                   req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-success"><i class="fa fa-plus"></i></span> '+msg+'</span></a>';

                                   req.body.user_id = taskObj.Suppervisor_Emp_id;
                                   fireBaseConn.sendNotification(req,res,function(result){});
                               }


                               callback(response);
                           })
                       } else{

                           sequelizeConfig.tasksTable.create(taskObj).then(task => {
                               response.success = true;
                               response.msg = 'تم الحفظ بنجاح';
                               response.insertId = task.id;
                               response.result = task;
                               response.added = 1;
                               var msg = 'تم تعيينك كمشرف على مهمه';
                               req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-success"><i class="fa fa-plus"></i></span> '+msg+'</span></a>';

                               req.body.user_id = taskObj.Suppervisor_Emp_id;
                               fireBaseConn.sendNotification(req,res,function(result){});
                               callback(response);
                           });

                       }
                    });

            } else {
                response.success = false;
                response.msg = 'اليوم غير متوفر';
                callback(response);

            }
        });


    },
    deleteTask:function(req,res,callback){

        sequelizeConfig.tasksTable.destroy({
            where: {
               id:req.params.taskId
            }
        }).then((rowDeleted) => {
            if(rowDeleted){
                response.success = true;
                response.msg = 'تم حذف المهمه بنجاح';
                callback(response);
            }else{
                response.success = false;
                response.msg = 'خطأ الرجاء المحاوله مره اخرى';
                callback(response);
            }

        });
    },
    getAllTasks:function(req,res,callback){
        var schoolId = req.params.schoolId;
        var query = con.query('select sch_att_tasks.*,sch_str_employees.name as supervisor_name,app_def_taskstatus.Name as status_name from sch_att_tasks join sch_str_employees on sch_str_employees.id = sch_att_tasks.Suppervisor_Emp_id join app_def_taskstatus on app_def_taskstatus.Id = sch_att_tasks.Task_Staus where sch_att_tasks.school_id = ?',[schoolId],function(err,result){
            console.log(query.sql);
            callback(result);
        });
    },
    getTaskByEmpId:function(req,res,callback){
        var empId = req.body.empId;
        var query = con.query('select sch_att_tasks.*,sch_str_employees.name as supervisor_name,app_def_taskstatus.Name as status_name from sch_att_tasks join sch_str_employees on sch_str_employees.id = sch_att_tasks.Suppervisor_Emp_id join app_def_taskstatus on app_def_taskstatus.Id = sch_att_tasks.Task_Staus where Suppervisor_Emp_id =?',[empId],function(err,result){
            console.log(result);
            console.log('result');
            callback(result);
        });
    }
};



module.exports = taskMethods;