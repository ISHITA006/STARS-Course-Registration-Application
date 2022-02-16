var nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
     user: "starsplusplus@gmail.com",
     pass: "softwareengineering"
   }
});

var emailAddress = "ghotinggoad@gmail.com";
var message = "";
var studentId;
var courseId;
var index;
var mailOptions = {};

//async function sendEmail(studentId, courseId, index){
function mail(){
  //emailAddress = address;
  message = "Hi ";
  message += toString(studentId);
  message += ",\n\nYou've successfully registered Course ";
  message += toString(courseId);
  message += ", Index ";
  message += toString(index);
  message += "!\n\n\nRegards,\nSTARS++ Team.\n";

  mailOptions = {
       from: "starsplusplus@gmail.com", // Sender address
       to: emailAddress, // List of recipients
       subject: 'STARS++ Index registered!', // Subject line
       text: message // Plain text body
  };

  transport.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
  });
}

// this doesn't work unfortunately

module.exports.sendEmail = mail;
module.exports.studentId = studentId;
module.exports.courseId = courseId;
module.exports.index = index;
