import * as express from 'express';
import {generateStatement} from '../database/service';
import { generateStatementRequestSchema } from '../utils/validationSchemas';


const router = express.Router();

router.post("/generate-statement", async (req, res) => {
    try {
        const reqBody = generateStatementRequestSchema.parse(req.body);
        const transactions = await generateStatement(reqBody);
        res.json(transactions);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.errors || "Bad Request" });
    }
});

export default router;
