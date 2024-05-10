import nodemailer from "nodemailer";
import createError from "http-errors";
import { emailPass, emailUser, smtpHost, smtpPort } from "../app/secret.js";

const transport = nodemailer.createTransport({
  host: smtpHost, // host name
  port: smtpPort, // host port number
  auth: {
    user: emailUser, // email address
    pass: emailPass, // email password
  },
});

const sendPasswordResetMail = async (emailData) => {
  try {
    const { resetToken } = emailData;
    const mailInfo = {
      from: emailUser, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: `
     <body style="background-color:#f4f3f3"><div style="width:fit-content;margin:auto;margin-top:30px"><div class="main-container" style="width:400px;height:210px;background-color:#e7ebea;padding:15px;border-radius:5px"><div class="mail-header"><img src="" alt="" style="width:100px"><hr style="color:gray;background-color:#cfcbcb;height:1px;border:none;margin:0;padding:0"></div><div class="mail-body" style="font-size:20px"><p style="margin:0;padding:8px 4px;font-weight:600;text-align:center">Welcome to KIN</p><p style="font-size:17px">you can also click the button below to active your account.</p><div style="text-align:center;margin-top:10px"><a href="${clientURL}/api/v1/auth/activate/${resetToken}" target="_blank" style="background-color:#2b556b;color:#fff;padding:6px 10px;text-decoration:none;border-radius:5px;margin:auto;font-size:18px">Active my Account</a></div><p style="text-align:center"></p><p style="margin:0;padding:2px">The Code expired in 5 minutes.</p></div></div></div></body>

     `,
    };

    const info = await transport.sendMail(mailInfo);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Message sent failed!");
    throw createError(500, "Failed to send email");
  }
};

export default sendPasswordResetMail;
