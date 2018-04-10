var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


var studentGroupsMethods = {




    getAllStudentsGroups: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        sequelizeConfig.studentgroupsTable.findAll({where: {schoolId: schoolId}}).then(function (studentGroups) {
            callback(studentGroups);
        });
    },
}

module.exports = studentGroupsMethods;