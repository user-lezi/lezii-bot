import { Client } from "./client";
import app from "./app";
require("dotenv").config();
const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  app(client);
});

client.login();
