"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const app_1 = __importDefault(require("./app"));
require("dotenv").config();
const client = new client_1.Client();
client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    (0, app_1.default)(client);
});
client.login();
//# sourceMappingURL=index.js.map