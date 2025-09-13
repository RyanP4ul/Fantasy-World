import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts", // Path to your Drizzle schema file
  out: "./drizzle",             // Folder where generated SQL & types will go
  dialect: "mysql",             // Use mysql for MariaDB
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
  },
} satisfies Config;
