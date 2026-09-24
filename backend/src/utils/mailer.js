import nodemailer from "nodemailer";

let transporter = null;

export async function getTransporter() {
  if (transporter) return transporter;
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Fallback log transport for dev/demo mode
    transporter = {
      sendMail: async (options) => {
        console.log(`[Email Triggered] To: ${options.to} | Subject: ${options.subject}`);
        return { messageId: `mock-${Date.now()}` };
      }
    };
  }

  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const mailer = await getTransporter();
    const result = await mailer.sendMail({
      from: process.env.SMTP_FROM || '"AgriTrade Platform" <notifications@agritrade.com>',
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ""),
      html
    });
    return result;
  } catch (error) {
    console.error("Failed to send email notification:", error.message);
    return null;
  }
}
