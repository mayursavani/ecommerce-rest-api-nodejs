const nodeMailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const config = require("../config/config");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.MAIL_SENDER,
      pass: config.MAIL_SENDER_PASSWORD,
    },
  });

  let senderInfo = await transporter.sendMail({
    from: "Hey, <abc@gmail.com>",
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log("message sent: %s", senderInfo.messageId);

//   console.log("Preview URL is %s", nodeMailer.getTestMessageUrl(senderInfo));
});

module.exports = { sendEmail };
