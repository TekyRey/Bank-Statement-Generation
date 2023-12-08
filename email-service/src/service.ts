// email-service/src/email-service.ts
import * as nodemailer from "nodemailer";

export async function sendEmail(to: string, pdfPath: string): Promise<void> {
  try {
    // Create a nodemailer transporter using Fastmail SMTP service
    const transporter = nodemailer.createTransport({
      host: "smtp.fastmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "rehema@fastmail.com", // Fastmail email as SMTP server user
        pass: "b2u8rkkvx4zratkt", // Fastmail app password
      },
    });

    // Setup email data with attachments
    const mailOptions = {
      from: "rehema@fastmail.com", // Sender address
      to,
      subject: "Transaction Statement",
      text: "Please find your transaction statement attached.",
      attachments: [
        {
          path: pdfPath,
        },
      ],
    };

    // Send mail with defined transport object
    const info = (await transporter.sendMail(
      mailOptions
    )) as nodemailer.SentMessageInfo;

    // Log the URL to view the sent email in the Fastmail interface
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error
  }
}
