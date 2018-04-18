var Firebase = require("firebase");
var config = {
    apiKey: "AIzaSyCW0e_k36oouITM6rW_hSBqcZvWVnCWu_8",
    authDomain: "schoolstech-b4413.firebaseapp.com",
    databaseURL: "https://schoolstech-b4413.firebaseio.com",
    projectId: "schoolstech-b4413",
    storageBucket: "schoolstech-b4413.appspot.com",
    messagingSenderId: "921913451306"
};

Firebase.initializeApp(config);
var database = Firebase.database();

let fireBaseConn = {

 sendNotification : function (req,res) {
     var msg = req.body.msg;
     var user_id = req.body.user_id;
    var notifiy_id = database.ref('notifications/' + user_id).push().key;
    var current_time = Date.now();
     var result = {};
    database.ref('notifications/' + user_id + '/' + notifiy_id).set({
        "message": msg,
        "status": "unread",
        "notfied": "false",
        "notifiy_id": notifiy_id,
        "notify_time": current_time
    });
    result.status = 'sent';
 },

 countUnreadNotifications : function(req,res,callback){
     var user_id = req.params.user_id;
     var result = {};
     console.log(user_id);
     database.ref('notifications/' + user_id).orderByChild("notfied").equalTo("false").once('value', function (snapshot) {
         var unread = snapshot.numChildren();
         result.unread = unread;
         callback(result);
     });

 },

    getUserNotifications : function(req,res,callback){
        var user_id = req.params.user_id;
        console.log(user_id);
        var result = {};
        database.ref('notifications/' + user_id).once('value', function (snapshot) {
            var notifications = snapshot.val();
            result.notifications = notifications;
            callback(result);
        });

 }

}
module.exports = fireBaseConn;

