var con = require('../routes/dbConfig.js');
var userMethods = require('../model/user.js');
var schoolMethods = require('../model/school.js');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var fs = require("fs");
var util = require('util');

var schoolAccountMethods = {
    saveSchoolAccount: function(req,res,callback) {
     var schoolAccountData = req.body.schoolAccountData;

     var response = {};

     if(schoolAccountData.schoolId){
       con.query("select * from sys_school_account where schoolId = ?",[schoolAccountData.schoolId],function(err,result){
         try{
           if(err)
          throw err;
         if (Object.keys(result).length){
            AccountStatus = result[0].accountStatus;
          con.query(" update sys_school_account set accountName = ? , accountStatus = ?,activationDate=?,expirationDate=?,expirationType=?,expirationDuration=?,contactPerson=?, contactEmail=?,contactTitle=? ,contactMobile =?,contactPhone=?,contactPostal=?,contactMailBox=? where schoolId = ?",
          [ schoolAccountData.accountName ,
            schoolAccountData.accountStatus,
            schoolAccountData.activationDate ,
            schoolAccountData.expirationDate ,
            schoolAccountData.expirationType ,
            schoolAccountData.expirationDuration ,
            schoolAccountData.contactPerson,
            schoolAccountData.contactEmail,
            schoolAccountData.contactTitle ,
            schoolAccountData.contactMobile,
            schoolAccountData.contactPhone ,
            schoolAccountData.contactPostal ,
            schoolAccountData.contactMailBox,
            schoolAccountData.schoolId 
           ],function(err,result){
              try{
            if(err)
             throw err
            if(result.affectedRows){
                if((schoolAccountData.accountStatus ==  'مفعل') && (schoolAccountData.accountStatus != AccountStatus)) {
                    console.log('here');
                    var userPassword = randomstring.generate({
                        length: 7,
                        charset: 'numeric'
                    });
                    var hash = bcrypt.hashSync(userPassword, saltRounds);
                    var userData =
                        {'schoolId' :schoolAccountData.schoolId ,
                            'userType' : 2,
                            'loginName': schoolAccountData.contactMobile,
                            'password':userPassword,
                            'groupId':1,
                            'PasswordHash':hash,
                            'is_active':1
                        };
                    req.body.userData = userData;

                    userMethods.saveUserData(req, res, function (result) {
                        if(result.success){
                            var userId = result.insertId;
                            var schoolData = {'userId':userId,'id':schoolAccountData.schoolId};
                            req.body.schoolData = schoolData;
                            console.log(schoolData);
                            schoolMethods.setSchoolUser(req, res, function (result) {});
                        }
                    });
                }else if((schoolAccountData.accountStatus ==  'غير مفعل') && (schoolAccountData.accountStatus != AccountStatus)) {
                    req.body.type = 'school';
                    req.body.schoolId = schoolAccountData.schoolId;
                    userMethods.DeactivateUser(req, res, function (result) {
                    });
                }

             response.success = true;
                response.msg = 'تم حفظ بيانات الاشتراك بنجاح';
            }else{
             response.success = false;
			 response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
            } 
			
			callback(response);

              }catch(ex){
                 var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                 log_file_err.write(util.format('Caught exception: '+err) + '\n');
                 callback(ex);
             }
			
           } 
          );
         }else{

             con.query(" insert into sys_school_account  (accountName, accountStatus,activationDate,expirationDate,contactPerson, contactEmail,contactTitle ,contactMobile ,contactPhone,contactPostal,contactMailBox,schoolId,expirationType,expirationDuration) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                 [schoolAccountData.accountName ,
                     schoolAccountData.accountStatus,
                     schoolAccountData.activationDate ,
                     schoolAccountData.expirationDate ,
                     schoolAccountData.contactPerson,
                     schoolAccountData.contactEmail,
                     schoolAccountData.contactTitle ,
                     schoolAccountData.contactMobile,
                     schoolAccountData.contactPhone ,
                     schoolAccountData.contactPostal ,
                     schoolAccountData.contactMailBox,
                     schoolAccountData.schoolId,
                     schoolAccountData.expirationType,
                     schoolAccountData.expirationDuration,
                 ],function(err,result){
                 try{
                     if(err)
                         throw err
                     if(result.affectedRows){

                         if((schoolAccountData.accountStatus ==  'مفعل')) {
                             var userPassword = randomstring.generate({
                                 length: 7,
                                 charset: 'numeric'
                             });
                             var hash = bcrypt.hashSync(userPassword, saltRounds);
                             var userData =
                                 {'schoolId' :schoolAccountData.schoolId ,
                                     'userType' : 2,
                                     'loginName': schoolAccountData.contactMobile,
                                     'password':userPassword,
                                     'groupId':1,
                                     'PasswordHash':hash,
                                     'is_active':1
                                 };
                             console.log(userData);
                             req.body.userData = userData;
                             userMethods.saveUserData(req, res, function (result) {
                                 if(result.success){

                                     var userId = result.insertId;
                                     req.params.schoolId = schoolAccountData.schoolId;
                                     schoolMethods.getSchool(req, res, function (result) {
                                         var schoolData = result[0];
                                         schoolData.userId = userId;
                                         schoolData.schoolId = schoolAccountData.schoolId;
                                         req.body.schoolData = schoolData;
                                         console.log('schoolData');
                                         console.log(schoolData);
                                         schoolMethods.saveSchool(req, res, function (result) {});

                                     });


                                     //callback(response);
                                 }
                             });
                         }else if((schoolAccountData.accountStatus ==  'غير مفعل')) {
                             req.body.type = 'school';
                             req.body.schoolId = schoolAccountData.schoolId;
                             userMethods.DeactivateUser(req, res, function (result) {
                                 //res.send(result);
                             });
                         }
                         response.success = true;
                         response.msg = 'تم حفظ بيانات الاشتراك بنجاح';
                     }else{
                         response.success = false;
                         response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                     }
                     callback(response);

                 }catch(ex){
                 var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                 log_file_err.write(util.format('Caught exception: '+err) + '\n');
                 callback(ex);
             }
                 }

             );
		 }

       }catch(ex){
             var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
             log_file_err.write(util.format('Caught exception: '+err) + '\n');
             callback(ex);
         }
       });
     }

    },
	
    getSchoolAccount: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from sys_school_account where schoolId = ?',[schoolId],function(err,result){
         try{
                if(err)
                    throw err

                callback(result);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
            }
        );
    },
    deleteSchoolAccount: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        var response = {};
        con.query('delete from sys_school_account where schoolId = ?',[schoolId],function(err,result){
         try{
                if(err)
                    throw err
                if(result.affectedRows){
                    response.success = true;
                    response.msg = 'تم حذف المدرسه بنجاح';
                }else{
                    response.success = false;
                    response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
                }
                callback(response);

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
            }
        );
    },
	
	countSchoolsAccounts:function(req,res,callback){
		var response = {};
		 con.query('select count(*) as accounts from sys_school_account where accountStatus = \'مفعل\' ',function(err,result){
         try{
                if(err)
                    throw err
                response.count = result[0].accounts;
                callback(response);

         }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
		 });
	}
};


module.exports = schoolAccountMethods;