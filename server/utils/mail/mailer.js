import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config();

const mailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
};

export const transporter = nodemailer.createTransport(mailConfig);

export const MailGenerator = new Mailgen({
  theme: 'neopolitan',
  product: {
    name: 'MBanking',
    link: 'https://www.unicreditbank.rs/rs/pi/Digital/mBanking.html',
  },
});
