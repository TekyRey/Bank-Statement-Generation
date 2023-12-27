# SQL QUERIES INTERVIEW SOLUTIONS

1. Transaction Success rate

   ```sql
   SELECT
    merchant_name,
    COUNT(CASE WHEN transaction_status = 'Success' THEN 1 END) AS successful_transactions,
    COUNT(*) AS total_transactions,
    (COUNT(CASE WHEN transaction_status = 'Success' THEN 1 END) * 1.0 / COUNT(*)) * 100 AS success_rate
   FROM
    transactions
   GROUP BY
    merchant_name;


2. Find the user who made the highest number of "Purchase" transactions within a single day.

   ```sql
   SELECT
    user_id,
    MAX(transaction_date) AS transaction_date,
    MAX(daily_total) AS daily_total
   FROM (
    SELECT
        user_id,
        SUBSTR(transaction_timestamp, 1, 8) AS transaction_date,
        SUM(transaction_amount) AS daily_total,
        RANK() OVER (PARTITION BY SUBSTR(transaction_timestamp, 1, 8) ORDER BY SUM(transaction_amount) DESC) AS rnk
    FROM
        transactions
    WHERE
        transaction_type = 'Purchase'
    GROUP BY
        user_id,
        transaction_date
   ) ranked
   WHERE rnk = 1
   GROUP BY
    user_id
   ORDER BY
    transaction_date;

3. Find User with Largest First Transaction

   ```sql
   SELECT
    ft.user_id,
    MAX(t.transaction_amount) AS largest_first_transaction
   FROM (
    SELECT
        user_id,
        MIN(transaction_timestamp) AS first_transaction_timestamp
    FROM
        transactions
    GROUP BY
        user_id
   ) ft
   JOIN transactions t ON t.user_id = ft.user_id
                  AND t.transaction_timestamp = ft.first_transaction_timestamp
   GROUP BY
    ft.user_id
   ORDER BY
    largest_first_transaction DESC
   LIMIT 1;

4. Average Transaction Amount by Day of the Week

     ```sql
     SELECT
    CASE CAST(strftime('%w', datetime(
        '20' || substr(transaction_timestamp, 7, 2) || '-' || substr(transaction_timestamp, 1, 2) || '-' || substr(transaction_timestamp, 4, 2) || ' ' || substr(transaction_timestamp, 10),
        'localtime'
    )) AS INTEGER)
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END AS day_of_week,
    AVG(transaction_amount) AS average_transaction_amount
   FROM
    transactions
   WHERE
    transaction_timestamp IS NOT NULL
   GROUP BY
    day_of_week
   ORDER BY
    MIN(strftime('%w', datetime(
        '20' || substr(transaction_timestamp, 7, 2) || '-' || substr(transaction_timestamp, 1, 2) || '-' || substr(transaction_timestamp, 4, 2) || ' ' || substr(transaction_timestamp, 10),
        'localtime'
    )));

5. Transaction Seasonality Analysis
   Question: Determine the seasonality pattern of transactions by calculating the monthly transaction count deviation from the 12-month moving average.

   ```sql
   SELECT
    substr(transaction_timestamp, 7, 4) || '-' || substr(transaction_timestamp, 1, 2) AS month,
    COUNT(*) AS transaction_count,
    AVG(COUNT(*)) OVER (ORDER BY substr(transaction_timestamp, 7, 4) || '-' || substr(transaction_timestamp, 1, 2) ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS moving_average,
    COUNT(*) - AVG(COUNT(*)) OVER (ORDER BY substr(transaction_timestamp, 7, 4) || '-' || substr(transaction_timestamp, 1, 2) ROWS BETWEEN 11 PRECEDING AND CURRENT ROW) AS deviation
   FROM
    transactions
   WHERE
    transaction_timestamp IS NOT NULL
   GROUP BY
    substr(transaction_timestamp, 7, 4) || '-' || substr(transaction_timestamp, 1, 2)
   ORDER BY
    month;

7. Transaction Trend by Month and Merchant

   ```sql
   SELECT
    substr(transaction_timestamp, 7, 4) || '-' || substr(transaction_timestamp, 1, 2) AS month,
    merchant_name,
    COUNT(*) AS transaction_count
    FROM
    transactions
    WHERE
    transaction_timestamp IS NOT NULL
    GROUP BY
    month, merchant_name
    ORDER BY
    month, merchant_name;
