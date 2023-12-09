// src/database/service.ts
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

import { Transaction } from "./validationSchemas";

const CSV_FILE_PATH = path.join(__dirname, "./transactions.csv");

// Check if the file exists
if (!fs.existsSync(CSV_FILE_PATH)) {
  console.error(`Error: File not found - ${CSV_FILE_PATH}`);
  throw new Error("File not found");
}

// Proceed with reading the file
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
          };

          // Check if the transaction matches the criteria
          if (
            transaction.user_email === email &&
            transaction.date_of_transaction >= startDate &&
            transaction.date_of_transaction <= endDate
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

