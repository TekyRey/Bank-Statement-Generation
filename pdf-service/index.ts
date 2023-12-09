import amqp from "amqplib";
import { generatePDF, createDummyPDF } from "./src/pdfGenerator";

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
  const queue: string = "filtered-data";
  const outputQueue = "pdf";

  try {
    const conn = await connectWithRetry(amqpUrl);
    const channel = await conn.createChannel();
    console.log("Channel created");

    await channel.assertQueue(queue, { durable: false });
    console.log("Waiting for messages in %s.", queue);

    channel.consume(
      queue,
      async (msg) => {
        if (msg) {
          console.log("Received:", msg.content.toString());
        // extract data
        const data = JSON.parse(msg.content.toString());

        // make it accessible for the generatePDF function(format it so generatePDF can use it)
        const transactions = data.map((transaction: any) => {
          return {
            date_of_transaction: transaction.date_of_transaction,
            user_email: transaction.user_email,
            amount: transaction.amount,
          };
        });
        // call generatePDF function
        const pdfLocation = await generatePDF(transactions);
        console.log(`PDF generated at: ${pdfLocation}`);
        //   let pdfLocation = await createDummyPDF();
          channel.sendToQueue(
            outputQueue,
            Buffer.from(
              JSON.stringify({
                locationOfPdf: pdfLocation,
                userEmail: "mwakabayah@gmail.com",
              })
            )
          );
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
