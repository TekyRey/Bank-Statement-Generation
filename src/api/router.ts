import * as express from 'express';
import {generateStatement} from '../database/service';
import {generateStatementRequestSchema} from '../utils/validationSchemas';


const router = express.Router();

// Define your routes here
router.post('/generate-statement', async (req, res) => {
    try {
        const { date1, date2, user_email } = generateStatementRequestSchema.parse(req.body);
        const transactions = await generateStatement(date1, date2, user_email); // Fix: Pass the arguments to generateStatement function call
        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
