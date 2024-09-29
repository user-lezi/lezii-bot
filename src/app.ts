import chalk from "chalk";
import express from "express";
import { Client } from "./client";

export default async function (client: Client) {
  const app = express();
  app.set("json spaces", 2);
  app.use(express.urlencoded());
  app.use(express.json());

  app.listen(2000, () => {
    console.log(chalk.greenBright("Server Running..."));
  });
}
