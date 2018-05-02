var con = require('../routes/dbConfig.js');
var sequelizeConfig = require('../routes/sequelizeConfig.js');


var RequestsTypeMethods = {

    getRequestType: function (req, res, callback) {
        var typeId = req.params.typeId;

        sequelizeConfig.RequestsTypeTable.find({where: {Id: typeId}}).then(function (RequestType) {
            callback(RequestType);
        });
    },

    saveRequestTypeData: function (req, res, callback) {

        var RequestTypeData = req.body.RequestTypeData;
        var response = {};

        sequelizeConfig.RequestsTypeTable.find({where: {Id: RequestTypeData.Id}}).then(function (RequestType) {
            if (RequestType) {
                RequestType.updateAttributes(RequestTypeData).then(function () {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = RequestType.Id;
                    callback(response);
                });
            } else {

                sequelizeConfig.RequestsTypeTable.create(RequestTypeData).then(RequestType => {
                    response.success = true;
                    response.msg = 'تم الحفظ بنجاح';
                    response.insertId = RequestType.Id;
                    callback(response);
                });

            }
        });

    },

    getAllRequestsType: function (req, res, callback) {

        sequelizeConfig.RequestsTypeTable.findAll().then(function (RequestsType) {
            callback(RequestsType);
        });
    },
}

module.exports = RequestsTypeMethods;