import config from "../../../config";
import { MailUtils } from "../mail/mail.utils";


export const sendEmail = async (to: string, html: string) => {
  await MailUtils.transporter.sendMail({
    from: config.user, // sender address
    to: to, // list of receivers
    subject: 'Password Reset', // Subject line
    // text: 'Hello world?', // plain text body
    html: html, // html body
  });
};
