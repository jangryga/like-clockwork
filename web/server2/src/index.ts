import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import process from "node:process";
import express from 'express'
import cors from 'cors';

import { router as authRouter } from './routes/auth'

config();

const DATABASE_URL = process.env.DATABASE_URL;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const PORT = 8080;


if (!DATABASE_URL ) throw new Error("DATABASE_URL not found.")

const db = drizzle(DATABASE_URL);

const app = express();
app.use(cors());
app.use('/auth', authRouter);

app.route('/').get((req, res) => {
  console.log("request", req.headers)
  res.json({ message: "Hello world" });
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
