import sgMail, {ResponseError} from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  if (!apiKey) {
    console.error('SendGrid API key is not configured');
    throw new Error('Email service is not configured properly');
  }

  if (!fromEmail) {
    console.error('Sender email is not configured');
    throw new Error('Email service is not configured properly');
  }

  sgMail.setApiKey(apiKey);

  try {
    if (process.env.NODE_ENV === "development") {
      console.log('Attempting to send email:', {
        to,
        from: fromEmail,
        subject,
      });
    }

    return await sgMail.send({
      to,
      from: fromEmail,
      subject,
      html,
    });
  } catch (error) {
    if (error instanceof ResponseError) {
      console.error('SendGrid error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.body,
      });
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
} 