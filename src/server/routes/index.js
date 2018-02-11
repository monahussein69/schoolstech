var express = require('express');
var router = express.Router();
var body_parser = require('body-parser');
var loginMethod = require('../model/login.js');
var app = express();
app.use(body_parser.json);


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
    res.send('test');
});

module.exports = router;