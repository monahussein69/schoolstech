var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


var VacationTypesMethods = {

    getVacationType: function (req, res, callback) {
        var typeId = req.params.typeId;

        sequelizeConfig.vacationTypesTable.find({where: {Id: typeId}}).then(function (vacationType) {
            callback(vacationType);
        });
    },

    saveVacationTypeData: function (req, res, callback) {

        var vacationTypeData = req.body.vacationTypeData;
        var response = {};

        sequelizeConfig.vacationTypesTable.find({where: {Id: vacationTypeData.Id}}).then(function (vacationType) {
            if (vacationType) {
                vacationType.updateAttributes(vacationTypeData).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = vacationType.Id;
                    callback(response);
                });
            } else {

                sequelizeConfig.vacationTypesTable.create(vacationTypeData).then(vacationType => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = vacationType.Id;
                    callback(response);
                });

            }
        });

    },

    getAllVacationTypes: function (req, res, callback) {

        sequelizeConfig.vacationTypesTable.findAll().then(function (VacationTypes) {
            callback(VacationTypes);
        });
    },
}

module.exports = taskStatusMethods;