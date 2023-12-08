import * as express from "express";
import { generateStatement } from "../../database/src/service";
import { Transaction, generateStatementRequestSchema } from "../../common/validationSchemas";
import { sendEmail as sendEmailService } from "../../email-service/src/service";
import { generatePDF } from "../../pdf-generation/src/service";

const router = express.Router();

router.use(express.json());

router.post('/generate-statement', async (req, res) => {
  try {
    const { date1, date2, user_email } = await generateStatementRequestSchema.parseAsync(req.body);
    const transactions: Transaction[] = await generateStatement(date1, date2, user_email);
    const pdfPath: string = await generatePDF(transactions);

    // Replace 'user-email@example.com' with the actual user's email address
    await sendEmailService(user_email, pdfPath);

    res.status(200).json({ pdfPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

function sendEmail(arg0: string, pdfPath: string) {
  throw new Error("Function not implemented.");
}

