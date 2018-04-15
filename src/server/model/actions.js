var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var moment = require('moment');

var actionsMethods = {
    getActionByName:function(actionName,callback){
        sequelizeConfig.actionsTable.find({where: {action_name: actionName}}).then(function (action) {
            callback(action);
        });
    },

};



module.exports = actionsMethods;