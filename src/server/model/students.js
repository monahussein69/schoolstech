var con = require('../routes/dbConfig.js');
const sequelizeConfig = require('../routes/sequelizeConfig');

var Excel = require('exceljs');


var studentsMethods = {
    saveStudent: function (req, res, callback) {
        var studentData = req.body.studentsData;
        var response = {};
        if (studentData.studentId) {
            con.query("select * from sch_str_student where id = ?", [studentData.studentId], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query("update sch_str_student set Identity_No = ? , School_Id = ?,Name=?,Name_english=?,Nationality=?,Academic_No=?," +
                        "level=?,Class =?,Identity_Date=?,Bairth_Date=?,BairthPlace_country=?,BairthPlace_city=?,Passport_No=? " +
                        "Blod_Group=?,Accomidation_wonershp=?,Address_Region=?,Address_City=?,Addresslane=?,Main_Road=?,Sub_Raod=?," +
                        "OnHliday_Adress=?,Phone1=?,fax=?,Mobile=?,Email=?,MailBox=?,zip_Code=?,parent_Id=?,Relative1_Id=?,Relative2_Id=?,Picture_file=?," +
                        "Lastupdate_Date=?,Home_No=?," +
                        "where student_id = ?",
                        [studentData], function (err, result) {
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
                    response.msg = 'لا يمكن العثور على الطالب , الرجاء المحاوله مره اخري';
                    callback(response);
                }
            });
        } else {
            con.query("select * from sch_str_student where Identity_No = ?", [studentData.Identity_No], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    console.log('found');
                    response.success = false;
                    response.msg = 'الطالب موجود مسبقا';
                    callback(response);
                } else {
                    var names = [];
                    var sql = 'INSERT INTO sch_str_student SET ? ';
                    var Query = con.query(sql, studentData, function (err, result, fields) {
                            if (err) {
                                throw err;
                            }
                            if (result.affectedRows) {
                                response.success = true;
                                response.msg = 'تم اضافة ' + studentData.length + ' طالب بنجاح'
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

    // updatePhoto: function (req, res, callback) {
    //     con.query(" update SCH_School set logoFile=? where id = ?",
    //         [req.body.logoFile,
    //             req.body.id
    //         ], function (err, result) {
    //             var response = {};
    //             if (err)
    //                 throw err
    //             if (result.affectedRows) {
    //                 response.success = true;
    //             } else {
    //                 response.success = false;
    //                 response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
    //             }
    //             callback(response);
    //         }
    //     );
    // },
    //
    //
    // saveSchools: function (req, res, callback) {
    //     var schoolsData = req.body.schoolsData;
    //     console.log('in obj11');
    //     console.log(schoolsData);
    //     var response = {};
    //     schoolsData.foreach(function (schoolData) {
    //
    //         con.query("select * from SCH_School where schoolNum = ?", [schoolData.schoolNum], function (err, result) {
    //             if (err)
    //                 throw err;
    //             if (!Object.keys(result).length) {
    //                 console.log('in obj');
    //                 con.query(" insert into SCH_School  (name, gender,educationalOffice,educationalRegion,educationLevel, address,totalClasses ,totalStudents ,totalStaff,rentedBuildings,governmentBuildings,foundationYear,logoFile) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    //                     [schoolData.name,
    //                         schoolData.gender,
    //                         schoolData.educationalOffice,
    //                         schoolData.educationalRegion,
    //                         schoolData.educationLevel,
    //                         schoolData.address,
    //                         schoolData.totalClasses,
    //                         schoolData.totalStudents,
    //                         schoolData.totalStaff,
    //                         schoolData.rentedBuildings,
    //                         schoolData.governmentBuildings,
    //                         schoolData.foundationYear,
    //                         schoolData.logoFile
    //                     ], function (err, result) {
    //                         if (err)
    //                             throw err
    //
    //
    //                     }
    //                 );
    //             }
    //         });
    //
    //
    //     });
    //
    //     response.success = true;
    //     response.msg = 'تم الاضافه بنجاح';
    //
    //     callback(response);
    // },
    // getSchool: function (req, res, callback) {
    //     var schoolId = req.params.schoolId;
    //     con.query('select * from SCH_School where id = ?', [schoolId], function (err, result) {
    //             if (err)
    //                 throw err
    //
    //             callback(result);
    //         }
    //     );
    // },
    //
    // deleteSchool: function (req, res, callback) {
    //     var schoolId = req.params.schoolId;
    //     var response = {};
    //     con.query('delete from SCH_School where id = ?', [schoolId], function (err, result) {
    //             if (err)
    //                 throw err
    //             if (result.affectedRows) {
    //                 response.success = true;
    //                 response.msg = 'تم حذف المدرسه بنجاح';
    //             } else {
    //                 response.success = false;
    //                 response.msg = 'خطأ, الرجاء المحاوله مره اخرى';
    //             }
    //             callback(response);
    //         }
    //     );
    // },
    UploadExcel: function (req, res, callback) {
        try {
            //
            var schoolId = req.body.schoolId;
            console.log('File Name : ', req.body.filename);
            var workbook = new Excel.Workbook();
            let data = {};
            let standards = [];
            let counter = 0;
            workbook.xlsx.readFile('./src/client/app/uploads/' + req.body.filename)
                .then(function () {
                        let allCells = [];
                        var message = '';
                        if (req.body.type == 'students') {
                            workbook.eachSheet(function (worksheet, sheetId) {
                                // var worksheet = workbook.getWorksheet();
                                worksheet.eachRow(function (row, rowNumber) {
                                    if (rowNumber > 16) {
                                        if (worksheet.getCell('AD' + rowNumber).value) {
                                            // var cellNumber = "Q"+rowNumber;
                                            var nextRow = rowNumber + 1;
                                            data = {
                                                Name: worksheet.getCell('Z' + rowNumber).value,
                                                School_Id : schoolId,
                                                Name_english: worksheet.getCell('Z' + nextRow).value,
                                                Nationality: worksheet.getCell('X' + rowNumber).value,
                                                Specialization: worksheet.getCell('W' + rowNumber).value,
                                                Enter_date: worksheet.getCell('T' + rowNumber).value,
                                                Identity_type: worksheet.getCell('S' + rowNumber).value,
                                                Identity_No: worksheet.getCell('Q' + rowNumber).value,
                                                Identity_Date: worksheet.getCell('O' + rowNumber).value,
                                                Passport_No: worksheet.getCell('M' + rowNumber).value,
                                                Bairth_Date: worksheet.getCell('L' + rowNumber).value,
                                                student_record: worksheet.getCell('J' + rowNumber).value,
                                                status: worksheet.getCell('E' + rowNumber).value,
                                                attending_date: worksheet.getCell('D' + rowNumber).value,
                                                notes: worksheet.getCell('C' + rowNumber).value,
                                            };
                                            req.body.studentsData = data;
                                            studentsMethods.saveStudent(req, res, function (result) {
                                                if (result.success) {
                                                    finalStudents.push(data);
                                                    console.log(result);
                                                    message = result.msg;
                                                } else {
                                                    console.log(result);
                                                    message = result.msg;
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                            console.log('MEssage : ', message);
                            callback({status: true, message: message, data: finalStudents});
                        } else if (req.body.type == 'studentsDegrees') {
                            workbook.eachSheet(function (worksheet, sheetId) {
                                // var worksheet = workbook.getWorksheet();
                                worksheet.eachRow(function (row, rowNumber) {
                                    if (rowNumber > 19) {
                                        if (worksheet.getCell('W' + rowNumber).value) {
                                            // var cellNumber = "Q"+rowNumber;
                                            data = {
                                                student_number: (worksheet.getCell('X' + rowNumber).value) ? worksheet.getCell('X' + rowNumber).value : worksheet.getCell('W' + rowNumber).value,
                                                student_name: (worksheet.getCell('X' + rowNumber).value) ? worksheet.getCell('W' + rowNumber).value : worksheet.getCell('V' + rowNumber).value,
                                                course_name: worksheet.getCell('E9').value,
                                                section_name: worksheet.getCell('E12').value,
                                            };
                                            allCells.push(data);
                                        }
                                    }
                                });
                                let cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                                cols.map(function (col) {
                                    standards.push(worksheet.getCell(col + '19').value);
                                });
                            });

                            function addToDB(allCells) {
                                if (allCells[counter]) {
                                    let sectionPromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.sectionsTable.findOrCreate({
                                            where: {Name: allCells[counter].section_name.trim()},
                                            defaults: {School_Id: 1}
                                        }).spread((section, created) => {
                                            resolve(section.id);
                                        });
                                    });
                                    let studentPromise = new Promise(function (resolve, reject) {
                                        sequelizeConfig.studentTable.find({where: {Name: allCells[counter].student_name}})
                                            .then(function (student) {
                                                // Check if record exists in db
                                                if (student) {
                                                    console.log('student : ', student);
                                                    student.updateAttributes({
                                                        Academic_No: allCells[counter].student_number
                                                    }).then(function () {
                                                        resolve(student.student_id);
                                                    })
                                                } else {
                                                    console.log('New Name', allCells[counter].student_name);
                                                    sequelizeConfig.studentTable.create({
                                                        Academic_No: allCells[counter].student_number,
                                                        School_Id: 1,
                                                        Name: allCells[counter].student_name
                                                    }).then(student => {
                                                        resolve(student.student_id);
                                                    });
                                                }
                                            });
                                    });
                                    Promise.all([studentPromise, sectionPromise]).then(function (data) {
                                        sequelizeConfig.studentsSectionTable.create({
                                            School_Id: 1,
                                            Section_Id: data[1],
                                            Student_Id: data[0],
                                        })
                                            .then(studentsSections => {
                                                counter++;
                                                addToDB(allCells);
                                                console.log("YEEEEEEEEEEEEEEES");
                                            })


                                    });
                                    //
                                }
                            }

                            addToDB(allCells);
                        }
                    }
                );
        } catch (e) {
            res.json({error_code: 1, err_desc: "Corupted excel file"});
        }
    },
    getAllStudents: function (req, res, callback) {
        var schoolId = req.params.schoolId;
        con.query('SELECT * FROM sch_str_student where School_Id = ?',[schoolId], function (err, result) {
                if (err)
                    throw err

                callback(result);
            }
        );
    },
};


module.exports = studentsMethods;