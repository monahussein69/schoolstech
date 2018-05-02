var con = require('../routes/dbConfig.js');
var fs = require("fs");
var util = require('util');


var jobTitleMethods = {
    saveJobTitle: function(req,res,callback) {
        var jobTitleData = req.body.jobTitleData;
        console.log('in function ');
        var response = {};
        if(jobTitleData.id){
            con.query("select * from job_title where id = ?",[jobTitleData.id],function(err,result){
             try{
                if(err)
                    throw err;
                if (Object.keys(result).length){
                    con.query(" update job_title set name = ? where id = ?",
                        [ jobTitleData.name ,
                            jobTitleData.id
                        ],function(err,result){
                        try{
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

                        }catch(ex){
                        var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                        log_file_err.write(util.format('Caught exception: '+err) + '\n');
                        callback(ex);
                    }

                        }
                    );
                }else{
                    response.success = false;
                    response.msg = 'المسمى الوظيفي غير موجود الرجاء المحاوله مره اخرى';
                }

            }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
            });
        }else {
            con.query(" insert into job_title  (name) values(?)",
                [jobTitleData.name],function(err,result){
                   try{
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

                }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
                }
            );
        }

    },

    getjobTitle: function(req,res,callback) {
        var id = req.params.id;
        con.query('select * from job_title where id = ?',[id],function(err,result){
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

    getjobTitleByName: function(req,res,callback) {
        var name = req.body.name;
        con.query('select * from job_title where name = ?',[name],function(err,result){
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
    deleteJobTitle: function(req,res,callback) {
        var id = req.params.id;
        var response = {};
        con.query('delete from job_title where id = ?',[id],function(err,result){
         try{
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

        }catch(ex){
            var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
            log_file_err.write(util.format('Caught exception: '+err) + '\n');
            callback(ex);
        }
            }
        );
    },

    getJobTitles: function (req, res, callback) {
        con.query('select * from job_title', function (err, result) {
         try{
                if (err)
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
};



module.exports = jobTitleMethods;