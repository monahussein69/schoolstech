var db = require('../routes/dbConfig.js');
var password_hashing = require('password-hash-and-salt');
var loginMethods = {

    userLogin : function(req,res){
        var name = req.body.name;
        var password = req.body.password;
        db.checkIfUserExists(name,password,function(result) {
            res.send(result);
        });
    }

};


module.exports = loginMethods;