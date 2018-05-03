var con = require('../routes/dbConfig.js');
var userMethods = require('../model/user.js');
var bcrypt = require('bcrypt');
var fs = require("fs");
var util = require('util');
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");
const saltRounds = 10;

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


    },


    resetUserPassword : function (req,res,callback){
        var loginName = req.body.loginName;
        var email = req.body.email;
       var response = {};
        con.query('select * from sys_users where loginName = ? and is_active = 1', [loginName],function(err,result) {
            try {
                if (err)
                    throw err;
                var userData = result[0];
                if (Object.keys(result).length) {
                    loginMethods.sendNewPassword(email,function(result){
                        userData.password = result.password;
                        userData.PasswordHash = result.PasswordHash;
                        req.body.userData = userData;

                        userMethods.saveUserData(req,res,function(result){
                            if(result.success){
                                response.msg = 'تم ارسال كلمه مرور جديده الى بريدك الالكتروني';
                                response.success = true;
                            }
                          callback(response);
                      });

                    });

                }else{
                    response.msg="المستخدم غير موجود";
                    response.success=false;
                    callback(response);
                }
            } catch (ex) {
                var log_file_err = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'});
                log_file_err.write(util.format('Caught exception: ' + err) + '\n');
                callback(ex);
            }
        });
    },
    sendNewPassword:function(email,callback){


        var response = {};
        var userPassword = randomstring.generate({
            length: 7,
            charset: 'numeric'
        });
        var hash = bcrypt.hashSync(userPassword, saltRounds);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'techschool753@gmail.com',
                pass: 'work2018'
            }
        });

        var mailOptions = {
            from: 'monahussein69@gmail.com',
            to: email,
            subject: 'reset password',
            text: 'كلمه السر الجديده: ' + userPassword
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                response.result = info.response;
                response.password = userPassword;
                response.PasswordHash = hash;
                callback(response);
            }
     });
    }
};


module.exports = loginMethods;