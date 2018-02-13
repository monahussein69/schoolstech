var express = require('express');
var router = express.Router();
var loginMethod = require('../model/login.js');
var schoolMethods = require('../model/school.js');
var schoolAccountMethods = require('../model/schoolAccount.js');

var app = express();
var multer = require('multer');
var Excel = require('exceljs');
var XLSX = require('xlsx');
var _ = require('lodash');
var utf8 = require('utf8');
var filename = '';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Salim Quta");
});

router.post('/login', function(req, res, next) {
    loginMethod.userLogin(req,res,function(result){
        res.send(result);
    });

});

router.post('/saveSchoolData', function(req, res, next) {
    schoolMethods.saveSchool(req,res,function(result){
        res.send(result);
    });
});


router.get('/getSchool/:schoolId', function(req, res, next) {
    schoolMethods.getSchool(req, res, function (result) {
        res.send(result);
    });
});
router.get('/deleteSchool/:schoolId', function(req, res, next) {
        schoolMethods.deleteSchool(req,res,function(result){
            res.send(result);
        });
});

router.post('/saveSchoolAccountData', function(req, res, next) {
    schoolAccountMethods.saveSchoolAccount(req,res,function(result){
        res.send(result);
    });
});


router.get('/getSchoolAccount/:schoolId', function(req, res, next) {
    schoolAccountMethods.getSchoolAccount(req, res, function (result) {
        res.send(result);
    });
});
router.get('/deleteSchoolAccount/:schoolId', function(req, res, next) {
        schoolAccountMethods.deleteSchoolAccount(req,res,function(result){
            res.send(result);
        });
});

module.exports = router;