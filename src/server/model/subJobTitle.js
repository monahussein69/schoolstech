var con = require('../routes/dbConfig.js');
var fs = require("fs");
var util = require('util');

var subJobTitleMethods = {
    saveSubJobTitle: function(req,res,callback) {
        var subJobTitleData = req.body.SubjobTitleData;
        var response = {};
        if(subJobTitleData.id){
            con.query("select * from sub_job_title where id = ?",[subJobTitleData.id],function(err,result){
                try{
                if(err)
                    throw err;
                if (Object.keys(result).length){
                    con.query(" update sub_job_title set name = ? where id = ?",
                        [ subJobTitleData.name ,
                            subJobTitleData.id
                        ],function(err,result){
                           try{
                            if(err)
                                throw err
                            if(result.affectedRows){
                                response.success = true;
                                response.msg = 'تم الحفظ بنجاح';
                                response.insertId = subJobTitleData.id;

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
            con.query(" insert into sub_job_title  (name,job_title_id) values(?,?)",
                [subJobTitleData.name,subJobTitleData.job_title_id],function(err,result){
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

    getSubJobTitle: function(req,res,callback) {
        var id = req.params.id;
        con.query('select * from sub_job_title where id = ?',[id],function(err,result){
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


    getSubJobTitles: function (req, res, callback) {
        var jobTitleId = req.body.jobTitleId;
        console.log(jobTitleId);
        con.query('select * from sub_job_title where job_title_id = ?',[jobTitleId], function (err, result) {
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

    getSubJobTitleByName: function(req,res,callback) {
        var name = req.body.name;
        con.query('select * from sub_job_title where name = ?',[name],function(err,result){
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
};



module.exports = subJobTitleMethods;