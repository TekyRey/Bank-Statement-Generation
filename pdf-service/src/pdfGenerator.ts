import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { Transaction } from "./validationSchemas";

export async function generatePDF(
  transactions: Transaction[]
): Promise<string> {
  const pdfPath = path.join("/path/to/pdf", "transaction_statement.pdf");
  const pdfDoc = new PDFDocument();

  pdfDoc.pipe(fs.createWriteStream(pdfPath));

  pdfDoc
    .fontSize(16)
    .text("Transaction Statement", { align: "center" })
    .moveDown(0.5);

  if (transactions.length === 0) {
    pdfDoc.text("No transactions found for the specified period.");
  } else {
    pdfDoc.font("Helvetica-Bold").fontSize(12);

    const startX = 50;
    const lineHeight = 20;
    let currentY = 100;

    pdfDoc.text("Date", startX, currentY);
    pdfDoc.text("Email", startX + 100, currentY);
    pdfDoc.text("Amount", startX + 300, currentY);
    pdfDoc.text("Company", startX + 400, currentY);
    
    for (const transaction of transactions) {
      currentY += lineHeight;
      pdfDoc.text(transaction.date_of_transaction, startX, currentY);
      pdfDoc.text(transaction.user_email, startX + 100, currentY);
      pdfDoc.text(transaction.amount.toString() + transaction.currency, startX + 300, currentY);
      pdfDoc.text(transaction.company_name ?? "", startX + 400, currentY);
    }
  }


  pdfDoc.end();

  return pdfPath;
}
