var con = require('../routes/dbConfig.js');
var jobTitleMethods = require('../model/jobTitle.js');
var Excel = require('exceljs');

var employeeMethods = {
    saveEmployee: function (req, res, callback) {
        var empData = req.body.empData;
        var response = {};
        if (empData.id) {
            con.query("select * from SCH_STR_Employees where id = ?", [empData.id], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update SCH_STR_Employees set identity_no = ? ,id_date = ?, school_id = ? ,name = ? ,jobtitle_id = ? ,nationality = ? ,birthdate = ? ,birth_place = ? ,educational_level = ? ,graduate_year = ? ,major = ? ,job_no = ? ,ministry_start_date = ? ,school_start_date = ? ,current_position_date = ? ,degree = ? ,address = ? ,phone1 = ? ,phone2 = ? ,mobile = ? ,email = ? ,postal_code = ? ,lectures_qouta = ? ,kids = ? ,kids_under6 = ? ,kids_under24 = ? ,kids_over24 = ? ,notes = ? ,last_update = ? ,updated_by = ? where id = ?',[
                            empData.identity_no,
                            empData.id_date,
                            empData.school_id,
                            empData.name,
                            empData.jobtitle_id,
                            empData.nationality,
                            empData.birthdate,
                            empData.birth_place,
                            empData.educational_level,
                            empData.graduate_year,
                            empData.major,
                            empData.job_no,
                            empData.ministry_start_date,
                            empData.school_start_date,
                            empData.current_position_date,
                            empData.degree,
                            empData.address,
                            empData.phone1,
                            empData.phone2,
                            empData.mobile,
                            empData.email,
                            empData.postal_code,
                            empData.lectures_qouta,
                            empData.kids,
                            empData.kids_under6,
                            empData.kids_under24,
                            empData.kids_over24,
                            empData.notes,
                            empData.last_update,
                            empData.updated_by,
                            empData.id
                        ]
                        , function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.id = empData.id;
                                response.msg = 'تم التعديل بنجاح'
                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                } else {
                    response.success = false;
                    response.msg = 'لا يمكن العثور على الموظف الرجاء المحاوله مره اخرى';
                    callback(response);
                }
            });
        } else {
            con.query("select SCH_STR_Employees.id,job_title.name as job_title_name from SCH_STR_Employees join job_title on SCH_STR_Employees.jobtitle_id = job_title.id where job_no = ?", [empData.job_no], function (err, result) {
                console.log('here');
                console.log(result);
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    console.log('found');
                    response.success = false;
                    response.msg = 'الموظف موجود مسبقا';
                    if(result[0].job_title_name == 'معلم' && empData.job_name == 'قائد مدرسة'){
                        con.query('update SCH_STR_Employees set identity_no = ? ,id_date = ?, school_id = ? ,name = ? ,jobtitle_id = ? ,nationality = ? ,birthdate = ? ,birth_place = ? ,educational_level = ? ,graduate_year = ? ,major = ? ,job_no = ? ,ministry_start_date = ? ,school_start_date = ? ,current_position_date = ? ,degree = ? ,address = ? ,phone1 = ? ,phone2 = ? ,mobile = ? ,email = ? ,postal_code = ? ,lectures_qouta = ? ,kids = ? ,kids_under6 = ? ,kids_under24 = ? ,kids_over24 = ? ,notes = ? ,last_update = ? ,updated_by = ? where id = ?',[
                                empData.identity_no,
                                empData.id_date,
                                empData.school_id,
                                empData.name,
                                empData.jobtitle_id,
                                empData.nationality,
                                empData.birthdate,
                                empData.birth_place,
                                empData.educational_level,
                                empData.graduate_year,
                                empData.major,
                                empData.job_no,
                                empData.ministry_start_date,
                                empData.school_start_date,
                                empData.current_position_date,
                                empData.degree,
                                empData.address,
                                empData.phone1,
                                empData.phone2,
                                empData.mobile,
                                empData.email,
                                empData.postal_code,
                                empData.lectures_qouta,
                                empData.kids,
                                empData.kids_under6,
                                empData.kids_under24,
                                empData.kids_over24,
                                empData.notes,
                                empData.last_update,
                                empData.updated_by,
                                result[0].id
                            ]
                            , function (err, result) {
                                if (err)
                                    throw err

                                callback(response);

                            });
                    }
                    callback(response);
                } else {

                    con.query("insert into SCH_STR_Employees (identity_no  ,id_date,school_id ,name ,jobtitle_id  ,nationality  ,birthdate  ,birth_place ,educational_level  ,graduate_year ,major ,job_no ,ministry_start_date  ,school_start_date  ,current_position_date ,degree ,address ,phone1 ,phone2 ,mobile ,email ,postal_code ,lectures_qouta  ,kids  ,kids_under6  ,kids_under24  ,kids_over24  ,notes  ,created,created_by)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ,? ,?,?)",[
                            empData.identity_no,
                            empData.id_date,
                            empData.school_id,
                            empData.name,
                            empData.jobtitle_id,
                            empData.nationality,
                            empData.birthdate,
                            empData.birth_place,
                            empData.educational_level,
                            empData.graduate_year,
                            empData.major,
                            empData.job_no,
                            empData.ministry_start_date,
                            empData.school_start_date,
                            empData.current_position_date,
                            empData.degree,
                            empData.address,
                            empData.phone1,
                            empData.phone2,
                            empData.mobile,
                            empData.email,
                            empData.postal_code,
                            empData.lectures_qouta,
                            empData.kids,
                            empData.kids_under6,
                            empData.kids_under24,
                            empData.kids_over24,
                            empData.notes,
                            empData.created,
                            empData.created_by], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم الاضافه بنجاح'
                                response.id = result.insertId ;
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

    setEmployeeUser : function (req, res, callback) {
        var empData = req.body.empData;
        var response = {};
        if (empData.id) {
            con.query("select * from SCH_STR_Employees where id = ?", [empData.id], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update SCH_STR_Employees set userId = ? where id = ?',[
                            empData.userId,
                            empData.id
                        ]
                        , function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
                                response.id = empData.id;
                                response.msg = 'تم التعديل بنجاح'
                            } else {
                                response.success = false;
                                response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                            }

                            callback(response);

                        }
                    );
                } else {
                    response.success = false;
                    response.msg = 'لا يمكن العثور على الموظف الرجاء المحاوله مره اخرى';
                    callback(response);
                }
            });
        }

    },

    getEmployee: function (req, res, callback) {
        var empId = req.params.empId;
        con.query('select * from SCH_STR_Employees where id = ?', [empId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    deleteEmployee: function (req, res, callback) {
        var empId = req.params.empId;
        var response = {};
        con.query('delete from SCH_STR_Employees where id = ?', [empId], function (err, result) {
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                    response.msg = 'تم حذف الموظف بنجاح';
                } else {
                    response.success = false;
                    response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    },
    UploadExcel: function (req, res, callback) {
        try {
            //
            console.log('File Name : ', req.body.filename);
            var workbook = new Excel.Workbook();
            var data = {};
            var schoolId = req.body.schoolId;
            workbook.xlsx.readFile('./src/client/app/uploads/' + req.body.filename)
                .then(function () {
                    var finalEmployees = [];
                    workbook.eachSheet(function (worksheet, sheetId) {
                        // var worksheet = workbook.getWorksheet();
                        var job_title = worksheet.getCell('E5').value;
                        console.log('job_title');
                        console.log(job_title);
                        var job_title_id = 0;
                        req.body.name = job_title;
                        jobTitleMethods.getjobTitleByName(req, res, function (result) {
                            if (!Object.keys(result).length) {
                                jobTitleData = {name : job_title};
                                req.body.jobTitleData =  jobTitleData;
                                jobTitleMethods.saveJobTitle(req, res, function (result) {
                                    job_title_id = result.insertId ;
                                    worksheet.eachRow(function (row, rowNumber) {
                                        if(job_title == 'معلم'){
                                            if (rowNumber > 18) {
                                                // var cellNumber = "Q"+rowNumber;
                                                data = {
                                                    school_id : schoolId,
                                                    name: worksheet.getCell('AD'+ rowNumber).value,
                                                    nationality: worksheet.getCell('AC' + rowNumber).value,
                                                    identity_no: worksheet.getCell('AB' + rowNumber).value,
                                                    id_date: worksheet.getCell('X' + rowNumber).value,
                                                    educational_level: worksheet.getCell('W' + rowNumber).value,
                                                    graduate_year: worksheet.getCell('V' + rowNumber).value,
                                                    major: worksheet.getCell('U' + rowNumber).value,
                                                    job_no: worksheet.getCell('T' + rowNumber).value,
                                                    ministry_start_date: worksheet.getCell('R' + rowNumber).value,
                                                    school_start_date: worksheet.getCell('Q' + rowNumber).value,
                                                    current_position_date: worksheet.getCell('O' + rowNumber).value,
                                                    degree: worksheet.getCell('M' + rowNumber).value,
                                                    lectures_qouta: worksheet.getCell('K' + rowNumber).value,
                                                    phone1: worksheet.getCell('I' + rowNumber).value,
                                                    mobile: worksheet.getCell('F' + rowNumber).value,
                                                    email: worksheet.getCell('E' + rowNumber).value,
                                                    notes: worksheet.getCell('D' + rowNumber).value,
                                                    jobtitle_id:job_title_id,
                                                    job_name:job_title

                                                };
                                                req.body.empData = data;

                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                });
                                                finalEmployees.push(data);
                                            }
                                        }else{
                                            if (rowNumber > 15) {
                                                // var cellNumber = "Q"+rowNumber;
                                                data = {
                                                    school_id : schoolId,
                                                    name: worksheet.getCell('V'+ rowNumber).value,
                                                    educational_level: worksheet.getCell('Q' + rowNumber).value,
                                                    graduate_year: worksheet.getCell('M' + rowNumber).value,
                                                    major: worksheet.getCell('R' + rowNumber).value,
                                                    job_no: worksheet.getCell('W' + rowNumber).value,
                                                    current_position: worksheet.getCell('K' + rowNumber).value,
                                                    lectures: worksheet.getCell('J' + rowNumber).value,
                                                    mobile: worksheet.getCell('G' + rowNumber).value,
                                                    email: worksheet.getCell('D' + rowNumber).value,
                                                    signature: worksheet.getCell('C' + rowNumber).value,
                                                    jobtitle_id:job_title_id,
                                                    job_name:job_title
                                                };
                                                req.body.empData = data;
                                                if(data.job_no) {
                                                    employeeMethods.saveEmployee(req, res, function (result) {
                                                    });
                                                    finalEmployees.push(data);
                                                }
                                            }
                                        }

                                    });

                                });
                            }else{
                                job_title_id = result[0].id ;
                                worksheet.eachRow(function (row, rowNumber) {
                                    if(job_title == 'معلم'){
                                        if (rowNumber > 18) {
                                            // var cellNumber = "Q"+rowNumber;
                                            data = {
                                                school_id : schoolId,
                                                name: worksheet.getCell('AD'+ rowNumber).value,
                                                nationality: worksheet.getCell('AC' + rowNumber).value,
                                                identity_no: worksheet.getCell('AB' + rowNumber).value,
                                                id_date: worksheet.getCell('X' + rowNumber).value,
                                                educational_level: worksheet.getCell('W' + rowNumber).value,
                                                graduate_year: worksheet.getCell('V' + rowNumber).value,
                                                major: worksheet.getCell('U' + rowNumber).value,
                                                job_no: worksheet.getCell('T' + rowNumber).value,
                                                ministry_start_date: worksheet.getCell('R' + rowNumber).value,
                                                school_start_date: worksheet.getCell('Q' + rowNumber).value,
                                                current_position_date: worksheet.getCell('O' + rowNumber).value,
                                                degree: worksheet.getCell('M' + rowNumber).value,
                                                lectures_qouta: worksheet.getCell('K' + rowNumber).value,
                                                phone1: worksheet.getCell('I' + rowNumber).value,
                                                mobile: worksheet.getCell('F' + rowNumber).value,
                                                email: worksheet.getCell('E' + rowNumber).value,
                                                notes: worksheet.getCell('D' + rowNumber).value,
                                                jobtitle_id:job_title_id,
                                                job_name:job_title
                                            };
                                            req.body.empData = data;
                                            if(data.job_no) {
                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                });
                                                finalEmployees.push(data);
                                            }
                                        }
                                    }else{
                                        if (rowNumber > 15) {
                                            // var cellNumber = "Q"+rowNumber;
                                            data = {
                                                school_id : schoolId,
                                                name: worksheet.getCell('V'+ rowNumber).value,
                                                educational_level: worksheet.getCell('Q' + rowNumber).value,
                                                graduate_year: worksheet.getCell('M' + rowNumber).value,
                                                major: worksheet.getCell('R' + rowNumber).value,
                                                job_no: worksheet.getCell('W' + rowNumber).value,
                                                current_position: worksheet.getCell('K' + rowNumber).value,
                                                lectures: worksheet.getCell('J' + rowNumber).value,
                                                mobile: worksheet.getCell('G' + rowNumber).value,
                                                email: worksheet.getCell('D' + rowNumber).value,
                                                signature: worksheet.getCell('C' + rowNumber).value,
                                                jobtitle_id:job_title_id,
                                                job_name:job_title

                                            };
                                            req.body.empData = data;
                                            if(data.job_no) {
                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                });
                                                finalEmployees.push(data);
                                            }
                                        }
                                    }


                                });

                            }



                        });





                    });

                    callback(finalEmployees);
                });
        } catch (e) {
            res.json({error_code: 1, err_desc: "Corupted excel file"});
        }
    },
    getEmployees: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select SCH_STR_Employees.*,sys_users.is_active from SCH_STR_Employees left join sys_users on SCH_STR_Employees.userId = sys_users.id where school_id = ?',[schoolId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    updatePhoto: function (req, res, callback) {
        con.query(" update SCH_STR_Employees set photo_file=? where id = ?",
            [req.body.photoFile,
                req.body.id
            ], function (err, result) {
                var response = {};
                if (err)
                    throw err
                if (result.affectedRows) {
                    response.success = true;
                } else {
                    response.success = false;
                    response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                }
                callback(response);
            }
        );
    }
};


module.exports = employeeMethods;