var con = require('../routes/dbConfig.js');

var schoolAccountMethods = {
    saveSchoolAccount: function(req,res,callback) {
     var schoolAccountData = req.body.schoolData;

     var response = {};
     if(schoolAccountData.schoolId){
       con.query("select * from SYS_School_Account where schoolId = ?",[schoolAccountData.schoolId],function(err,result){
         if(err)
          throw err;
         if (Object.keys(result).length){
          con.query(" update SYS_School_Account set accountName = ? , accountStatus = ?,activationDate=?,expirationDate=?,contactPerson=?, contactEmail=?,contactTitle=? ,contactMobile =?,contactPhone=?,contactPostal=?,contactMailBox=? where schoolId = ?",
          [ schoolAccountData.accountName ,
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
            schoolAccountData.schoolId 
           ],function(err,result){
            if(err)
             throw err
            if(result.affectedRows){
             response.success = true;
			 response.msg = 'تم التعديل بنجاح'
            }else{
             response.success = false;
			 response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
            } 
			
			callback(response);
			
           } 
          );
         }else{
		  response.success = false;
		  response.msg = 'لا يمكن العثور على المدرسه , الرجاء المحاوله مره اخري';
		  callback(response);
		 } 
       });
     }else{
	 
	   con.query(" insert into SYS_School_Account  (accountName, accountStatus,activationDate,expirationDate,contactPerson, contactEmail,contactTitle ,contactMobile ,contactPhone,contactPostal,contactMailBox) values(?,?,?,?,?,?,?,?,?,?,?)",
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
           ],function(err,result){
            if(err)
             throw err
            if(result.affectedRows){
             response.success = true;
			 response.msg = 'تم الاضافه بنجاح'
            }else{
             response.success = false;
			 response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
            } 
			callback(response);
           } 
          );
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