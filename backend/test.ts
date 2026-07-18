import "dotenv/config";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const url = new URL(process.env.DATABASE_URL!);

console.log({
  user: url.username,
  password: url.password,
  host: url.hostname,
  db: url.pathname,
});