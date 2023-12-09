// src/database/service.ts
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

import { Transaction } from "./validationSchemas";

const CSV_FILE_PATH = path.join(__dirname, "./transactions.csv");

if (!fs.existsSync(CSV_FILE_PATH)) {
  console.error(`Error: File not found - ${CSV_FILE_PATH}`);
  throw new Error("File not found");
}


fs.createReadStream(CSV_FILE_PATH);

export async function performFiltering(
  startDate: string,
  endDate: string,
  email: string
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
            currency: row.currency,
            company_name: row.company_name,
          };

          if (
            transaction.user_email === email &&
            transaction.date_of_transaction >= startDate &&
            transaction.date_of_transaction <= endDate &&
            transaction.currency == transaction.currency &&
            transaction.company_name == transaction.company_name
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

