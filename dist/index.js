"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
require("dotenv").config();
const client = new client_1.Client();
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});
client.login();
//# sourceMappingURL=index.js.map