var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var appSettingsMethods = require('../model/appSettings.js');
var moment = require('moment');
var fireBaseConn = require('../routes/fireBaseConfig.js');
var fs = require("fs");
var util = require('util');

var taskMethods = {

    getSubTask:function(req,res,callback){
        var subTaskId = req.params.subTaskId;


        sequelizeConfig.subtasksTable.find({where: {id: subTaskId}}).then(function (task) {
            callback(task);
        });
    },

    saveSubTaskData: function(req,res,callback) {

        var subTaskObj = req.body.subTaskObj;
        console.log(subTaskObj);

        subTaskObj.Start_Date = moment(subTaskObj.Start_Date).format('MM-DD-YYYY');
        subTaskObj.End_Date = moment(subTaskObj.End_Date).format('MM-DD-YYYY');

        var response = {};

                sequelizeConfig.subtasksTable.find({where: {id: subTaskObj.id}}).then(function (subTask) {
                    if(subTask){
                        var current_memeber = subTask.Member_Emp_id;
                        subTask.updateAttributes(subTaskObj).then(function () {
                            response.success = true;
                            response.msg = 'تم الحفظ بنجاح';
                            response.insertId = subTask.id;
                            response.result = subTask;
                            response.updated = 1;
                            if(response.updated && (current_memeber != subTaskObj.Member_Emp_id)){
                                var msg = 'تم الغاءك من مهمه';
                                req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-danger"><i class="fa fa-bolt"></i></span> '+msg+' </span> </a>';
                                req.body.user_id = current_memeber;
                                fireBaseConn.sendNotification(req,res);
                                var msg =  'تمت اضافه مهمه لك';
                                req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-success"><i class="fa fa-plus"></i></span> '+msg+'</span></a>';

                                req.body.user_id = subTaskObj.Member_Emp_id;
                                fireBaseConn.sendNotification(req,res,function(result){});
                            }
                            callback(response);
                        })
                    } else{

                        sequelizeConfig.subtasksTable.create(subTaskObj).then(subTask => {
                            response.success = true;
                            response.msg = 'تم الحفظ بنجاح';
                            response.added = 1;
                            response.insertId = subTask.id;
                            response.result = subTask;
                            var msg = 'تمت اضافه مهمه لك';
                            req.body.msg = '<a href="javascript:;" style="border-bottom: none !important;"><span class="details"><span class="label label-sm label-icon label-success"><i class="fa fa-plus"></i></span> '+msg+'</span></a>';

                            req.body.user_id = subTaskObj.Member_Emp_id;
                            fireBaseConn.sendNotification(req,res,function(result){})
                            callback(response);
                        });

                    }
                });

    },
    deleteSubTask:function(req,res,callback){
        var response ={};
        sequelizeConfig.subtasksTable.destroy({
            where: {
                id:req.params.subTaskId
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
    getAllSubTasks:function(req,res,callback){
        var taskId = req.params.taskId;
        var query = con.query('select sch_att_subtasks.*,sch_str_employees.name as employee_task,app_def_taskstatus.Name as status_name from sch_att_subtasks join sch_str_employees on sch_str_employees.id = sch_att_subtasks.Member_Emp_id left join app_def_taskstatus on app_def_taskstatus.Id = sch_att_subtasks.SUBTask_Staus where Task_id = ?',[taskId],function(err,result){
         try{
            console.log(query.sql);
			callback(result);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
        });
    },
    getSubTaskByEmpId:function(req,res,callback){
        var empId = req.body.empId;
        con.query('select sch_att_subtasks.*,sch_str_employees.name as employee_task,app_def_taskstatus.Name as status_name from sch_att_subtasks join sch_str_employees on sch_str_employees.id = sch_att_subtasks.Member_Emp_id left join app_def_taskstatus on app_def_taskstatus.Id = sch_att_subtasks.SUBTask_Staus where Member_Emp_id =?',[empId],function(err,result){
         try{
            callback(result);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
        });
    }
};



module.exports = taskMethods;