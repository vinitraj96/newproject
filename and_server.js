var port           =         8002;
var express        =         require("express");
var bodyParser     =         require("body-parser");
var connect = require('connect');
var app            =         express();
var fs = require('fs');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "bac0dc05",
  apiSecret: "849ea4a9f5790a21"
});



var nodemailer = require("nodemailer");

// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());  
app.use(connect.urlencoded());

// Routes

//require('./routes/routes.js')(app);
var app.set('port',(process.env.PORT||8080));

app.use(bodyParser.urlencoded({ extended: false }));
app.get('/',function(req,res){
  res.sendFile(__dirname +'/index.html');
  //res.sendStatus(404);
});

var smtpTransport = nodemailer.createTransport("SMTP",{
service: "Gmail",
auth: {
user: "vinitraj96@gmail.com",
pass: "sugun.bintu.123&"
}
});


app.listen(app.get('port'), function(){
  //var addr = app.address();
  console.log("Chat server listeing at,"+ app.get('port'));
});
