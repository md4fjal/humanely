import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    let transporter: nodemailer.Transporter;

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      console.log("Using Ethereal email for testing");
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: '"Humanely Team" <noreply@humanely.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Message sent: %s", info.messageId);

    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const html = `
    <div style="font-family: 'Georgia', serif; background-color: #171520; color: #EDE9DF; padding: 40px; text-align: center; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <h1 style="color: #C8973A; font-weight: 500; margin-bottom: 24px;">Humanely</h1>
      <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 16px;">Password Reset Request</h2>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
        We received a request to reset the password for your Humanely account. 
        If you didn't make this request, you can safely ignore this email.
      </p>
      <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #C8973A, #a67c30); color: #171520; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; margin-bottom: 32px;">
        Reset Password
      </a>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 12px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="color: #C8973A; word-break: break-all;">${resetLink}</span>
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "Reset Your Humanely Password",
    html,
  });
};
