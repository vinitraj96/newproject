var port           =         8002;
var express        =         require("express");
var bodyParser     =         require("body-parser");
var connect = require('connect');
var app            =         express();
var mongoose       =         require('mongoose');
var fs = require('fs');



var nodemailer = require("nodemailer");

mongoose.connect('mongodb://localhost/Veggi');


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
	phoneno    : String,
	password   : String,
  usertype   : String,
  address    : String,
  pincode    : String,
  landmark   : String
});

var Item = new mongoose.Schema({
  added_by                : String,
  item_name               : String,
  item_price              : String,
  category                : String,
  item_per_price: [{ 
      item_price : String,
      item_mrp   : String,
      item_per   : String     
  }],
  imagename               : String
});

var Category = new mongoose.Schema({
  added_by                : String,
  category_name           : String,
  imagename               : String
});

var Order = new mongoose.Schema({
  ordered_by_email      : String,
  ordered_by_username   : String,
  order_id              : String,
  ordered_on_date       : String,
  ordered_on_time       : String,
  item_name             : String,
  item_price            : String,
  quantity              : String,
  item_per              : String,
  total                 : String
});

var user = mongoose.model('user', User);

var order = mongoose.model('order', Order);

var item = mongoose.model('item', Item);

var category = mongoose.model('category', Category);

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
  var username=req.body.username;
  var email=req.body.email;
  var phoneno=req.body.phoneno;
  var password=req.body.password;
  var usertype=req.body.usertype;
  var address=req.body.address;
  var pincode=req.body.pincode;
  var landmark=req.body.landmark;
  console.log("pincode>>>>>>"+address);
  user.find({email:email},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new user({
          username          : username,
          email             : email,
          phoneno           : phoneno,
          password          : password,
          usertype          : usertype,
          address           : address,
          pincode           : pincode,
          landmark          : landmark
        }).save(function(err, doc){
          if(err) console.log('error');
          else    res.json({"doc":doc});
        });
      }else{
        console.log('already exist');
        res.json({"doc":"already exist"});
      }
    }
  });
  
});

app.post('/login',function(req,res){
  var email=req.body.email;
  var password=req.body.password;

  user.find({ $and: [ { email: email }, { password: password } ] },
	function(err,doc) {
  		if (err) throw err;

  		else{
			if(doc.length===0){
        console.log('invalid user');
				res.json({"msg":"invalid"})
			}
			if(doc.length===1){
        console.log('valid user');
				res.json({"msg":"valid"})
			}
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
        res.json({"msg":"invalid"})
      }
      if(doc.length===1){
        console.log(doc);
        res.json({"doc":doc})
      }
    }
        
  });

});

///////////////////////////////////////////////////// Registration and Login Routes Ends /////////////////////////////////////////////

