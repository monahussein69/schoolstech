var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');
var fs = require("fs");
var util = require('util');

var studentGroupsMethods = {




    getAllStudentsGroups: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        sequelizeConfig.studentgroupsTable.findAll({where: {schoolId: schoolId}}).then(function (studentGroups) {
         try{
            callback(studentGroups);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
        });
    },
}

module.exports = studentGroupsMethods;