import * as express from "express";
import amqp from "amqplib";

const router = express.Router();
const amqpUrl = "amqp://user:password@rabbitmq:5672";

router.use(express.json());

router.post("/generate-statement", async (req, res) => {
  const { startDate, endDate, email } = req.body;
  try {
    const conn = await amqp.connect(amqpUrl);
    const channel = await conn.createChannel();
    const queue = "statement-request";

    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ startDate, endDate, email }))
    );

    res.status(200).json({ status: "Data sent to RabbitMQ" });
    setTimeout(() => {
      channel.close();
      conn.close();
    }, 500);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

