// src/database/service.ts
import * as fs from "fs";
import * as csvParser from "csv-parser";
import * as path from "path";

import { Transaction } from "../utils/validationSchemas";

const CSV_FILE_PATH = path.join(__dirname, "transactions.csv");

export async function generateStatement(
  date1: string,
  date2: string,
  user_email: string
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          const transaction = {
            user_email: row.user_email,
            date_of_transaction: row.date_of_transaction,
            amount: parseFloat(row.amount),
          };

          // Check if the transaction matches the criteria
          if (
            transaction.user_email === user_email &&
            transaction.date_of_transaction >= date1 &&
            transaction.date_of_transaction <= date2
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
