// src/database/service.ts
import * as fs from "fs";
import * as csvParser from "csv-parser";
import * as path from 'path';

const CSV_FILE_PATH = path.join(__dirname, 'transactions.csv');

export interface Transaction {
  user_email: string;
  date_of_transaction: string;
  amount: number;
}

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
        const { user_email: userEmail, date_of_transaction, amount } = row;
        if (
          userEmail === user_email &&
          date_of_transaction >= date1 &&
          date_of_transaction <= date2
        ) {
          transactions.push({
            user_email: userEmail,
            date_of_transaction,
            amount: parseFloat(amount),
          });
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
