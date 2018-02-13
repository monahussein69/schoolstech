var express = require('express');
var router = express.Router();
var loginMethod = require('../Functions/login.js');
var app = express();
var multer = require('multer');
var Excel = require('exceljs');
var XLSX = require('xlsx');
var _ = require('lodash');
var utf8 = require('utf8');
var filename = '';

//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        filename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        console.log(filename);
        cb(null, filename);
    }
});
//multer settings
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("Salim Quta");
});

/** API path that will upload the files */
router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log('error : ', err);
            res.json({error_code: 1, err_desc: err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({error_code: 1, err_desc: "No file passed"});
            return;
        }
        // if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
        //     var array = xlsx.parse(__dirname + '/file_name.xlsx');
        // }
        try {
            // console.log('File Name : ', filename);
            var workbook = new Excel.Workbook();
            var data = {};

            workbook.xlsx.readFile('./uploads/' + filename)
                .then(function () {
                    var finalSchools = [];
                    console.log("file : Read");
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
                                finalSchools.push(data);
                            }
                        });
                    });
                    res.send(finalSchools);
                });
        } catch (e) {
            res.json({error_code: 1, err_desc: "Corupted excel file"});
        } ;
    })
});

var sheet2arr = function (sheet) {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        row = [];
        for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
            var nextCell = sheet[
                XLSX.utils.encode_cell({r: rowNum, c: colNum})
                ];
            if (typeof nextCell === 'undefined') {
                row.push(void 0);
            } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
};

router.post('/login', function (req, res, next) {
    loginMethod.userLogin(req, res, function (result) {
        res.send(result);
    });

});


module.exports = router;