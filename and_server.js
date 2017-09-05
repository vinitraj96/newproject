var port           =         8002;
var express        =         require("express");
var bodyParser     =         require("body-parser");
var connect = require('connect');
var app            =         express();
var mongoose       =         require('mongoose');
var fs = require('fs');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "bac0dc05",
  apiSecret: "849ea4a9f5790a21"
});



var nodemailer = require("nodemailer");

mongoose.connect('mongodb://localhost/pipiride');


// Configuration
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());  
app.use(connect.urlencoded());

// Routes

//require('./routes/routes.js')(app);


var User = new mongoose.Schema({
	username   : String,
	email      : String,
	mobileNo    : String,
	password   : String,
  otp        : String,
  verificationCode :String
});

var AddBike = new mongoose.Schema({
  bikeName      : String,
  bikeImageName : String,
  fuelType      : String,
  seat          : String,
  priceSixHour  : String,
  kmLimitSixHour: String,
  areaName      : String
});

var Venue = new mongoose.Schema({
  areaName: String,
});

var user = mongoose.model('user', User);

var AddBike = mongoose.model('add_bike', AddBike);

var Venue = mongoose.model('venue', Venue);

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

///////////////////////////////////////////////////// Registration and Login Routes Starts /////////////////////////////////////////////
app.post('/register',function(req,res){
  console.log("register");
  var mobileNo=req.body.mobileNo;
  var otp = Math.floor(1000 + Math.random() * 9000);
/*  nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  user.find({mobileNo:mobileNo},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new user({
          mobileNo : mobileNo,
          otp : otp.toString()
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
             res.json({"doc":"valid"});
          }
        });
      }else{
        user.update({mobileNo:mobileNo},
        {
          $set: {
           otp : otp.toString()
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

            res.json({"doc":"valid"});
          }
        });
      }
    }
  });

});

app.post('/matchOtp',function(req,res){
  console.log("register");
  var mobileNo=req.body.mobileNo;
  var otp = req.body.otp;
  
  user.find({$and:[{mobileNo:mobileNo,otp:otp}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
         res.json({"doc":"not valid"});
      }else{
        user.update({mobileNo:mobileNo},
        {
          $set: {
           otp : ''
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });
      }
    }
  });

});

app.post('/deleteOtp',function(req,res){
  console.log("deleteOtp");
  var mobileNo=req.body.mobileNo;
  setTimeout(myFunc, 5 * 60 * 1000,mobileNo,res);          
});

function myFunc(arg,res) {
  user.update({mobileNo:arg},
    {
      $set: {
       otp : ''
      }
    },function(err,doc){
      if(err){
        console.log('error');
      }else{
      }
    });
}

app.post('/AddBike',function(req,res){
  console.log("add bike.....................................");
  var email=req.body.email;
  var password=req.body.password;

  var bikeName=req.body.bikeName;
  var bikeImageName= req.body.bikeImageName;
  var fuelType= req.body.fuelType;
  var seat= req.body.seat;
  var priceSixHour= req.body.priceSixHour;
  var kmLimitSixHour= req.body.kmLimitSixHour;
  var areaName= req.body.areaName;

  AddBike.find({},function(err,doc){
    if(err){
      console.log('error');
    }else{
      new AddBike({
        bikeName : bikeName,
        bikeImageName : bikeImageName,
        fuelType : fuelType,
        seat : seat,
        priceSixHour : priceSixHour,
        kmLimitSixHour : kmLimitSixHour,
        areaName : areaName
      }).save(function(err, doc){
        if(err) console.log('error');
        else{
          Venue.find({'areaName':areaName},function(err,data){
            if(err){

            }else{
              if(data.length==0){
                new Venue({
                  areaName : areaName
                }).save(function(err, doc){
                  if(err) console.log('error');
                  else{
                    res.json({"doc":"successfully added"});
                  }
                });
              }else{
                res.json({"doc":"successfully added"});
              }
            }
          });
        }
      });
    }
  });
});
app.post('/FetchAccount',function(req,res){
  var email=req.body.email;
  user.find({ email: email },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"invalid"});
      }
      if(doc.length===1){
        console.log(doc);
        saveAddress.find({ $and: [ { email: email }, { defaultAddress: "true" } ] },
        function(err,defaultAddress) {
            if (err) throw err;
      
            else{
            if(doc.length===0){
              console.log('invalid user');
              res.json({"msg":"invalid"});
            }
            if(doc.length===1){
              console.log(doc);
              res.json({"doc":doc,"defaultAddress":defaultAddress});
            }
          }
              
        });
        //res.json({"doc":doc})
      }
    }
        
  });

});


app.post('/FetchAllAddress',function(req,res){
  console.log("FetchAllAddress");
  Venue.find({},function(err,data){
    if(err){

    }else{
        console.log(data);
        res.json({"doc":data});
      
    }
  });
});

app.post('/FetchAllBike',function(req,res){
  console.log("FetchAllBike");
  AddBike.find({},function(err,data){
    if(err){

    }else{
        console.log(data);
        res.json({"doc":data});
      
    }
  });
});

app.post('/saveAddress',function(req,res){
  console.log("saveAddress");
  var email=req.body.email;
  var phoneno=req.body.phoneno;
  var address=req.body.address;
  var pincode=req.body.pincode;
  var landmark=req.body.landmark;
  var city=req.body.city;
  var defaultAddress=req.body.defaultAddress;
  saveAddress.find({email:email},function(err, doc) {
      if(err){
        
      }else{
        if(doc.length===0){
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : "true"
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
        }else{
          if(defaultAddress==="true"){
            saveAddress.update({email:email},
                {
                  $set: {
                   defaultAddress : "false"
                  }
                },{ multi: true },function(err,doc){
                  if(err){
                    console.log('error');
                  }else{
                    console.log('done');
                    new saveAddress({
                      email             : email,
                      phoneno           : phoneno,
                      address           : address,
                      pincode           : pincode,
                      landmark          : landmark,
                      city              : city,
                      defaultAddress    : defaultAddress
                    }).save(function(err, doc){
                      if(err) console.log('error');
                      else    res.json({"doc":doc});
                    });
                  }
            });
          }else{
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : defaultAddress
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
          }
        }
      }
  });
});

app.post('/CompleteOrder',function(req,res){

  var email=req.body.email;
  var address=req.body.address;
  var orderId=req.body.orderId;
  var username=req.body.username;
  var deliverydate=req.body.deliverydate;
  var pickupdate=req.body.pickupdate;
  var datetime = new Date();

  console.log(datetime.getFullYear()+"   "+datetime);
  order.find({order_id:orderId},function(err,doc){
    if(err){

    }else{
      if(doc.length==0){
        new order({
            ordered_by_email      : email,
            address               : address,
            order_id              : orderId,
            ordered_on_date       : datetime.getDate()+"/"+(datetime.getMonth()+1)+"/"+datetime.getFullYear(),
            ordered_on_time       : datetime.getHours()+":"+datetime.getMinutes()+":"+datetime.getSeconds()
        }).save(function(err, doc){
          if(err) console.log('error');
          else    {
              var mailHtml1 = '<div style="border: 10px solid #03A9F4;float:left;padding: 1%;background: #F3F3F3">'+
                                          '<div>'+
                                              '<img style="height: 100px;width: 100px;float:right;" src="https://idealadda-vinitraj.c9users.io/uploads/idealaddalogo.png" alt="Ideal Adda">'+  
                                          '</div>'+            
                                          '<div style="text-align: justify;float:left;">'+
                                              '<p>Hi <b style="color:blue;">'+email+'</b></p>'+
                                              '<p>We have received your order '+orderId+' and it will be delivered to you within '+deliverydate+'.</p>'+
                                              '<p>Order Date:	'+datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear()+',Order Time:'+datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds()+'</p>'+
                                              '<p>Address:</p>'+
                                              '<p>'+address+'</p>';                        
                                      
              mailHtml1=mailHtml1+
                        '<p></p>'+
                        '<p>Thanks,</p>'+
                        '<p>Team Washing Adda.</p>'+
                        
                        '</div>'+
                        '</div>';
              var mailOptions={
                to : "vinitraj96@gmail.com,"+email,
                subject : "Your veegi order summary",
                text : "veggi",
                html: mailHtml1
              }
              console.log(mailOptions);
              smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                console.log(error);
                
                }else{
                }
              });
              res.json({"doc":"order completed"});
          }
        });
      }
    }
  });
});

app.listen(8002, function(){
  //var addr = app.address();
  console.log("Chat server listening at, 8002");
});
