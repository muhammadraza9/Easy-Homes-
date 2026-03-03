import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in your .env file");
}

// Assign to a variable first
const prismaConfig = {
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
};

// Then export the variable
export default prismaConfig;
