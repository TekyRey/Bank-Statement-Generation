import * as nodemailer from "nodemailer";

const dotenv = require("dotenv");
dotenv.config();

export async function sendEmail(to: string, pdfPath: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.fastmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.FASTMAIL_EMAIL,
        pass: process.env.FASTMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.FASTMAIL_EMAIL, 
      to,
      subject: "Transaction Statement",
      text: "Please find your transaction statement attached.",
      attachments: [
        {
          path: pdfPath,
        },
      ],
    };

    const info = (await transporter.sendMail(
      mailOptions
    )) as nodemailer.SentMessageInfo;

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
