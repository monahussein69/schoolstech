var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


var ExcuseTypeMethods = {

    getExcuseType: function (req, res, callback) {
        var typeId = req.params.typeId;

        sequelizeConfig.ExcuseTypeTable.find({where: {Id: typeId}}).then(function (ExcuseType) {
            callback(ExcuseType);
        });
    },

    saveExcuseTypeData: function (req, res, callback) {

        var ExcuseTypeData = req.body.ExcuseTypeData;
        var response = {};

        sequelizeConfig.ExcuseTypeTable.find({where: {Id: ExcuseTypeData.Id}}).then(function (ExcuseType) {
            if (ExcuseType) {
                ExcuseType.updateAttributes(ExcuseTypeData).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = ExcuseType.Id;
                    callback(response);
                });
            } else {

                sequelizeConfig.ExcuseTypeTable.create(ExcuseTypeData).then(ExcuseType => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = ExcuseType.Id;
                    callback(response);
                });

            }
        });

    },

    getAllExcuseTypes: function (req, res, callback) {

        sequelizeConfig.ExcuseTypeTable.findAll().then(function (ExcuseTypes) {
            callback(ExcuseTypes);
        });
    },
}

module.exports = ExcuseTypeMethods;