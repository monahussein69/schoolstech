var con = require('../routes/dbConfig.js');
var jobTitleMethods = require('../model/jobTitle.js');
var subJobTitleMethods = require('../model/subJobTitle.js');
var workingSettingsMethods = require('../model/schedualProfile.js');
var userMethods = require('../model/user.js');
var Excel = require('exceljs');
const saltRounds = 10;
var randomstring = require("randomstring");
var bcrypt = require('bcrypt');

var employeeMethods = {
    saveEmployee: function (req, res, callback) {
        var empData = req.body.empData;
        var response = {};
        if (empData.id) {
            con.query("select * from sch_str_employees where id = ?", [empData.id], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update sch_str_employees set identity_no = ? ,id_date = ?, school_id = ? ,name = ? ,jobtitle_id = ? ,nationality = ? ,birthdate = ? ,birth_place = ? ,educational_level = ? ,graduate_year = ? ,major = ? ,job_no = ? ,ministry_start_date = ? ,school_start_date = ? ,current_position_date = ? ,degree = ? ,address = ? ,phone1 = ? ,phone2 = ? ,mobile = ? ,email = ? ,postal_code = ? ,lectures_qouta = ? ,kids = ? ,kids_under6 = ? ,kids_under24 = ? ,kids_over24 = ? ,notes = ? ,last_update = ? ,updated_by = ? where id = ?', [
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
                            console.log(result);
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
            con.query("select sch_str_employees.id,job_title.name as job_title_name from sch_str_employees join job_title on sch_str_employees.jobtitle_id = job_title.id where job_no = ?", [empData.job_no], function (err, result) {
                console.log('here');
                console.log(result);
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    console.log('found');
                    response.success = false;
                    response.msg = 'الموظف موجود مسبقا';
                    if (result[0].job_title_name == 'معلم' && empData.job_name == 'قائد مدرسة') {
                        con.query('update sch_str_employees set identity_no = ? ,id_date = ?, school_id = ? ,name = ? ,jobtitle_id = ? ,nationality = ? ,birthdate = ? ,birth_place = ? ,educational_level = ? ,graduate_year = ? ,major = ? ,job_no = ? ,ministry_start_date = ? ,school_start_date = ? ,current_position_date = ? ,degree = ? ,address = ? ,phone1 = ? ,phone2 = ? ,mobile = ? ,email = ? ,postal_code = ? ,lectures_qouta = ? ,kids = ? ,kids_under6 = ? ,kids_under24 = ? ,kids_over24 = ? ,notes = ? ,last_update = ? ,updated_by = ? where id = ?', [
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

                    con.query("insert into sch_str_employees (identity_no  ,id_date,school_id ,name ,jobtitle_id  ,nationality  ,birthdate  ,birth_place ,educational_level  ,graduate_year ,major ,job_no ,ministry_start_date  ,school_start_date  ,current_position_date ,degree ,address ,phone1 ,phone2 ,mobile ,email ,postal_code ,lectures_qouta  ,kids  ,kids_under6  ,kids_under24  ,kids_over24  ,notes  ,created,created_by)  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ,? ,?,?)", [
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
                                response.id = result.insertId;

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

    setEmployeeUser: function (req, res, callback) {
        var empData = req.body.empData;
        var response = {};
        if (empData.id) {
            con.query("select * from sch_str_employees where id = ?", [empData.id], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query('update sch_str_employees set userId = ? where id = ?', [
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
        con.query('select * from sch_str_employees where id = ?', [empId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    getEmployeeByUserId: function (req, res, callback) {
        var userId = req.params.userId;
        con.query('select * from sch_str_employees where userId = ?', [userId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

    deleteEmployee: function (req, res, callback) {
        var empId = req.params.empId;
        var response = {};
        con.query('delete from sch_str_employees where id = ?', [empId], function (err, result) {
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

            var counter = 0;
            workbook.xlsx.readFile('./src/client/app/uploads/' + req.body.filename)
                .then(function () {
                    var finalEmployees = [];
                    workbook.eachSheet(function (worksheet, sheetId) {
                        // var worksheet = workbook.getWorksheet();
                        var job_title = worksheet.getCell('E5').value;

                        var job_title_id = 0;

                        req.body.name = job_title;
                        jobTitleMethods.getjobTitleByName(req, res, function (result) {
                            if (!Object.keys(result).length) {
                                jobTitleData = {name: job_title};
                                req.body.jobTitleData = jobTitleData;
                                jobTitleMethods.saveJobTitle(req, res, function (result) {
                                    job_title_id = result.insertId;
                                    worksheet.eachRow(function (row, rowNumber) {
                                        if (job_title == 'معلم') {
                                            if (rowNumber > 18) {
                                                // var cellNumber = "Q"+rowNumber;
                                                data = {
                                                    school_id: schoolId,
                                                    name: worksheet.getCell('AD' + rowNumber).value,
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
                                                    jobtitle_id: job_title_id,
                                                    job_name: job_title

                                                };
                                                if (data.job_no) {
                                                    finalEmployees.push(data);
                                                }
                                               /* req.body.empData = data;

                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                    if (result.success) {
                                                        finalEmployees.push(data);
                                                    }
                                                });*/

                                            }
                                        } else {
                                            if (rowNumber > 15) {
                                                // var cellNumber = "Q"+rowNumber;
                                                data = {
                                                    school_id: schoolId,
                                                    name: worksheet.getCell('V' + rowNumber).value,
                                                    educational_level: worksheet.getCell('Q' + rowNumber).value,
                                                    graduate_year: worksheet.getCell('M' + rowNumber).value,
                                                    major: worksheet.getCell('R' + rowNumber).value,
                                                    job_no: worksheet.getCell('W' + rowNumber).value,
                                                    current_position: worksheet.getCell('K' + rowNumber).value,
                                                    lectures: worksheet.getCell('J' + rowNumber).value,
                                                    mobile: worksheet.getCell('G' + rowNumber).value,
                                                    email: worksheet.getCell('D' + rowNumber).value,
                                                    signature: worksheet.getCell('C' + rowNumber).value,
                                                    jobtitle_id: job_title_id,
                                                    job_name: job_title
                                                };
                                                if (data.job_no) {
                                                    finalEmployees.push(data);
                                                }
                                                /*req.body.empData = data;
                                                if (data.job_no) {
                                                    employeeMethods.saveEmployee(req, res, function (result) {
                                                        if (result.success) {
                                                            finalEmployees.push(data);
                                                        }
                                                    });

                                                }*/
                                            }
                                        }

                                    });

                                });
                            } else {
                                job_title_id = result[0].id;
                                worksheet.eachRow(function (row, rowNumber) {
                                    if (job_title == 'معلم') {
                                        if (rowNumber > 18) {
                                            // var cellNumber = "Q"+rowNumber;
                                            data = {
                                                school_id: schoolId,
                                                name: worksheet.getCell('AD' + rowNumber).value,
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
                                                jobtitle_id: job_title_id,
                                                job_name: job_title
                                            };
                                            if (data.job_no) {
                                                finalEmployees.push(data);
                                            }
                                            /*req.body.empData = data;
                                            if (data.job_no) {
                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                    if (result.success) {
                                                        finalEmployees.push(data);
                                                    }
                                                });
                                            }*/
                                        }
                                    } else {
                                        if (rowNumber > 15) {
                                            // var cellNumber = "Q"+rowNumber;
                                            data = {
                                                school_id: schoolId,
                                                name: worksheet.getCell('V' + rowNumber).value,
                                                educational_level: worksheet.getCell('Q' + rowNumber).value,
                                                graduate_year: worksheet.getCell('M' + rowNumber).value,
                                                major: worksheet.getCell('R' + rowNumber).value,
                                                job_no: worksheet.getCell('W' + rowNumber).value,
                                                current_position: worksheet.getCell('K' + rowNumber).value,
                                                lectures: worksheet.getCell('J' + rowNumber).value,
                                                mobile: worksheet.getCell('G' + rowNumber).value,
                                                email: worksheet.getCell('D' + rowNumber).value,
                                                signature: worksheet.getCell('C' + rowNumber).value,
                                                jobtitle_id: job_title_id,
                                                job_name: job_title

                                            };

                                            if (data.job_no) {
                                                finalEmployees.push(data);
                                            }
                                            /*req.body.empData = data;
                                            if (data.job_no) {

                                                employeeMethods.saveEmployee(req, res, function (result) {
                                                    console.log('in save');
                                                    console.log(result);
                                                    if (result.success) {
                                                        finalEmployees.push(data);
                                                    }
                                                });
                                            }*/
                                        }
                                    }


                                });

                            }

                            console.log('finalEmployees');
                            console.log(finalEmployees);


                            var requests = finalEmployees.map(function(item) {
                                return new Promise(function(resolve) {
                                    req.body.empData = item;
                                    employeeMethods.saveEmployee(req, res, function (result) {
                                        if (result.success) {
                                            counter = counter + 1;
                                            item.id = result.id;

                                        }
                                        resolve(result);
                                    });
                                });
                            });

                            Promise.all(requests).then(function (result) {
                                console.log(result);

                                var response = {};
                                if (counter == 1 && job_title == 'قائد مدرسة') {
                                    var employee = finalEmployees[0];
                                    console.log('emp');
                                    console.log(employee);
                                    var userPassword = randomstring.generate({
                                        length: 7,
                                        charset: 'numeric'
                                    });
                                    var hash = bcrypt.hashSync(userPassword, saltRounds);
                                    var userData =
                                        {
                                            'schoolId': employee.school_id,
                                            'userType': 3,
                                            'loginName': employee.mobile,
                                            'password': userPassword,
                                            'groupId': 0,
                                            'PasswordHash': hash,
                                            'is_active': 1,
                                            'isLeader': 1

                                        };

                                    req.body.userData = userData;
                                    req.body.employeeId = employee.id;
                                    employeeMethods.setLeaderUser(req, res, function (result) {

                                    });
                                }
                                if (counter) {
                                    response.msg = 'تم اضافه ' + counter + ' ' + job_title;
                                    response.status = true;
                                } else {
                                    response.msg = 'الموظف موجود مسبقا';
                                    response.status = false;
                                }

                                callback(response);
                            });




                            //callback(finalEmployees);

                        });


                    });


                    resolve(finalEmployees);

                });
        } catch (e) {
            res.json({error_code: 1, err_desc: "Corupted excel file"});
        }
    },
    getEmployees: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select sch_str_employees.*,sys_users.is_active,job_title.name as job_title_name from sch_str_employees left join sys_users on sch_str_employees.userId = sys_users.id  left join job_title on sch_str_employees.jobtitle_id = job_title.id  where school_id = ?', [schoolId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },
    getAllTeachers: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select sch_str_employees.*,sys_users.is_active,job_title.name as job_title_name from sch_str_employees left join sys_users on sch_str_employees.userId = sys_users.id  left join job_title on sch_str_employees.jobtitle_id = job_title.id  where school_id = ? AND job_title.name = "معلم" ', [schoolId], function (err, result) {
                if (err)
                    throw err
                callback(result);
            }
        );
    },

    getEmployeesBasedJob: function (req, res, callback) {
        var schoolId = req.body.schoolId;
        var job_title = req.body.job_title;
        var sub_job_title = req.body.sub_job_title;

        if (job_title == 'قائد مدرسة الحالي') {
            job_title = 'قائد مدرسة';
            con.query('select sch_str_employees.*,sys_users.is_active from sch_str_employees ' +
                'inner join job_title on sch_str_employees.jobtitle_id = job_title.id ' +
                'inner join sys_users on sch_str_employees.userId = sys_users.id where school_id = ? and job_title.name =? and sys_users.isLeader = 1', [schoolId, job_title], function (err, result) {
                    if (err)
                        throw err

                    callback(result);
                }
            );
        } else {

            if (sub_job_title) {
                var query = con.query('select sch_str_employees.*,sys_users.is_active from sch_str_employees ' +
                    'inner join job_title on sch_str_employees.jobtitle_id = job_title.id ' +
                    'inner join sub_job_title on sch_str_employees.subjobtitle_id = sub_job_title.id ' +
                    'left join sys_users on sch_str_employees.userId = sys_users.id where school_id = ? and job_title.name =? and sub_job_title.name = ?', [schoolId, job_title, sub_job_title], function (err, result) {
                        console.log(query.sql);
                        if (err)
                            throw err

                        callback(result);
                    }
                );
            } else {
                con.query('select sch_str_employees.*,sys_users.is_active from sch_str_employees ' +
                    'inner join job_title on sch_str_employees.jobtitle_id = job_title.id ' +
                    'left join sys_users on sch_str_employees.userId = sys_users.id where school_id = ? and job_title.name =?', [schoolId, job_title], function (err, result) {
                        if (err)
                            throw err

                        callback(result);
                    }
                );
            }
        }
    },

    getEmployeesBasedActivity: function (req, res, callback) {
        var currentDay = workingSettingsMethods.getArabicDay(new Date().getDay());
        var schoolId = req.body.schoolId;
        var lecture_name = req.body.lecture_name;
        var query = con.query('select sch_str_employees.* from sch_acd_lecturestables join sch_acd_lectures ' +
            'on sch_acd_lecturestables.Lecture_NO = sch_acd_lectures.id ' +
            'join sch_str_employees on sch_acd_lecturestables.Teacher_Id = sch_str_employees.id ' +
            'where sch_acd_lectures.name = ? and sch_acd_lecturestables.Day = ? and sch_acd_lecturestables.School_Id = ?', [lecture_name, currentDay, schoolId], function (err, result) {

                if (err)
                    throw err

                callback(result);
            }
        );
    },

    getActivityByEmployeeId: function (req, res, callback) {
         var currentDay = employeeMethods.getArabicDay(new Date(req.body.date).getDay());
        var currentDay1 = currentDay;
        if(currentDay ==  'الاحد'){
            currentDay1 = 'الأحد';
        }
        if(currentDay ==  'الاثنين'){
            currentDay1 = 'الأثنين';
        }
        if(currentDay ==  'الاربعاء'){
            currentDay1 = 'الأربعاء';
        }
        var employeeId = req.body.employeeId;
        var query = con.query('SELECT * FROM sch_acd_lectures JOIN sch_acd_lecturestables ON sch_acd_lectures.id = sch_acd_lecturestables.Lecture_NO  join sch_att_schedule on sch_att_schedule.event_Nam = sch_acd_lectures.name  WHERE sch_acd_lecturestables.Teacher_Id = ? AND (sch_acd_lecturestables.Day = ? OR sch_acd_lecturestables.Day = ?)  AND (sch_att_schedule.Day = ? OR sch_att_schedule.Day = ?)', [employeeId, currentDay,currentDay1, currentDay,currentDay1], function (err, result) {
                console.log(query.sql);
                if (err)
                    throw err
                callback(result);
            }
        );
    },
    getArabicDay: function (dayNo) {
        var array = [];
        array[0] = 'الاحد';
        array[1] = 'الاثنين';
        array[2] = 'الثلاثاء';
        array[3] = 'الاربعاء';
        array[4] = 'الخميس';
        array[5] = 'الجمعة';
        array[6] = 'السبت';
        return array[dayNo];
    },

    updatePhoto: function (req, res, callback) {
        con.query(" update sch_str_employees set photo_file=? where id = ?",
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
    },

    setEmpPostions: function (req, res, callback) {
        var agents = req.body.agentsObj;
        var success = 0;
        var response = [];
        if (agents.schoolLeader) {
            var promise1 = new Promise(function (resolve, reject) {
                req.body.name = 'قائد مدرسة';
                jobTitleMethods.getjobTitleByName(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var job_title_id = result[0].id;
                        con.query("update sch_str_employees set jobtitle_id =? where id = ?", [job_title_id, agents.schoolLeader], function (err, result) {
                            if (err)
                                throw err;
                            if (result.affectedRows) {
                                success = 1;
                                req.params.empId = agents.schoolLeader;
                                employeeMethods.getEmployee(req, res, function (result) {
                                    if (Object.keys(result).length) {
                                        var employee = result[0];
                                        var userPassword = randomstring.generate({
                                            length: 7,
                                            charset: 'numeric'
                                        });
                                        var hash = bcrypt.hashSync(userPassword, saltRounds);
                                        var userData =
                                            {
                                                'schoolId': employee.school_id,
                                                'userType': 3,
                                                'loginName': employee.mobile,
                                                'password': userPassword,
                                                'groupId': 0,
                                                'PasswordHash': hash,
                                                'is_active': 1,
                                                'isLeader': 1

                                            };

                                        req.body.userData = userData;
                                        req.body.employeeId = employee.id;
                                        employeeMethods.setLeaderUser(req, res, function (result) {

                                        });

                                    }
                                });

                                resolve(success);
                            } else {
                                success = 0;
                                reject(success);
                            }

                        });
                    }
                });

            });
            response.push(promise1);
        }


        if (agents.studentAgent) {
            var promise2 = new Promise(function (resolve, reject) {
                req.body.name = 'وكيل';
                jobTitleMethods.getjobTitleByName(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var job_title_id = result[0].id;
                        req.body.name = 'وكيل المدرسة للشؤون الطلاب';
                        subJobTitleMethods.getSubJobTitleByName(req, res, function (result) {

                            if (Object.keys(result).length) {
                                var sub_job_title_id = result[0].id;
                                var query = con.query("update sch_str_employees set jobtitle_id =?,subjobtitle_id = ? where id = ?", [job_title_id, sub_job_title_id, agents.studentAgent], function (err, result) {
                                    if (err)
                                        throw err;
                                    if (result.affectedRows) {
                                        success = 1;
                                        resolve(success);
                                    } else {
                                        success = 0;
                                        reject(success);
                                    }
                                });
                            }

                        });


                    }
                });

            });
            response.push(promise2);
        }

        if (agents.educationAgent) {
            var promise3 = new Promise(function (resolve, reject) {

                req.body.name = 'وكيل';
                jobTitleMethods.getjobTitleByName(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var job_title_id = result[0].id;
                        req.body.name = 'وكيل المدرسة للشؤون التعليمية';
                        subJobTitleMethods.getSubJobTitleByName(req, res, function (result) {

                            if (Object.keys(result).length) {
                                var sub_job_title_id = result[0].id;
                                con.query("update sch_str_employees set jobtitle_id =?,subjobtitle_id = ? where id = ?", [job_title_id, sub_job_title_id, agents.educationAgent], function (err, result) {
                                    if (err)
                                        throw err;
                                    if (result.affectedRows) {
                                        success = 1;
                                        resolve(success);
                                    } else {
                                        success = 0;
                                        reject(success);
                                    }
                                });
                            }

                        });


                    }
                });

            });
            response.push(promise3);
        }

        if (agents.schoolAgent) {
            var promise4 = new Promise(function (resolve, reject) {

                req.body.name = 'وكيل';
                jobTitleMethods.getjobTitleByName(req, res, function (result) {
                    if (Object.keys(result).length) {
                        var job_title_id = result[0].id;
                        req.body.name = 'وكيل المدرسة للشؤون المدرسية';
                        subJobTitleMethods.getSubJobTitleByName(req, res, function (result) {

                            if (Object.keys(result).length) {
                                var sub_job_title_id = result[0].id;
                                con.query("update sch_str_employees set jobtitle_id =?,subjobtitle_id = ? where id = ?", [job_title_id, sub_job_title_id, agents.schoolAgent], function (err, result) {
                                    if (err)
                                        throw err;
                                    if (result.affectedRows) {
                                        success = 1;
                                        resolve(success);
                                    } else {
                                        success = 0;
                                        reject(success);
                                    }
                                });
                            }

                        });


                    }
                });


            });
            response.push(promise4);
        }


        Promise.all(response).then(function (finalResponse) {
            var result = {};
            if (finalResponse.includes(1)) {
                result.msg = 'تم التعديل بنجاح';
                result.success = true;
            } else {
                result.msg = 'خطأ الرجاء المحاوله مره اخرى';
                result.success = false;
            }
            callback(result);

        });

    },


    setLeaderUser: function (req, res, callback) {
        var userData = req.body.userData;
        var employeeId = req.body.employeeId;
        var response = {};
        con.query(" update sys_users set isLeader = 0 where schoolId = ?",
            [
                userData.schoolId
            ], function (err, result) {
                if (err)
                    throw err
                if (result) {
                    if (userData.loginName) {
                        con.query("select * from sys_users where loginName = ?", [userData.loginName], function (err, result) {
                            if (err)
                                throw err;

                            if (Object.keys(result).length) {
                                var user_id = result[0].id;
                                con.query(" update sys_users set isLeader = 1 where id = ?",
                                    [
                                        user_id
                                    ], function (err, result) {
                                        if (err)
                                            throw err
                                        if (result.affectedRows) {
                                            response.success = true;
                                            response.msg = 'تم الحفظ بنجاح';
                                            response.insertId = user_id;
                                            var empData = {'userId': user_id, 'id': employeeId};
                                            req.body.empData = empData;
                                            console.log('employee user');
                                            console.log(empData);
                                            employeeMethods.setEmployeeUser(req, res, function (result) {
                                            });

                                        } else {
                                            response.success = false;
                                            response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                                        }

                                        callback(response);

                                    }
                                );
                            } else {
                                con.query(" insert into sys_users  (schoolId,userType,loginName,password,groupId,PasswordHash,is_active,isLeader) values(?,?,?,?,?,?,?,1)",
                                    [userData.schoolId,
                                        userData.userType,
                                        userData.loginName,
                                        userData.password,
                                        userData.groupId,
                                        userData.PasswordHash,
                                        userData.is_active,], function (err, result) {
                                        if (err)
                                            throw err
                                        if (result.affectedRows) {
                                            response.success = true;
                                            response.msg = 'تم الحفظ بنجاح';
                                            response.insertId = result.insertId;
                                            var empData = {'userId': result.insertId, 'id': employeeId};
                                            req.body.empData = empData;
                                            employeeMethods.setEmployeeUser(req, res, function (result) {
                                            });
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

                callback(response);

            }
        );
    }

};


module.exports = employeeMethods;