var con = require('../routes/dbConfig.js');
var bcrypt = require('bcrypt');

var loginMethods = {
    userLogin: function(req,res,callback) {
        var name = req.body.name;
        var password = req.body.password;
        var data = {};
        console.log(con);
        con.query('select * from SYS_Users where loginName = ?', [name],function(err,result) {
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

        });


    }
};


module.exports = loginMethods;