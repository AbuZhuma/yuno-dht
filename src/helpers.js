const bcrypt = require("bcryptjs")

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
const nodemailer = require('nodemailer');

const sendEmail = async ({ email, code, subject }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4285F4; padding: 20px; text-align: center; color: white;">
        <h1>${subject}</h1>
      </div>
      <div style="padding: 20px;">
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold;">
          ${code}
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: subject,
    html: htmlTemplate,
    text: `${code}`  
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return false;
  }
};


module.exports = {
    hashPassword,
    comparePassword, 
    sendEmail
}   