app.post('/CompleteOrder',function(req,res){

  var email=req.body.email;
  var username=req.body.username;
  var orderId=req.body.orderId;
  var itemName=req.body.itemName;
  var itemPrice=req.body.itemPrice;
  var quantity=req.body.quantity;
  var itemPer=req.body.itemPer;
  var total=req.body.total;
  var datetime = new Date();

  console.log(datetime.getDate()+datetime.getMonth());
  order.find({order_id:orderId},function(err,doc){
    if(err){

    }else{
      if(doc.length==0){
        new order({
            ordered_by_email      : email,
            ordered_by_username   : username,
            order_id              : orderId,
            ordered_on_date       : datetime.getDate()+"/"+datetime.getMonth()+"/"+datetime.getYear(),
            ordered_on_time       : datetime.getHours()+":"+datetime.getMinutes()+":"+datetime.getSeconds(),
            item_name             : itemName,
            item_price            : itemPrice,
            quantity              : quantity,
            item_per              : itemPer,
            total                 : total
        }).save(function(err, doc){
          if(err) console.log('error');
          else    {
              var mailHtml1 = '<div style="border: 10px solid #CBCACA;float:left;padding: 1%;background: #F3F3F3">'+
                                          '<div>'+
                                              '<img style="height: 60px;width: 245px;float:right;" src="https://scontent.xx.fbcdn.net/hphotos-xfl1/v/t1.0-9/12376575_952217618191264_8341414408216050692_n.jpg?oh=21623549fc1efaa1cb69199e00a5b2e7&oe=571EC8F5" alt="Veggi">'+  
                                          '</div>'+            
                                          '<div style="text-align: justify;float:left;">'+
                                              '<p>Hi <b style="color:blue;">'+username+'</b></p>'+
                                              '<p>Your order is</p>';                        
                                      
              var mailHtml='';
              for(var i=0;i<itemName.split(",").length;i++){
                if(i==0){

                }else{
                    var x = parseInt(quantity.split(",")[i], 10)*parseInt(itemPrice.split(",")[i], 10);
                    mailHtml=mailHtml+'<p><b style="color:blue;">'+itemName.split(",")[i]+'</b>'+" "+quantity.split(",")[i]+"*"+itemPrice.split(",")[i]+"="+x+" Rs"+' </p>';
                }
              }
              mailHtml1=mailHtml1+mailHtml+
                        '<p>Total Amount:'+total+'</p>'
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

app.post('/FetchOrder',function(req,res){
  email=req.body.email;
  order.find({ordered_by_email:email},function(err,doc){
    if (err) {

    }else{
      if(doc.length===0){
        res.json({"doc":"no order"});
      }else{
        res.json({"doc":doc});
      }
    }
  });
});

/*app.get('/',function(req,res){
  res.end("Node-File-Upload");

});*/
app.post('/uploadcategory', function(req, res) {
  console.log(req.files.image.originalFilename);
  console.log(req.files.image.path);
  fs.readFile(req.files.image.path, function (err, data){
    var dirname = "/home/ritzylab3/Desktop/Projects/node_for_veggi";
    var newPath = dirname + "/uploads/" +   req.files.image.originalFilename;
    fs.writeFile(newPath, data, function (err) {
      if(err){
        res.json({'response':"Error"});
      }else {
       res.json({'response':"Saved"});     
      }
    });
  });
});

app.post('/upload', function(req, res) {
  console.log(req.files.image.originalFilename);
  console.log(req.files.image.path);
  fs.readFile(req.files.image.path, function (err, data){
    var dirname = "/home/ritzylab3/Desktop/Projects/node_for_veggi";
    var newPath = dirname + "/uploads/" +   req.files.image.originalFilename;
    fs.writeFile(newPath, data, function (err) {
      if(err){
        res.json({'response':"Error"});
      }else {
       res.json({'response':"Saved"});     
      }
    });
  });
});

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

app.post('/AddItem',function(req,res){
  var email=req.body.email;
  var item_name=toTitleCase(req.body.item_name);
  var item_price=req.body.item_price;
  var item_mrp=req.body.item_mrp;
  var category=toTitleCase(req.body.category);
  var item_per=req.body.item_per;
  var imagename=req.body.imagename;
  console.log("MRP>>>>"+item_mrp);


  
  item.find({ $or: [{item_name: item_name },{imagename:imagename},{item_per:item_per}] },function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new food');
        new item({
          added_by                : email,
          item_name               : item_name,
          category                : category,
          item_per_price: [{ 
            item_price : item_price,
            item_mrp   : item_mrp,
            item_per   : item_per     
          }],
          imagename               : imagename
        }).save(function(err, doc){
          if(err) console.log('error');
          else    res.json({"doc":doc});
        });
      }else{
        item.update({ item_name: item_name},
                {
                 $push: {
                   item_per_price: { 
                      item_price : item_price,
                      item_mrp   : item_mrp,
                      item_per   : item_per     
                    }
                 }
                },function(err, result){
                   if (err) {
                       console.log("errrrr");
                   } else {
                        console.log("group joined");
                        res.json({"doc":result});
                   }
                 }
              );
      }
    }
  });
  
});

app.post('/FetchAllItem',function(req,res){
   console.log('FetchAllItem');
   var category=req.body.category;
  item.find({category:category},function(err,doc){
    if(err){
      console.log('error');
    }else{
      console.log(doc);
      res.json({"doc":doc});
    }
  }); 
});

app.post('/FetchSearchItem',function(req,res){
   console.log('FetchAllItem');
   var search=req.body.search;
   var re = new RegExp(search,"i");
  item.find({ item_name: { $regex: re } },function(err,doc){
    if(err){
      console.log('error');
    }else{
      res.json({"doc":doc});
    }
  });
  
});
app.post('/UpdateItemPrice',function(req,res){
  var item_name=req.body.item_name;
  var item_price=req.body.item_price;
  item.update({item_name:item_name},
   {
     $set: {
       item_price : item_price
     }
   },function(err,doc){
      if(err){
        console.log('error');
      }else{
        res.json({"doc":"price updated"});   
      } 
  });
});

app.post('/RemoveItem',function(req,res){
  var item_name=req.body.item_name;
   item.remove({item_name:item_name},function(err,doc){
      if(err){
        console.log('error');
      }else{
        res.json({"doc":"removed"});   
      } 
  });
});

app.post('/AddCategory',function(req,res){
  var email=req.body.email;
  var category_name=toTitleCase(req.body.category_name);
  var imagename=req.body.imagename;
  
  category.find({ category_name: category_name },function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new Category');
        new category({
          added_by                : email,
          category_name           : category_name,
          imagename               : imagename
        }).save(function(err, doc){
          if(err) console.log('error');
          else    res.json({"doc":doc});
        });
      }else{
        console.log('already exist');
        res.json({"doc":"already exist"});
      }
    }
  });  
});

app.post('/FetchAllCategory',function(req,res){
   console.log('FetchAllCategory');
   category.find({},function(err,doc){
    if(err){
      console.log('error');
    }else{
     // console.log(doc);
      res.json({"doc":doc});
    }
  }); 
});

app.get('/uploadscategory/:file', function (req, res){
    file = req.params.file;
    var dirname = "/home/ritzylab3/Desktop/Projects/node_for_veggi";
    var img = fs.readFileSync(dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.get('/uploads/:file', function (req, res){
    file = req.params.file;
    var dirname = "/home/ritzylab3/Desktop/Projects/node_for_veggi";
    var img = fs.readFileSync(dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

app.listen(port,function(){
  console.log("Started on PORT "+port);
});
