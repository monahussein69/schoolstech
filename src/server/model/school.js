var con = require('../routes/dbConfig.js');
var jobTitleMethods = require('../model/jobTitle.js');
const sequelizeConfig = require('../routes/sequelizeConfig');
var Excel = require('exceljs');
var underscore = require('underscore/underscore.js');
var fs = require("fs");
var util = require('util');


var schoolMethods = {
        saveSchool: function (req, res, callback) {
            var schoolData = req.body.schoolData;
            var response = {};
            if (schoolData.schoolId) {
                con.query("select * from sch_school where id = ?", [schoolData.schoolId], function (err, result) {
                 try{
                    if (!schoolData.config_steps) {
                        schoolData.config_steps = result[0].config_steps;
                    }
                    if (!schoolData.userId) {
                        schoolData.userId = result[0].config_steps;
                    }
                    if (err)
                        throw err;
                    if (Object.keys(result).length) {
                        con.query(" update sch_school set userId=?,name = ? , gender = ?,educationalOffice=?,educationalRegion=?,educationLevel=?, address=?,totalClasses=? ,totalStudents =?,totalStaff=?,rentedBuildings=?,governmentBuildings=?,foundationYear=?,schoolNum=?,config_steps =? where id = ?",
                            [schoolData.userId,
                                schoolData.name,
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
                                schoolData.schoolNum,
                                schoolData.config_steps,
                                schoolData.schoolId
                            ], function (err, result) {
                                if (err)
                                    throw err
                                if (result.affectedRows) {
                                    response.success = true;
                                    response.id = schoolData.schoolId;
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
                        response.msg = 'لا يمكن العثور على المدرسه , الرجاء المحاوله مره اخري';
                        callback(response);
                    }

                }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
                });
            } else {
                con.query("select * from sch_school where schoolNum = ?", [schoolData.schoolNum], function (err, result) {
                  try{
                    console.log('here');
                    console.log(result);
                    if (err)
                        throw err;
                    if (Object.keys(result).length) {
                        console.log('found');
                        response.success = false;
                        response.msg = 'المدرسه موجوده مسبقا';
                        callback(response);
                    } else {

                        con.query(" insert into sch_school  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,schoolNum) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            [
                                schoolData.name,
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
                                schoolData.schoolNum
                            ], function (err, result) {
                         try{
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

        getLectursTable: function (schoolId) {
            return new Promise(function (resolve, reject) {
                var response = {};
                var query = con.query("select sch_acd_lecturestables.* , sch_acd_lectures.name as lecture_name , sch_bui_rooms.name as room_name , " +
                    " sch_acd_sections.Name as section_name , app_def_courses.Course_Name as course_name , sch_str_employees.name as teacher_name from sch_acd_lecturestables " +
                    " JOIN app_def_courses ON app_def_courses.id = sch_acd_lecturestables.Course_Id" +
                    " JOIN sch_acd_sections ON sch_acd_sections.id = sch_acd_lecturestables.Section_Id" +
                    " JOIN sch_bui_rooms ON sch_bui_rooms.id = sch_acd_lecturestables.ClassRoom_Id" +
                    " JOIN sch_str_employees ON sch_str_employees.id = sch_acd_lecturestables.Teacher_Id" +
                    " JOIN sch_acd_lectures ON sch_acd_lectures.id = sch_acd_lecturestables.Lecture_NO" +
                    " where sch_acd_lecturestables.School_Id = ? ORDER BY sch_acd_lectures.id ASC ", [schoolId], function (err, result) {
                    console.log('query : ', query.sql);
                 try{
                    if (err)
                        throw err;
                    if (result.length) {
                        console.log('exists');
                        resolve(result);
                    } else {
                        resolve(0);
                    }

                }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
                });
            });
        },

        updatePhoto: function (req, res, callback) {
            con.query(" update sch_school set logoFile=? where id = ?",
                [req.body.logoFile,
                    req.body.id
                ], function (err, result) {

                try{
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

                }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
                }
            );
        }
        ,


        saveSchools: function (req, res, callback) {
            var schoolsData = req.body.schoolsData;
            console.log('in obj11');
            console.log(schoolsData);
            var response = {};
            schoolsData.foreach(function (schoolData) {
                con.query("select * from sch_school where schoolNum = ?", [schoolData.schoolNum], function (err, result) {
                 try{
                    if (err)
                        throw err;
                    if (!Object.keys(result).length) {
                        console.log('in obj');
                        con.query(" insert into sch_school  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,logoFile) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                            [schoolData.name,
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
                            ], function (err, result) {
                                if (err)
                                    throw err


                            }
                        );
                    }

                }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
                });


            });

            response.success = true;
            response.msg = 'تم الاضافه بنجاح';

            callback(response);
        }
        ,
        getSchool: function (req, res, callback) {
            var schoolId = req.params.schoolId;
            con.query('select * from sch_school where id = ?', [schoolId], function (err, result) {
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
        }
        ,

        deleteSchool: function (req, res, callback) {
            var schoolId = req.params.schoolId;
            var response = {};
            con.query('delete from sch_school where id = ?', [schoolId], function (err, result) {
             try{
                    if (err)
                        throw err
                    if (result.affectedRows) {
                        response.success = true;
                        response.msg = 'تم حذف المدرسه بنجاح';
                    } else {
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
        }
        ,
        UploadExcel: async function (req, res, callback) {
            try {
                //
                console.log('File Name : ', req.body.filename);
                var workbook = new Excel.Workbook();
                var data = {};
                var sectionData = {};
                var courseData = {};
                var roomData = {};
                var teacherData = {};
                var lectureData = {};
                var sections = [];
                var courses = [];
                var rooms = [];
                var teachers = [];

                workbook.xlsx.readFile('./src/client/app/uploads/' + req.body.filename)
                    .then(function () {
                        if (req.body.type == 'school') {
                            var finalSchools = [];
                            workbook.eachSheet(function (worksheet, sheetId) {
                                // var worksheet = workbook.getWorksheet();
                                worksheet.eachRow(async function (row, rowNumber) {
                                    if (rowNumber > 10) {
                                        // var cellNumber = "Q"+rowNumber;
                                        data = {
                                            educationalRegion: worksheet.getCell('U2').value,
                                            educationalOffice: worksheet.getCell('Q' + rowNumber).value,
                                            name: worksheet.getCell('V' + rowNumber).value,
                                            schoolNum: worksheet.getCell('U' + rowNumber).value,
                                            gender: worksheet.getCell('S' + rowNumber).value,
                                            educationLevel: worksheet.getCell('R' + rowNumber).value,
                                            address: worksheet.getCell('P' + rowNumber).value,
                                            totalClasses: worksheet.getCell('I' + rowNumber).value,
                                            totalStudents: worksheet.getCell('H' + rowNumber).value,
                                            totalStaff: worksheet.getCell('G' + rowNumber).value,
                                            rentedBuildings: worksheet.getCell('E' + rowNumber).value,
                                            governmentBuildings: worksheet.getCell('B' + rowNumber).value,
                                            foundationYear: worksheet.getCell('F' + rowNumber).value,
                                            logoFile: null,
                                        };
                                        req.body.schoolData = data;
                                        schoolMethods.saveSchool(req, res, function (result) {
                                            console.log(result);
                                        });
                                        finalSchools.push(data);
                                    }
                                });
                            });

                            callback(finalSchools);
                        } else if (req.body.type == 'schoolSchedule') {
                            // return new Promise(function (resolve, reject) {
                            var promises = [];
                            let allCells = [];
                            workbook.eachSheet(async function (worksheet, sheetId) {
                                // var worksheet = workbook.getWorksheet();
                                var cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

                                worksheet.eachRow(async function (row, rowNumber) {
                                    cols.map(async function (col) {
                                        if (rowNumber >= 4) {
                                            let data = {};
                                            var nextRow = rowNumber + 1;
                                            var nextRow2 = rowNumber + 2;
                                            var cell = worksheet.getCell(col + '' + rowNumber).value;
                                            if (cell) {
                                                if (cell.indexOf("الشعبة") >= 0) {
                                                    data.section_name = cell.split('/')[1].trim();
                                                    data.course_name = cell.split('/')[0];
                                                    data.teacher_name = worksheet.getCell(col + '' + nextRow).value;
                                                    data.room_name = worksheet.getCell(col + '' + nextRow2).value;
                                                    data.lecture_name = worksheet.getCell(col + '4').value;
                                                    data.day = worksheet.getCell('A' + rowNumber).value;
                                                    allCells.push(data);
                                                }
                                            }
                                        }

                                    });
                                });
                            });
                            console.log('all cells : ', allCells.length);
                            let counter = 0;
                            let schoolId = parseInt(req.body.schoolId);

                            function addCourseToDB(allCells) {
                                if (allCells[counter]) {
                                    let coursePromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.courseTable.findOrCreate({where: {Course_Name: allCells[counter].course_name.trim()}})
                                            .spread((course, created) => {
                                                resolve(course.id);
                                                console.log('created ?   : ', created);

                                            });
                                    });

                                    let sectionPromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.sectionsTable.findOrCreate({
                                            where: {Name: allCells[counter].section_name.trim()},
                                            defaults: {School_Id: schoolId}
                                        })
                                            .spread((section, created) => {
                                                console.log('section  : ', section.id);
                                                console.log('created ?   : ', created);
                                                resolve(section.id);
                                            });
                                    });
                                    let roomPromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.roomsTable.findOrCreate({
                                            where: {
                                                Name: allCells[counter].room_name.trim()
                                            },
                                            defaults: {school_id: schoolId, room_type: 1}
                                        })
                                            .spread((room, created) => {
                                                console.log('section  : ', room.id);
                                                console.log('created ?   : ', created);
                                                resolve(room.id);
                                            });
                                    });
                                    let teacherPromise = new Promise(function (resolve, reject) {
                                        req.body.name = 'معلم';
                                        jobTitleMethods.getjobTitleByName(req, res, function (result) {
                                            if (Object.keys(result).length) {
                                                job_title_id = result[0].id;
                                                sequelizeConfig.teachersTable.findOrCreate({
                                                    where: {name: allCells[counter].teacher_name.trim()},
                                                    defaults: {school_id: schoolId,jobtitle_id:job_title_id}
                                                })
                                                    .spread((teacher, created) => {
                                                    console.log('section  : ', teacher.id);
                                                console.log('created ?   : ', created);
                                                resolve(teacher.id);
                                            });
                                            }else{
                                                jobTitleData = {name : 'معلم'};
                                                req.body.jobTitleData =  jobTitleData;
                                                jobTitleMethods.saveJobTitle(req, res, function (result) {
                                                    job_title_id = result.insertId;

                                                    teachersTable.findOrCreate({
                                                        where: {name: allCells[counter].teacher_name.trim()},
                                                        defaults: {school_id: schoolId,jobtitle_id:job_title_id}
                                                    })
                                                        .spread((teacher, created) => {
                                                        console.log('section  : ', teacher.id);
                                                    console.log('created ?   : ', created);
                                                    resolve(teacher.id);
                                                });

                                                });

                                            }


                                        });

                                    });

                                    let lecturePromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.lectureTable.findOrCreate({where: {name: allCells[counter].lecture_name.trim()}})
                                            .spread((lecture, created) => {
                                                console.log('section  : ', lecture.id);
                                                console.log('created ?   : ', created);
                                                resolve(lecture.id);
                                            });
                                    });
                                    Promise.all([sectionPromise, coursePromise, roomPromise, teacherPromise, lecturePromise]).then(function (data) {
                                        console.log(data);
                                        sequelizeConfig.mainLecturesTable.create({
                                            School_Id: schoolId,
                                            Day: allCells[counter].day,
                                            Lecture_NO: data[4],
                                            Course_Id: data[1],
                                            Section_Id: data[0],
                                            ClassRoom_Id: data[2],
                                            Teacher_Id: data[3]
                                        })
                                            .then(function (err, socialUrl) {
                                                if (err) {
                                                    console.log("error : ", err);
                                                    // log error;
                                                } else {
                                                    console.log("YEEEEEEEEEEEEEEES");
                                                    // Do stuff
                                                }
                                            })
                                        counter++;
                                        addCourseToDB(allCells);
                                    })

                                }
                            }

                            addCourseToDB(allCells);
                        }
                    });
            } catch
                (e) {
                res.json({error_code: 1, err_desc: "Corupted excel file"});
            }
        }
        ,
        getSchools: function (req, res, callback) {
            var schoolId = req.params.schoolId;
            con.query('select * from sch_school', function (err, result) {
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
        }
        ,
        setSchoolUser: function (req, res, callback) {
            var schoolData = req.body.schoolData;
            var response = {};
            if (schoolData.id) {
                con.query("select * from sch_school where id = ?", [schoolData.id], function (err, result) {
                    try{
                    if (err)
                        throw err;
                    if (Object.keys(result).length) {
                        con.query('update sch_school set userId = ? where id = ?', [
                                schoolData.userId,
                                schoolData.id
                            ]
                            , function (err, result) {
                            try{
                                if (err)
                                    throw err
                                if (result.affectedRows) {
                                    response.success = true;
                                    response.id = schoolData.id;
                                    response.msg = 'تم التعديل بنجاح'
                                } else {
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
                    } else {
                        response.success = false;
                        response.msg = 'لا يمكن العثور على الموظف الرجاء المحاوله مره اخرى';
                        callback(response);
                    }

                }catch(ex){
                    var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                    log_file_err.write(util.format('Caught exception: '+err) + '\n');
                    callback(ex);
                }
                });
            }
        },
		
		countSchools:function(req,res,callback){
		var response = {};
		 con.query('select count(*) as schools from sch_school ',function(err,result){
             try{
                if(err)
                    throw err
                response.count = result[0].schools;
                callback(response);

         }catch(ex){
                var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
                log_file_err.write(util.format('Caught exception: '+err) + '\n');
                callback(ex);
            }
            });
	   }
    }
;


module.exports = schoolMethods;