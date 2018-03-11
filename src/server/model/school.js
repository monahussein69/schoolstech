var con = require('../routes/dbConfig.js');
var Excel = require('exceljs');
var underscore = require('underscore/underscore.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('schooltech', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false // true by default
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const sectionsTable = sequelize.define('sch_acd_sections', {
    Name: Sequelize.STRING,
});
const courseTable = sequelize.define('app_def_courses', {
    Course_Name: Sequelize.STRING,
});
const roomsTable = sequelize.define('sch_bui_rooms', {
    Name: Sequelize.STRING,
    room_type: Sequelize.STRING
});
const teachersTable = sequelize.define('sch_str_employees', {
    school_id : Sequelize.INTEGER,
    name: Sequelize.STRING

});
const lectureTable = sequelize.define('sch_acd_lectures', {
    name: Sequelize.STRING,
});
const mainLecturesTable = sequelize.define('sch_acd_lecturestables', {
    School_Id: Sequelize.INTEGER,
    Day: Sequelize.STRING,
    Lecture_NO: Sequelize.INTEGER,
    Course_Id: Sequelize.INTEGER,
    Section_Id: Sequelize.INTEGER,
    ClassRoom_Id: Sequelize.INTEGER,
    Teacher_Id: Sequelize.INTEGER,
});


var schoolMethods = {
        saveSchool: function (req, res, callback) {
            var schoolData = req.body.schoolData;
            var response = {};
            if (schoolData.schoolId) {
                con.query("select * from SCH_School where id = ?", [schoolData.schoolId], function (err, result) {
                    if (!schoolData.config_steps) {
                        schoolData.config_steps = result[0].config_steps;
                    }
                    if (!schoolData.userId) {
                        schoolData.userId = result[0].config_steps;
                    }
                    if (err)
                        throw err;
                    if (Object.keys(result).length) {
                        con.query(" update SCH_School set userId=?,name = ? , gender = ?,educationalOffice=?,educationalRegion=?,educationLevel=?, address=?,totalClasses=? ,totalStudents =?,totalStaff=?,rentedBuildings=?,governmentBuildings=?,foundationYear=?,schoolNum=?,config_steps =? where id = ?",
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
                });
            } else {
                con.query("select * from SCH_School where schoolNum = ?", [schoolData.schoolNum], function (err, result) {
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

                        con.query(" insert into SCH_School  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,schoolNum) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                    " where sch_acd_lecturestables.School_Id = ? ", [schoolId], function (err, result) {
                    console.log('query : ', query.sql);
                    if (err)
                        throw err;
                    if (result.length) {
                        console.log('exists');
                        resolve(result);
                    } else {
                        resolve(0);
                    }
                });
            });
        },

        updatePhoto: function (req, res, callback) {
            con.query(" update SCH_School set logoFile=? where id = ?",
                [req.body.logoFile,
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
        ,


        saveSchools: function (req, res, callback) {
            var schoolsData = req.body.schoolsData;
            console.log('in obj11');
            console.log(schoolsData);
            var response = {};
            schoolsData.foreach(function (schoolData) {
                con.query("select * from SCH_School where schoolNum = ?", [schoolData.schoolNum], function (err, result) {
                    if (err)
                        throw err;
                    if (!Object.keys(result).length) {
                        console.log('in obj');
                        con.query(" insert into SCH_School  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,logoFile) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                });


            });

            response.success = true;
            response.msg = 'تم الاضافه بنجاح';

            callback(response);
        }
        ,
        getSchool: function (req, res, callback) {
            var schoolId = req.params.schoolId;
            con.query('select * from SCH_School where id = ?', [schoolId], function (err, result) {
                    if (err)
                        throw err

                    callback(result);
                }
            );
        }
        ,

        deleteSchool: function (req, res, callback) {
            var schoolId = req.params.schoolId;
            var response = {};
            con.query('delete from SCH_School where id = ?', [schoolId], function (err, result) {
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

                            function addCourseToDB(allCells) {
                                if (allCells[counter]) {
                                    let coursePromise = new Promise(function (resolve, reject) {
                                        courseTable.findOrCreate({where: {Course_Name: allCells[counter].course_name.trim()}})
                                            .spread((course, created) => {
                                                resolve(course.id);
                                                console.log('created ?   : ', created);

                                            });
                                    });

                                    let sectionPromise = new Promise(function (resolve, reject) {
                                        sectionsTable.findOrCreate({where: {Name: allCells[counter].section_name.trim()}})
                                            .spread((section, created) => {
                                                console.log('section  : ', section.id);
                                                console.log('created ?   : ', created);
                                                resolve(section.id);
                                            });
                                    });
                                    let roomPromise = new Promise(function (resolve, reject) {
                                        roomsTable.findOrCreate({
                                            where: {Name: allCells[counter].room_name.trim()},
                                            Defaults: {room_type: 'قاعة'}
                                        })
                                            .spread((room, created) => {
                                                console.log('section  : ', room.id);
                                                console.log('created ?   : ', created);
                                                resolve(room.id);
                                            });
                                    });
                                    let teacherPromise = new Promise(function (resolve, reject) {
                                        teachersTable.findOrCreate({where: {name: allCells[counter].teacher_name.trim()} , Defaults : {school_id : 1}})
                                            .spread((teacher, created) => {
                                                console.log('section  : ', teacher.id);
                                                console.log('created ?   : ', created);
                                                resolve(teacher.id);
                                            });
                                    });

                                    let lecturePromise = new Promise(function (resolve, reject) {
                                        lectureTable.findOrCreate({where: {name: allCells[counter].lecture_name.trim()}})
                                            .spread((lecture, created) => {
                                                console.log('section  : ', lecture.id);
                                                console.log('created ?   : ', created);
                                                resolve(lecture.id);
                                            });
                                    });
                                    Promise.all([sectionPromise, coursePromise, roomPromise, teacherPromise, lecturePromise]).then(function (data) {
                                        console.log(data);
                                        mainLecturesTable.create({
                                            School_Id: 1,
                                            Day: allCells[counter].day,
                                            Lecture_NO: data[4],
                                            Course_Id: data[1],
                                            Section_Id: data[0],
                                            ClassRoom_Id: data[2],
                                            Teacher_Id: data[3]
                                        })
                                            .then(function (err, socialUrl) {
                                                if (err) {
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
            con.query('select * from SCH_School', function (err, result) {
                    if (err)
                        throw err

                    callback(result);
                }
            );
        }
        ,
        setSchoolUser: function (req, res, callback) {
            var schoolData = req.body.schoolData;
            var response = {};
            if (schoolData.id) {
                con.query("select * from SCH_School where id = ?", [schoolData.id], function (err, result) {
                    if (err)
                        throw err;
                    if (Object.keys(result).length) {
                        con.query('update SCH_School set userId = ? where id = ?', [
                                schoolData.userId,
                                schoolData.id
                            ]
                            , function (err, result) {
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

                            }
                        );
                    } else {
                        response.success = false;
                        response.msg = 'لا يمكن العثور على الموظف الرجاء المحاوله مره اخرى';
                        callback(response);
                    }
                });
            }
        }
    }
;


module.exports = schoolMethods;