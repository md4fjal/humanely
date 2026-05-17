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
      from: '"Ensanit Team" <noreply@ensanit.com>',
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
      <h1 style="color: #C8973A; font-weight: 500; margin-bottom: 24px;">Ensanit</h1>
      <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 16px;">Password Reset Request</h2>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
        We received a request to reset the password for your Ensanit account. 
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
    subject: "Reset Your Ensanit Password",
    html,
  });
};

export const sendOtpVerificationEmail = async (
  to: string,
  otp: string,
  name: string,
) => {
  const digits = otp
    .split("")
    .map(
      (d) =>
        `<span style="display: inline-block; background-color: #1E1B2E; color: #C8973A; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; width: 44px; height: 52px; line-height: 52px; text-align: center; border-radius: 6px; border: 1px solid rgba(200,151,58,0.3); margin: 0 4px;">${d}</span>`,
    )
    .join("");

  const html = `
    <div style="font-family: 'Georgia', serif; background-color: #171520; color: #EDE9DF; padding: 40px; text-align: center; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <h1 style="color: #C8973A; font-weight: 500; margin-bottom: 8px;">Ensanit</h1>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">Email Verification</p>

      <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 12px;">Hello, ${name}</h2>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
        Thanks for signing up! Use the verification code below to confirm your email address.
        This code expires in <strong style="color: #EDE9DF;">10 minutes</strong>.
      </p>

      <div style="margin: 0 auto 32px; display: inline-block;">
        ${digits}
      </div>

      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 12px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        If you didn't create an Ensanit account, you can safely ignore this email.
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "Your Ensanit Verification Code",
    html,
  });
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const html = `
    <div style="font-family: 'Georgia', serif; background-color: #171520; color: #EDE9DF; padding: 40px; text-align: center; max-width: 600px; margin: 0 auto; border-radius: 8px;">
      <h1 style="color: #C8973A; font-weight: 500; margin-bottom: 8px;">Ensanit</h1>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">Welcome Aboard</p>

      <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 16px;">You're in, ${name}!</h2>
      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.8; margin-bottom: 32px;">
        Your account has been verified and is ready to go. We're thrilled to have you as part of the Ensanit community — a place built for genuine, meaningful connections.
      </p>

      <div style="background-color: #1E1B2E; border: 1px solid rgba(200,151,58,0.2); border-radius: 8px; padding: 24px; margin-bottom: 32px; text-align: left;">
        <p style="font-family: 'Arial', sans-serif; font-size: 13px; color: #7A7690; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">Get started by:</p>
        <ul style="font-family: 'Arial', sans-serif; font-size: 14px; color: #EDE9DF; line-height: 2; padding-left: 20px; margin: 0;">
          <li>Completing your profile</li>
          <li>Exploring the community</li>
          <li>Connecting with others</li>
        </ul>
      </div>

      <p style="color: #7A7690; font-family: 'Arial', sans-serif; font-size: 12px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
        If you have any questions, feel free to reach out to our support team.<br>
        <span style="color: #C8973A;">The Ensanit Team</span>
      </p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "Welcome to Ensanit",
    html,
  });
};
