var con = require('../routes/dbConfig.js');
var userMethods = require('../model/user.js');
var schoolMethods = require('../model/school.js');
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');
const saltRounds = 10;

var schoolAccountMethods = {
    saveSchoolAccount: function(req,res,callback) {
     var schoolAccountData = req.body.schoolAccountData;

     var response = {};

     if(schoolAccountData.schoolId){
       con.query("select * from SYS_School_Account where schoolId = ?",[schoolAccountData.schoolId],function(err,result){
         if(err)
          throw err;
         if (Object.keys(result).length){
            AccountStatus = result[0].accountStatus;
          con.query(" update SYS_School_Account set accountName = ? , accountStatus = ?,activationDate=?,expirationDate=?,expirationType=?,expirationDuration=?,contactPerson=?, contactEmail=?,contactTitle=? ,contactMobile =?,contactPhone=?,contactPostal=?,contactMailBox=? where schoolId = ?",
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
			
           } 
          );
         }else{

             con.query(" insert into SYS_School_Account  (accountName, accountStatus,activationDate,expirationDate,contactPerson, contactEmail,contactTitle ,contactMobile ,contactPhone,contactPostal,contactMailBox,schoolId,expirationType,expirationDuration) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                 }
             );
		 } 
       });
     }

    },
	
    getSchoolAccount: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from SYS_School_Account where schoolId = ?',[schoolId],function(err,result){
                if(err)
                    throw err

                callback(result);
            }
        );
    },
    deleteSchoolAccount: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        var response = {};
        con.query('delete from SYS_School_Account where schoolId = ?',[schoolId],function(err,result){
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
            }
        );
    }
};


module.exports = schoolAccountMethods;