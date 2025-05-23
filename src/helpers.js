const bcrypt = require("bcryptjs")
require("dotenv").config()
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, code, subject }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Yuno <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: #4285F4; padding: 25px; text-align: center; color: white;">
            <h1 style="margin: 0; font-weight: 400; font-size: 22px;">${subject}</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 25px; background: #ffffff; line-height: 1.5;">
            <div style="
              background: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              ${typeof code === 'string' ? 'font-size: 20px;' : ''}
              font-weight: bold;
              word-break: break-all;
            ">
              ${typeof code === 'string' 
                ? code.split("\n").map(line => `<p style="margin: 0.5em 0;">${line}</p>`).join('')
                : code
              }
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Yuno. All rights reserved.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (e) {
    console.error('Email sending failed:', e);
    return false;
  }
};


module.exports = {
  hashPassword,
  comparePassword,
  sendEmail
}   