import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import process from "node:process";
import express from 'express'

config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = 8080;

if (!DATABASE_URL) throw new Error("DATABASE_URL not found.")

const db = drizzle(DATABASE_URL);

const app = express();

app.route('/api/v1/').get((req, res) => {
  res.send('Hello world');
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
