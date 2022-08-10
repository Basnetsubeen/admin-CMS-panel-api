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
        
        `, // html body
  };
  emailProcessor(emailBody);
};
