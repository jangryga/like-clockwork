import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import process from "node:process";

config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("DATABASE_URL not found.")

const db = drizzle(DATABASE_URL);
