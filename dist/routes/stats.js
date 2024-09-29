"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
exports.default = new app_1.Route({
    method: "get",
    path: "/stats",
    run() {
        this.send({
            ping: this.client.ws.ping,
            servers: this.client.guilds.cache.size,
            users: this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
        });
    },
});
//# sourceMappingURL=stats.js.map