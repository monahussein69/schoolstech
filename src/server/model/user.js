var con = require('../routes/dbConfig.js');
var employeeMethods = require('../model/employee.js');
var schoolMethods = require('../model/school.js');
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
                    var user_id = result[0].id;
                    con.query(" update sys_users set schoolId = ?,userType = ?,loginName = ?,password = ?,groupId=?,PasswordHash=?,is_active = ?,isLeader = ? where id = ?",
                        [
                            userData.schoolId,
                            userData.userType,
                            userData.loginName,
                            userData.password,
                            userData.groupId,
                            userData.PasswordHash,
                            userData.is_active,
                            userData.isLeader,
                            user_id
                        ], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم الحفظ بنجاح';
                                response.insertId = user_id;

                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                } else {
                    con.query(" insert into sys_users  (schoolId,userType,loginName,password,groupId,PasswordHash,is_active,isLeader) values(?,?,?,?,?,?,?,?)",
                        [   userData.schoolId,
                            userData.userType,
                            userData.loginName,
                            userData.password,
                            userData.groupId,
                            userData.PasswordHash,
                            userData.is_active,
                            userData.isLeader,], function (err, result) {
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
            req.params.empId = empId
            employeeMethods.getEmployee(req, res, function (result) {
                if (Object.keys(result).length) {
                    var userPassword = randomstring.generate({
                        length: 7,
                        charset: 'numeric'
                    });
                    var hash = bcrypt.hashSync(userPassword, saltRounds);
                    if (result[0].mobile) {
                    var userData =
                        {
                            'schoolId': result[0].school_id,
                            'userType': 3,
                            'loginName': result[0].mobile,
                            'password': userPassword,
                            'groupId': 0,
                            'PasswordHash': hash,
                            'is_active': 1,

                        };
                    req.body.userData = userData;

                    userMethods.saveUserData(req, res, function (result) {
                        console.log('result');
                        console.log(result);
                        if (result.success) {
                            response.success = true;
                            response.msg = 'تم تفعيل الموظف بنجاح';
                            var userId = result.insertId;
                            var empData = {'userId': userId, 'id': empId};
                            console.log(empData);
                            req.body.empData = empData;
                            console.log(empData);
                            employeeMethods.setEmployeeUser(req, res, function (result) {
                            });
                            callback(response);
                        }
                        //res.send(result);
                    });
                }else{
                        response.success = false;
                        response.msg = 'رقم الجوال غير موجود الرجاء ادخاله ';
                        callback(response);
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
        var userPassword = randomstring.generate({
            length: 7,
            charset: 'numeric'
        });
        var hash = bcrypt.hashSync(userPassword, saltRounds);

        if(type == 'employee'){
            var empId = req.body.empId;
            req.params.empId = empId
            employeeMethods.getEmployee(req, res, function (result) {
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
                        callback(response);
                    }
                }else{
                    response.success = false;
                    response.msg = 'الموظف غير موجود , الرجاء المحاوله مره اخرى';
                    callback(response);
                }

            });

        }else if(type == 'school'){
            var schoolId = req.body.schoolId;
            req.params.schoolId = schoolId
            schoolMethods.getSchool(req, res, function (result) {
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
                        callback(response);
                    }
                }else{
                    response.success = false;
                    response.msg = 'المستخدم غير موجود , الرجاء المحاوله مره اخرى';
                    callback(response);
                }

            });

        }
    }


};

module.exports = userMethods;