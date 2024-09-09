"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "stats",
    execute: (client, message) => {
        let start = performance.now();
        message.reply(`Pinging...`).then((msg) => {
            msg.edit(`Pong! ${client.ws.ping}ms\nLatency: ${msg.createdTimestamp - message.createdTimestamp}ms\nUptime: ${Math.floor(client.uptime / 1000)}s`);
        });
    },
};
//# sourceMappingURL=stats.js.map