var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


var taskStatusMethods = {

    getTaskStatus: function (req, res, callback) {
        var statusId = req.params.statusId;

        sequelizeConfig.taskStatusTable.find({where: {Id: statusId}}).then(function (taskStatus) {
            callback(taskStatus);
        });
    },

    saveTaskStatusData: function (req, res, callback) {

        var taskStatusData = req.body.taskStatusData;
        var response = {};

        sequelizeConfig.taskStatusTable.find({where: {Id: taskStatusData.Id}}).then(function (taskStatus) {
            if (taskStatus) {
                taskStatus.updateAttributes(taskStatusData).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = taskStatus.id;
                    callback(response);
                })
            } else {

                sequelizeConfig.taskStatusTable.create(taskStatusData).then(taskStatus => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = taskStatus.id;
                    callback(response);
                });

            }
        });

    },

    getAllTaskStatus: function (req, res, callback) {

        sequelizeConfig.taskStatusTable.findAll().then(function (taskStatus) {
            callback(taskStatus);
        });
    },
}

module.exports = taskStatusMethods;