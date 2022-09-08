import nodemailer from "nodemailer";

//email configuraton and send email

//email templet

const emailProcessor = async (emailBody) => {
  try {
    //1.
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMT,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail(emailBody);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

export const verificationEmail = (emailData) => {
  const emailBody = {
    from: '"Subin Store 👻" <basnetsubeen@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "Email verification instruction", // Subject line
    text: `Hi ${emailData.fName}, Please follow the link to verify your email`, // Plain text body
    html: `
        <p>Hi ${emailData.fName}</p>
        <br />
        <br />
        <p> Please follow the link to verify your email</p>
        <br />
        <br />
        <p> <a href ="${emailData.url}">verify email </a></p>
       
        <br />
        <p>Regards,  <br />
        Subin Basnet
        <br />
        </p>
       
        `, // html body
  };
  emailProcessor(emailBody);
};
export const userVerificationNotification = (emailData) => {
  const emailBody = {
    from: '"Subin Store 👻" <basnetsubeen@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "Your account has been verified", // Subject line
    text: `Hi ${emailData.fName}, Your accout has been verified, You may login now. ${process.env.ROOT_DOMAIN}`, // Plain text body
    html: `
        <p>Hi ${emailData.fName}</p>
        <br />
        <br />
        <p> Please follow the link to verify your email</p>
        <br />
        <br />
        <p> <a href ="${process.env.ROOT_DOMAIN}">${process.env.ROOT_DOMAIN}</a></p>

         <br />
        <br />
        `, // html body
  };
  emailProcessor(emailBody);
};
//send otp to the user email
export const otpNotification = (emailData) => {
  const emailBody = {
    from: '"Subin Store 👻" <basnetsubeen@gmail.com>', // sender address
    to: emailData.email, // list of receivers
    subject: "OTP for password reset", // Subject line
    text: `Hi ${emailData.fName}, Please use the following OTP to reset your password: ${emailData.otp}`, // Plain text body
    html: `
        <p>Hi ${emailData.fName}</p>
        <br />
        <br />
        <p> Please use the following OTP to reset your new password</p>
        <br />
        <br />
        <p>${emailData.otp}</p>
         <br />
        <br />
        <p>Regards,  <br />
        Subin Basnet
        <br />
        `, // html body
  };
  emailProcessor(emailBody);
};
