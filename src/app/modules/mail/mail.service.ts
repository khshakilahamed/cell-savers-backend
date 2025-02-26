import path from "path";
import config from "../../../config";
import { months } from "./mail.constants";
import { MailUtils } from "./mail.utils";
import { jsPDF } from "jspdf";
import fs from "fs";


const bookingMail = async () => {

      const to = "khshakil.ahamed18@gmail.com";

      const month = months[new Date().getMonth()];
      const date = new Date().getDate();
      const year = new Date().getFullYear();

      const html = `
            <table style="max-width: 500px; margin: 0 auto; background:rgb(236, 251, 253); border-radius: 10px; padding: 20px">
                  <tbody>
                        <tr>
                              <td>
                                    <img style="width: 100px" src="https://i.ibb.co.com/hHqy2x6/cell-Savers-logo.png" alt="Cell Savers"/>
                              </td>
                              <td>
                                    <p style="text-align: right; padding-left: 20px;">${date} ${month}, ${year}</p>
                              </td>
                        </tr>
                        <tr>
                              <td valign="middle" colspan="2">
                                    <table>
                                          <tbody>
                                                <tr>
                                                      <td>
                                                            <h2 style="text-align: center; font-size: 20px; font-weight: bold; padding: 10px 0px;">Your Booking is confirmed</h2>
                                                      </td>
                                                </tr>
                                                <tr>
                                                      <td>
                                                            <div style="text-align: left;">
                                                                  <p>
                                                                        Dear <strong>Kh. Shakil</strong>, 
                                                                        <br>
                                                                        This email is to notify you that your booking is confirmed.
                                                                  </p>
                                                                  <p>The booking receipt is below. You can download it for further requires.</p>
                                                                  <p>
                                                                        Warm Regards,
                                                                        <br/>
                                                                        Cell Savers Team
                                                                  </p>
                                                            </div>
                                                      </td>
                                                </tr>
                                          </tbody>
                                    </table>
                              </td>
                        </tr>

                  </tbody>
            </table>
      `;

      const doc = new jsPDF();

      const imgPath = path.resolve(process.cwd(), "assets", "cellSavers-logo.png");


      const base64Image = fs.readFileSync(imgPath).toString('base64');
      const imageData = `data:image/png;base64,${base64Image}`;

      doc.addImage(imageData, "PNG", 10, 20, 50, 50);

      doc.text("Hello world!", 10, 10);

      // Define the output PDF file path
      const pdfPath = path.resolve(process.cwd(), "output.pdf");

      const pdfData = Buffer.from(doc.output("arraybuffer"));

      // Save the PDF to a file
      fs.writeFileSync(pdfPath, pdfData);
      console.log(`PDF saved successfully at: ${pdfPath}`);

      await MailUtils.transporter.sendMail({
            from: `Cell Savers ${config.user}`, // sender address
            to: to, // list of receivers
            subject: 'Booking Confirmation', // Subject line
            // text: 'Hello world?', // plain text body
            html: html, // html body
            attachments: [
                  {
                        filename: 'Booking-receipt.pdf',
                        path: pdfPath,
                  }
            ],
      });

      return 'success';
}

export const MailService = {
      bookingMail,
}