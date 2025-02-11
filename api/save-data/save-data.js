import { Client } from 'pg'; // Use PostgreSQL or any other database library

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      name,
      contactName,
      contactRole,
      contactEmail,
      answers,
      xSum,
      ySum,
      resultCategory,
      timestamp,
    } = req.body;

    // Set up your database client
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      await client.connect();

      // Save the data to the database
      const result = await client.query(
        'INSERT INTO organization_data (organization_name, contact_name, contact_role, contact_email, question_1, question_2, question_3, question_4, question_5, question_6, question_7, question_8, question_9, question_10, question_11, question_12, x_sum, y_sum, result_category, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)',
        [
          name,
          contactName,
          contactRole,
          contactEmail,
          ...answers,
          xSum,
          ySum,
          resultCategory,
          timestamp,
        ]
      );

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving data to the database' });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
