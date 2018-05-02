var con = require('../routes/dbConfig.js');
var bcrypt = require('bcrypt');
var fs = require("fs");
var util = require('util');

var loginMethods = {
    userLogin: function(req,res,callback) {
        var name = req.body.name;
        var password = req.body.password;
        var data = {};
        console.log(con);
        con.query('select * from sys_users where loginName = ? and is_active = 1', [name],function(err,result) {
         try{
            if (err)
                throw err;

            if (Object.keys(result).length){
                var hashedPassword = result[0].PasswordHash;
                bcrypt.compare(password, hashedPassword, function (err, res) {
                    if (res) {
                        data.success = true;
                        data.user = result;
                        callback(data);
                        //callback(result);
                        console.log('password matched');
                        // Passwords match
                    } else {
                        data.success = false;
                        callback(data);
                        // Passwords don't match
                        console.log('password not matched');
                    }
                });
            }else{
                data.success = false;
                callback(data);
            }

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }

        });


    }
};


module.exports = loginMethods;