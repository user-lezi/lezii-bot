"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const client_1 = require("./client");
require("dotenv").config();
const client = new client_1.Client();
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    (0, app_1.App)(client);
});
client.login();
//# sourceMappingURL=index.js.map