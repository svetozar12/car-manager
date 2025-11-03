import nodemailer from 'nodemailer';
import { Envs } from './env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: Envs.GMAIL_EMAIL,
    pass: Envs.GMAIL_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html = '') {
  if (Envs.DISABLE_MAIL) {
    logger.info('Emails are disabled');
    logger.info('=========== Your email content ===========');
    logger.info(['TO', to]);
    logger.info(['SUBJECT:', subject]);
    logger.info('HTML:', html);

    return;
  }

  const info = await transporter.sendMail({
    from: Envs.GMAIL_EMAIL,
    to,
    subject,
    html,
    secure: true,
  });

  console.log('Message sent:', info.messageId);
}
