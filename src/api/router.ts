import * as express from 'express';
import {generateStatement} from '../database/service';


const router = express.Router();

// Define your routes here
router.post('/generate-statement', async (req, res) => {
    try {
        const { date1, date2, user_email } = req.body;
        const transactions = await generateStatement(date1, date2, user_email);
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

export default router;
