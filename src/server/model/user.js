var con = require('../routes/dbConfig.js');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
const saltRounds = 10;

var userMethods = {
    saveUserData: function (req, res, callback) {
        var userData = req.body.userData;
        var response = {};
        if (userData.loginName) {
            con.query("select * from sys_users where loginName = ?", [userData.loginName], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query(" update sys_users set schoolId = ?,userType = ?,loginName = ?,password = ?,groupId=?,PasswordHash=? where id = ?",
                        [
                            userData.schoolId,
                            userData.userType,
                            userData.loginName,
                            userData.password,
                            userData.groupId,
                            userData.PasswordHash,
                            result[0].id
                        ], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم الحفظ بنجاح';
                                response.insertId = userData.id;

                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                } else {
                    con.query(" insert into sys_users  (schoolId,userType,loginName,password,groupId,PasswordHash) values(?,?,?,?,?,?)",
                        [   userData.schoolId,
                            userData.userType,
                            userData.loginName,
                            userData.password,
                            userData.groupId,
                            userData.PasswordHash,], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم الحفظ بنجاح';
                                response.insertId = result.insertId;
                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }
                            callback(response);
                        }
                    );
                }
            });
        }

    },
    ActivateUser : function(req,res,callback){
        var type = req.body.type;
        var response = {};
        if(type == 'employee'){
            var empId = req.body.empId;
            con.query("select * from sch_str_employees where id = ?", [empId], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    var userPassword = randomstring.generate(7);
                    var hash = bcrypt.hashSync(userPassword, saltRounds);
                  if( result[0].userId){
                      var user_id = result[0].userId;
                      con.query("update sys_users set is_active = 1,password = ?,PasswordHash=? where id = ?", [userPassword,hash,user_id], function (err, result) {
                         if(err)
                             throw err;
                         if(result.affectedRows){
                             response.success = true;
                             response.msg = 'تم تفعيل المستخدم بنجاح';
                             callback(response);
                         }

                      });
                  }else{
                      con.query("insert into sys_users (schoolId,userType,loginName,password,PasswordHash,is_active) values (?,3,?,?,?,1) ",
                          [   result[0].school_id,
                              result[0].mobile,
                              userPassword,
                              hash
                          ], function (err, result) {
                          if(err)
                              throw err;
                          if(result.affectedRows){
                              response.success = true;
                              response.msg = 'تم تفعيل المستخدم بنجاح';
                              var userId = result.insertId;
                              con.query("update sch_str_employees set userId = ?  where id = ? ",
                                  [userId,empId],function(err,result){
                                      callback(response);
                                  });
                          }


                      });
                  }
                }else{
                    response.success = false;
                    response.msg = 'الموظف غير موجود , الرجاء المحاوله مره اخرى';
                    callback(response);
                }


            });
        }



    },
    DeactivateUser : function(req,res,callback){
        var type = req.body.type;
        var response = {};
        var userPassword = randomstring.generate(7);
        var hash = bcrypt.hashSync(userPassword, saltRounds);

        if(type == 'employee'){
            var empId = req.body.empId;
            con.query("select * from sch_str_employees where id = ?", [empId], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {

                    if( result[0].userId){
                        var user_id = result[0].userId;
                        con.query("update sys_users set is_active = 0 where id = ?", [user_id], function (err, result) {
                            if(err)
                                throw err;
                            if(result.affectedRows){
                                response.success = true;
                                response.msg = 'تم الغاء تفعيل المستخدم بنجاح';

                            }
                            callback(response);
                        });
                    }else{
                        response.success = false;
                        response.msg = 'المستخدم غير موجود';
                    }
                }else{
                    response.success = false;
                    response.msg = 'الموظف غير موجود , الرجاء المحاوله مره اخرى';
                    callback(response);
                }


            });
        }
    }


};

module.exports = userMethods;