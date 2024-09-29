import { App } from "./app";
import { Client } from "./client";

require("dotenv").config();
const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  App(client);
});

client.login();
