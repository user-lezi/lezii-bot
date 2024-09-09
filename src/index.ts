import { Client } from "./client";

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login();
