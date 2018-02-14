var con = require('../routes/dbConfig.js');
var Excel = require('exceljs');


var schoolMethods = {
    saveSchool: function (req, res, callback) {
        var schoolData = req.body.schoolData;

        var response = {};
        if (schoolData.schoolId) {
            con.query("select * from SCH_School where id = ?", [schoolData.schoolId], function (err, result) {
                if (err)
                    throw err;
                if (Object.keys(result).length) {
                    con.query(" update SCH_School set name = ? , gender = ?,educationalOffice=?,educationalRegion=?,educationLevel=?, address=?,totalClasses=? ,totalStudents =?,totalStaff=?,rentedBuildings=?,governmentBuildings=?,foundationYear=?,logoFile=? where id = ?",
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
                            schoolData.logoFile,
                            schoolData.schoolId,
                        ], function (err, result) {
                            if (err)
                                throw err
                            if (result.affectedRows) {
                                response.success = true;
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
                    if (result.affectedRows) {
                        response.success = true;
                        response.msg = 'تم الاضافه بنجاح'
                    } else {
                        response.success = false;
                        response.msg = 'خطأ , الرجاء المحاوله مره اخرى';
                    }
                    callback(response);
                }
            );
        }

    },


    saveSchools: function (req, res, callback) {
        var schoolsData = req.body.schoolsData;
        var response = {};
        schoolsData.foreach(function (schoolData) {

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
            workbook.xlsx.readFile('./uploads/' + req.body.filename)
                .then(function () {
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
                                req.body.schoolData = data ;
                                schoolMethods.saveSchool(req, res, function (result) {
                                    console.log(result);
                                });
                                finalSchools.push(data);
                            }
                        });
                    });

                    callback(finalSchools);
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