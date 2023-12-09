// api-service/src/app.ts
import express from "express";
import bodyParser from "body-parser";
import { ZodError } from "zod";
import { connect, Channel } from "amqplib";

import { TransactionRequestSchema } from "./validationSchemas";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/generate-statement", async (req, res) => {
   try {
     const validData = TransactionRequestSchema.parse(req.body);

     // Send the valid data to RabbitMQ
     const connection = await connect("amqp://rabbitmq:5672");
     const channel = await connection.createChannel();
     await channel.assertQueue("transactions");
     channel.sendToQueue(
       "transactions",
       Buffer.from(JSON.stringify(validData))
     );

     res.json({ message: "Transaction request sent for processing." });
   } catch (error) {
     if (error instanceof ZodError) {
       res.status(400).json({ error: "Invalid input data." });
     } else {
       console.error(error);
       res.status(500).json({ error: "Internal server error." });
     }
   }
});

app.listen(port, () => {
  console.log(`API Service is running at http://localhost:${port}`);
});
