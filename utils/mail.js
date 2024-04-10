const nodemailer = require('nodemailer');

module.exports.RegisterationMail = async (email, name) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'mohammedrayan9064@gmail.com',
            pass: 'fgtm qdcg httt xfcj'
        }
      });
      
      const mailOptions = {
          from: 'mohammedrayan9064@gmail.com',
          to: email,
          subject: 'Coursera registration',
          text: `Hi, ${name}. Thank you for registering in Coursera. Happy learning`
      };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
    } catch (e) {
        console.log(e);
    }
};


module.exports.EnrollmentMail = async (email, name) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'mohammedrayan9064@gmail.com',
            pass: 'fgtm qdcg httt xfcj'
        }
      });
      
      const mailOptions = {
          from: 'mohammedrayan9064@gmail.com',
          to:  email,
          subject: 'Enrolled Course',
          text: `Hi, ${name}. Thank you for enrolling our course. Happy learning`
      };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
    } catch (e) {
        console.log(e);
    }
};



module.exports.PasswordReset = async (email, name) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'mohammedrayan9064@gmail.com',
            pass: 'fgtm qdcg httt xfcj'
        }
      });
      
      const mailOptions = {
          from: 'mohammedrayan9064@gmail.com',
          to:  email,
          subject: 'Password Reset',
          text: `Hi, ${name}. We noticed that you're trying to change password.`
      };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent!");
    } catch (e) {
        console.log(e);
    }
};