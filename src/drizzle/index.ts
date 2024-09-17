// import { neon } from "@neondatabase/serverless"; // for neon db
import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// const sql = neon(process.env.DATABASE_URL!); // for neon db
const sql = new Client({ connectionString: process.env.DATABASE_URL! });

const main = async () => {
  await sql.connect();
};

main();

export const db = drizzle(sql, { schema });
