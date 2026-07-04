import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || "8080",
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: process.env.APP_NAME || "PulseRoute",
  APP_VERSION: process.env.APP_VERSION || "0.1.0",
};