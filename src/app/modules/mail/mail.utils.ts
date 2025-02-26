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

export const MailUtils = {
      transporter
}