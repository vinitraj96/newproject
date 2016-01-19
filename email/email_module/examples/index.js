
// Module dependencies.
var nodemailer = require("../lib/nodemailer");


exports.sendMailFun=function(msg){

    var transport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "vinitraj96@gmail.com",
            pass: "bintu.sugun123&"
        }
    });
  
// Message object
var message = {

    // sender info
    from: "vinitraj96@gmail.com",  //email will not change

    // Comma separated list of recipients
    to: "vinitraj96@gmail.com",

    // Subject of the message
    subject: "vinitraj96@gmail.com",

    text: "hello",

     // HTML body
    html: "vinitraj96@gmail.com"

    // An array of attachments
   //attachments: atts
};
//console.log('Sending Mail');

transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    //console.log('Message sent successfully!');

    // if you don't want to use this transport object anymore, uncomment following line
    transport.close(); // close the connection pool
});
     
};
