var con = require('../routes/dbConfig.js');
var Excel = require('exceljs');


var schoolMethods = {
    saveSchool: function (req, res, callback) {
        var schoolData = req.body.schoolData;
        console.log('Schools Data : ', schoolData);
        var response = {};
        if (schoolData.schoolId) {
            con.query("select * from SCH_School where id = ?", [schoolData.schoolId], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query(" update SCH_School set name = ? , gender = ?,educationalOffice=?,educationalRegion=?,educationLevel=?, address=?,totalClasses=? ,totalStudents =?,totalStaff=?,rentedBuildings=?,governmentBuildings=?,foundationYear=?,schoolNum=? where id = ?",
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
                            schoolData.schoolNum,
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


    saveSchoolSchedule: function (req, res, callback) {
        var response = {};
        // add sections
        var sections = req.body.sections;

        if (sections) {
            console.log('LALAR ',req.body.sections.Name);
           var query =  con.query("select * from sch_acd_sections where Name = ?", [sections.Name.trim()], function (err, result) {
            console.log('Query  : ',query.sql);
                if (err)
                    throw err;
                console.log(Object.keys(result).length);
                if (Object.keys(result).length <= 0) {
                    console.log("added");
                    con.query("INSERT INTO sch_acd_sections SET ? ", sections
                        , function (err, result) {
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

                        }
                    );
                }
            });
        }
        if (req.body.sections) {
            con.query("INSERT INTO APP_DEF_COURSES SET ? ", req.body.courses
                , function (err, result) {
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

                }
            );
        }
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
    },


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
    },
    getSchool: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from SCH_School where id = ?', [schoolId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },

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
    },
    UploadExcel: function (req, res, callback) {
        try {
            //
            console.log('File Name : ', req.body.filename);
            var workbook = new Excel.Workbook();
            var data = {};
            var sectionData = {};
            var courseData = {};
            var roomData = {};
            var lectureData = {};
            var sections = [];
            var courses = [];
            var rooms = [];

            workbook.xlsx.readFile('./src/client/app/uploads/' + req.body.filename)
                .then(function () {
                    if (req.body.type == 'school') {
                        var finalSchools = [];
                        workbook.eachSheet(function (worksheet, sheetId) {
                            // var worksheet = workbook.getWorksheet();
                            worksheet.eachRow(function (row, rowNumber) {
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
                        workbook.eachSheet(function (worksheet, sheetId) {
                            // var worksheet = workbook.getWorksheet();
                            var cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                            worksheet.eachRow(function (row, rowNumber) {
                                if (rowNumber > 4) {
                                    cols.forEach(function (col) {
                                        var cell = worksheet.getCell(col + '' + rowNumber).value;
                                        if (cell) {
                                            if (cell.indexOf("الشعبة") >= 0) {
                                                sectionData = {
                                                    School_Id: 1,
                                                    Academic_Year: '1439',
                                                    Term_Id: 'first',
                                                    Course_Id: 1,
                                                    Name: cell.split('/')[1].trim()
                                                };
                                                courseData = {
                                                    Credit_Houres: 'first',
                                                    School_Level: 1,
                                                    Course_Name: cell.split('/')[0]
                                                };
                                                courses.push(courseData);
                                                sections.push(sectionData);
                                            } else if (cell.indexOf("قاعة") >= 0) {
                                                roomData = {
                                                    room_name: cell
                                                };
                                                rooms.push(roomData);
                                            }

                                            req.body.rooms = roomData;
                                            req.body.sections = sectionData;
                                            req.body.courses = courseData;
                                            schoolMethods.saveSchoolSchedule(req, res, function (result) {
                                                console.log(result);
                                            });
                                        }
                                    });


                                    // finalSchools.push(data);
                                }
                            });

                        });
                        // console.log(sections);

                    }
                });
        } catch (e) {
            res.json({error_code: 1, err_desc: "Corupted excel file"});
        }
    },
    getSchools: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('select * from SCH_School', function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },
};


module.exports = schoolMethods;