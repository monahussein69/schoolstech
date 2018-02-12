var con = require('../routes/dbConfig.js');

var schoolMethods = {
    saveSchool: function(req,res,callback) {
     var schoolData = req.body.schoolData;

     var response = {};
     if(schoolData.schoolId){
       con.query("select * from SCH_School where id = ?",[schoolData.schoolId],function(err,result){
         if(err)
          throw err;
         if (Object.keys(result).length){
          con.query(" update SCH_School set name = ? , gender = ?,educationalOffice=?,educationalRegion=?,educationLevel=?, address=?,totalClasses=? ,totalStudents =?,totalStaff=?,rentedBuildings=?,governmentBuildings=?,foundationYear=?,logoFile=? where id = ?",
          [schoolData.name , 
           schoolData.gender,
           schoolData.educationalOffice,
           schoolData.educationalRegion,
           schoolData.educationLevel,
           schoolData.address,
           schoolData.totalClasses,
           schoolData.totalStudents,
           schoolData.totalStaff,
           schoolData.rentedBuildings,
           schoolData.governmentBuildings,
           schoolData.foundationYear,
           schoolData.logoFile,
           schoolData.schoolId,
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
	 
	   con.query(" insert into SCH_School  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,logoFile) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [schoolData.name , 
           schoolData.gender,
           schoolData.educationalOffice,
           schoolData.educationalRegion,
           schoolData.educationLevel,
           schoolData.address,
           schoolData.totalClasses,
           schoolData.totalStudents,
           schoolData.totalStaff,
           schoolData.rentedBuildings,
           schoolData.governmentBuildings,
           schoolData.foundationYear,
           schoolData.logoFile
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
	
	
	saveSchools: function(req,res,callback) {
     var schoolsData = req.body.schoolsData;
     var response = {};
      con.query(" insert into SCH_School  (name, gender,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,logoFile) values(?)",
          [schoolsData],function(err,result){
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
    },
    getSchool: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from SCH_School where id = ?',[schoolId],function(err,result){
                if(err)
                    throw err

                callback(result);
            }
        );
    },
    deleteSchool: function(req,res,callback) {
        var schoolId = req.params.schoolId;
        var response = {};
        con.query('delete from SCH_School where id = ?',[schoolId],function(err,result){
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


module.exports = schoolMethods;