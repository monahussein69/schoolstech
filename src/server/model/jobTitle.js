var con = require('../routes/dbConfig.js');

var jobTitleMethods = {
    saveJobTitle: function(req,res,callback) {
        var jobTitleData = req.body.jobTitleData;
        console.log('in function ');
        var response = {};
        if(jobTitleData.id){
            con.query("select * from job_title where id = ?",[jobTitleData.id],function(err,result){
                if(err)
                    throw err;
                if (Object.keys(result).length){
                    con.query(" update job_title set name = ? where id = ?",
                        [ jobTitleData.name ,
                            jobTitleData.id
                        ],function(err,result){
                            if(err)
                                throw err
                            if(result.affectedRows){
                                response.success = true;
                                response.msg = 'تم الحفظ بنجاح';
                                response.insertId = jobTitleData.id;

                            }else{
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                }else{
                    response.success = false;
                    response.msg = 'المسمى الوظيفي غير موجود الرجاء المحاوله مره اخرى';
                }
            });
        }else {
            con.query(" insert into job_title  (name) values(?)",
                [jobTitleData.name],function(err,result){
                    if(err)
                        throw err
                    if(result.affectedRows){
                        response.success = true;
                        response.msg = 'تم الحفظ بنجاح';
                        response.insertId = result.insertId;
                    }else{
                        response.success = false;
                        response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                    }
                    callback(response);
                }
            );
        }

    },

    getjobTitle: function(req,res,callback) {
        var id = req.params.id;
        con.query('select * from job_title where id = ?',[id],function(err,result){
                if(err)
                    throw err

                callback(result);
            }
        );
    },

    getjobTitleByName: function(req,res,callback) {
        var name = req.body.name;
        con.query('select * from job_title where name = ?',[name],function(err,result){
                if(err)
                    throw err

                callback(result);
            }
        );
    },
    deleteJobTitle: function(req,res,callback) {
        var id = req.params.id;
        var response = {};
        con.query('delete from job_title where id = ?',[id],function(err,result){
                if(err)
                    throw err
                if(result.affectedRows){
                    response.success = true;
                    response.msg = 'تم الحذف بنجاح';
                }else{
                    response.success = false;
                    response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    },

    getJobTitles: function (req, res, callback) {
        con.query('select * from job_title', function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },
};



module.exports = jobTitleMethods;