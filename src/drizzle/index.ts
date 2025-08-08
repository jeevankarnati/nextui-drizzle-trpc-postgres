// import { neon } from "@neondatabase/serverless"; // for neon db
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// const sql = neon(process.env.DATABASE_URL!); // for neon db
const sql = new Client({ connectionString: process.env.DATABASE_URL! });

// Ensure the PostgreSQL client establishes a connection before it is used.
// Without awaiting the connection, queries may be issued before the client is
// ready which can lead to runtime errors.
await sql.connect();

export const db = drizzle(sql, { schema });
