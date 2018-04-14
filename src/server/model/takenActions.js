var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');

var takenActionsMethods = {

    getTakenAction:function(req,res,callback){
        var takenActionId = req.params.takenActionId;
        sequelizeConfig.takenActionsTable.find({where: {id: takenActionId}}).then(function (task) {
            callback(task);
        });
    },

    saveTakenActionData: function(req,res,callback) {

        var TakenActionObj = req.body.TakenActionObj;

        var response = {};

        sequelizeConfig.takenActionsTable.find({where: {id: TakenActionObj.id}}).then(function (TakenAction) {
            if(TakenAction){
                TakenAction.updateAttributes(TakenActionObj).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = TakenAction.id;
                    response.result = TakenAction;
                    callback(response);
                })
            } else{

                sequelizeConfig.takenActionsTable.create(TakenActionObj).then(TakenAction => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = TakenAction.id;
                    response.result = TakenAction;
                    callback(response);
                });

            }
        });

    },

    getAllTakenAction:function(req,res,callback){
        var schoolId = req.params.schoolId;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.School_id = ?',[schoolId],function(err,result){
            callback(result);
        });
    },
    getTakenActionByEmpId:function(req,res,callback){
        var empId = req.body.empId;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.Emp_id = ?',[empId],function(err,result){
            callback(result);
        });
    },
    getLastTakenActionByEmpIdandActionType:function(req,res,callback){
        var empId = req.body.empId;
        var actionType = req.body.actionType;
        con.query('select  sch_att_takenaction.*,sch_str_employees.name as employee_name,app_def_actions.action_name as action_name from sch_att_takenaction join sch_str_employees on sch_str_employees.id = sch_att_takenaction.Emp_id join app_def_actions on app_def_actions.Id = sch_att_takenaction.ACTION_id where sch_att_takenaction.Emp_id = ? and sch_att_takenaction.ACTION_id = ?',[empId,actionType],function(err,result){
            callback(result);
        });
    },
    sendActionToEmp:function(req,res,callback){

    }

};



module.exports = taskMethods;