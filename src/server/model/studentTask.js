var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var appSettingsMethods = require('../model/appSettings.js');
var fs = require("fs");
var util = require('util');
var studentTaskMethods = {



    saveStudentsTask: function(req,res,callback) {

        var stdTaskObj = req.body.stdTaskObj;
        var response = {};

        sequelizeConfig.studenttasksTable.find({where: {Student_Id: stdTaskObj.Student_Id,SubTask_Id: stdTaskObj.SubTask_Id}}).then(function (studentTask) {
            if(studentTask){
                    response.success = false;
                    response.msg = 'الطالب موجود مسبقا';
                    callback(response);

            } else{

                sequelizeConfig.studenttasksTable.create(stdTaskObj).then(studentTask => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = studentTask.id;
                    response.result = studentTask;
                    callback(response);
                });

            }
        });

    },
    deleteStudentTask:function(req,res,callback){
        var response ={};
        sequelizeConfig.studenttasksTable.destroy({
            where: {
                Id:req.params.id
            }
        }).then((rowDeleted) => {
            if(rowDeleted){
                response.success = true;
                response.msg = 'تم حذف الطلاب من المهمه بنجاح';
                callback(response);
            }else{
                response.success = false;
                response.msg = 'خطأ الرجاء المحاوله مره اخرى';
                callback(response);
            }

        });
    },
    getAllStudentTask:function(req,res,callback){
        var subTaskId = req.params.subTaskId;
        con.query('select sch_att_studenttasks.*,sch_str_student.Name as student_name from sch_att_studenttasks join sch_str_student on sch_str_student.student_id = sch_att_studenttasks.Student_Id  where SubTask_Id = ?',[subTaskId],function(err,result){
         try{
            callback(result);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
        });
    },

};



module.exports = studentTaskMethods;