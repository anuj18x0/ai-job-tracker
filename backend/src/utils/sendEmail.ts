import { Resend } from 'resend';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions) => {

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_MAIL = process.env.MAIL_FROM as string;

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in the environment variables');
  }

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: FROM_MAIL,
    to: [options.email],
    subject: options.subject,
    text: options.message,
  });

  if (error) {
    console.log('Resend API Error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }

  console.log('Message sent successfully via Resend API. ID: %s', data?.id);
};

export default sendEmail;
