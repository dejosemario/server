import nodemailer, {
  Transporter,
  SendMailOptions,
  SentMessageInfo,
} from "nodemailer";
import {config} from "dotenv";
import { send } from "process";

// Load environment variables
config();
interface User {
  email: string;
  username: string;
}

interface EmailPayload {
  email: string;
  subject: string;
  text: string;
  html: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmails = async ({
  email,
  subject,
  text,
  html,
}: EmailPayload): Promise<void> => {
  // send mail with defined transport object
  try {
    let mailInfo: SendMailOptions = {
      from: `Eventful 👻" <${process.env.MAIL_SENDER}>`, // sender address
      to: email,
      subject,
      text,
      html,
    };

    const info: SentMessageInfo = await transporter.sendMail(mailInfo);
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

export default sendEmails;
