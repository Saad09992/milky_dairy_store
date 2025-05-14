import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.USER);
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default connection;
