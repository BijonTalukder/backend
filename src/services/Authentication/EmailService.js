const nodemailer = require('nodemailer');

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;
const SMTP_USER = 'bijan.talukder7@gmail.com';
const SMTP_PASS = 'lajc zkyl gmyg pbpk';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

class EmailService {
  async sendEmail({ to, subject, html }) {
    await transporter.sendMail({
      from: `"Prompt Verse" <${SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }

  sendPasswordReset(email, resetLink) {
    return this.sendEmail({
      to: email,
      subject: 'Reset your Prompt Verse password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2>Reset your password</h2>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#666;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }
}

module.exports = new EmailService();
