import nodemailer from 'nodemailer';
import config from '../../../config';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: config.user,
    pass: config.app_pass,
  },
});

export const sendEmail = async (to: string, html: string) => {
  await transporter.sendMail({
    from: config.user, // sender address
    to: to, // list of receivers
    subject: 'Password Reset', // Subject line
    // text: 'Hello world?', // plain text body
    html: html, // html body
  });
};
