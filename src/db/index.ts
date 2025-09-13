import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  uri: process.env.DATABASE_URL,
  dateStrings: true, // return dates as strings
  supportBigNumbers: true,
  bigNumberStrings: true,
});

export const db = drizzle(pool, {
  schema,
  mode: "default",
});

// // src/db/db.ts
// import mysql from "mysql2/promise";
// import { drizzle } from "drizzle-orm/mysql2";
// import * as schema from "./schema"; // 👈 import schema here

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// export const db = drizzle(pool, { schema, mode: "default" }); // 👈 pass schema and mode here
