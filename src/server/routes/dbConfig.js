var mysql = require('mysql');
var bcrypt = require('bcrypt');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"schooltech"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


var methods = {
    checkIfUserExists: function(username,password,callback) {


        con.query('select * from SYS_Users where loginName = ?', [username],function(err,result) {
            if (err)
                throw err;

            if (Object.keys(result).length){
                var hashedPassword = result[0].PasswordHash;
                bcrypt.compare(password, hashedPassword, function (err, res) {
                if (res) {
                    callback(result);
                    console.log('password matched');
                    // Passwords match
                } else {
                    // Passwords don't match
                    console.log('password not matched');
                }
            });
         }
         callback(result);
        });


    }
};


module.exports = methods;