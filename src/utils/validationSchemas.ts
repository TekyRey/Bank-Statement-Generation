// src/utils/validationSchemas.ts
import { z } from "zod";

export const transactionSchema = z.object({
  user_email: z.string().email(),
  date_of_transaction: z.string().refine(
    (value) => {
      return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    },
    { message: "Invalid date format. Use ISO 8601 format." }
  ),
  amount: z.number(),
});

export const generateStatementRequestSchema = z.object({
    date1: z.string().refine(
        (value) => {
        return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
        },
        { message: "Invalid date format. Use ISO 8601 format." }
    ),
    date2: z.string().refine(
        (value) => {
        return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
        },
        { message: "Invalid date format. Use ISO 8601 format." }
    ),
    user_email: z.string().email(),
    });

export type Transaction = z.infer<typeof transactionSchema>;
export type GenerateStatementRequest = z.infer<typeof generateStatementRequestSchema>;
