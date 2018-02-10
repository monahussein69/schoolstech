var db = require('../routes/dbConfig.js');
var loginMethods = {

    userLogin : function(req,res,callback){
        var name = req.body.name;
        var password = req.body.password;
        db.checkIfUserExists(name,password,function(result) {
            callback(result);
        });
    }

};


module.exports = loginMethods;