var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var appSettingsMethods = require('../model/appSettings.js');
var moment = require('moment');

var taskMethods = {

    getTask:function(req,res,callback){
        var taskId = req.params.taskId;

        con.query('select sch_att_tasks.*,app_def_calender.Date as CurrentDate  from sch_att_tasks join app_def_calender on app_def_calender.Id = sch_att_tasks.Calender_id where id = ?',[taskId],function(err,result){
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
                           task.updateAttributes(taskObj).then(function () {
                               response.success = true;
                               response.msg = 'تم الحفظ بنجاح';
                               response.insertId = task.id;
                               response.result = task;
                               callback(response);
                           })
                       } else{

                           sequelizeConfig.tasksTable.create(taskObj).then(task => {
                               response.success = true;
                               response.msg = 'تم الحفظ بنجاح';
                               response.insertId = task.id;
                               response.result = task;
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
        con.query('select sch_att_tasks.*,sch_str_employees.name as supervisor_name from sch_att_tasks join sch_str_employees on sch_str_employees.id = sch_att_tasks.Suppervisor_Emp_id where school_id = ?',[schoolId],function(err,result){
         callback(result);
        });
    },
    getTaskByEmpId:function(req,res,callback){
        var empId = req.body.empId;
        con.query('select sch_att_tasks.*,sch_str_employees.name as supervisor_name from sch_att_tasks join sch_str_employees on sch_str_employees.id = sch_att_tasks.Suppervisor_Emp_id where Suppervisor_Emp_id =?',[empId],function(err,result){
            callback(result);
        });
    }
};



module.exports = taskMethods;