import amqp from "amqplib";
import { performFiltering } from "./src/databaseService";

async function connectWithRetry(amqpUrl: string, maxRetries: number = 10) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}: Connecting to RabbitMQ...`);
      const conn = await amqp.connect(amqpUrl);
      console.log("Successfully connected to RabbitMQ");
      return conn;
    } catch (error: any) {
      console.error(`Connection attempt ${retries + 1} failed:`, error.message);
      retries++;
      if (retries < maxRetries) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  throw new Error("All connection attempts failed");
}


async function start() {
  const amqpUrl: string = "amqp://user:password@rabbitmq:5672";
  const inputQueue: string = "statement-request";
  const outputQueue: string = "filtered-data";

  try {
    const conn = await connectWithRetry(amqpUrl);
    const channel = await conn.createChannel();
    console.log("Channel created");

    await channel.assertQueue(inputQueue, { durable: false });
    console.log("Waiting for messages in %s.", inputQueue);

    channel.consume(
      inputQueue,
      async (msg) => {
        if (msg) {
          console.log("Received:", msg.content.toString());

          // Assuming the received message is in JSON format with filtering criteria
          const requestData = JSON.parse(msg.content.toString());

          try {
            // Use the performFiltering function from the separate logic file
            const filteredData = await performFiltering(
              requestData.startDate,
              requestData.endDate,
              requestData.email
            );
            console.log("Filtered data:", filteredData);

            // Send the filtered data to the outputQueue
            channel.sendToQueue(
              outputQueue,
              Buffer.from(JSON.stringify(filteredData))
            );
          } catch (error) {
            console.error("Error performing filtering:", error);
          }

          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
  }
}

start();