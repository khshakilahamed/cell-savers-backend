import fs from "fs";
import jsPDF from "jspdf";
import path from "path";

const bookingReceipt = () => {
      const doc = new jsPDF();

      const imgPath = path.resolve(process.cwd(), "assets", "cellSavers-logo.png");


      const base64Image = fs.readFileSync(imgPath).toString('base64');
      const imageData = `data:image/png;base64,${base64Image}`;

      doc.addImage(imageData, "PNG", 10, 10, 50, 15);

      // doc.text("Hello world!", 10, 10);

      // Define the output PDF file path
      const pdfPath = path.resolve(process.cwd(), "output.pdf");

      const pdfData = Buffer.from(doc.output("arraybuffer"));

      // Save the PDF to a file
      fs.writeFileSync(pdfPath, pdfData);
      console.log(`PDF saved successfully at: ${pdfPath}`);
}

export const PdfService = {
      bookingReceipt,
}