var con = require('../routes/dbConfig.js');

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

    }
};

module.exports = userMethods;