import * as fs from "fs";
import * as csvParser from "csv-parser";
import * as path from "path";

import {
  transactionSchema,
  Transaction as TransactionType,
  GenerateStatementRequest as GenerateStatementRequestType,
} from "../utils/validationSchemas";

const CSV_FILE_PATH = path.join(__dirname, "transactions.csv");

export async function generateStatement(
  reqBody: GenerateStatementRequestType
): Promise<TransactionType[]> {
  const transactions: TransactionType[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csvParser())
    .on("data", (row) => {
        try {
            const transaction = transactionSchema.parse(row);
            if (
                transaction.user_email === reqBody.user_email &&
                transaction.date_of_transaction >= reqBody.date1 &&
                transaction.date_of_transaction <= reqBody.date2
            ) {
                transactions.push(transaction);
            }
        } catch (error: any) {
            console.error(`Error parsing row: ${error.message}`);
        }
    })
      .on("end", () => {
        resolve(transactions);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
