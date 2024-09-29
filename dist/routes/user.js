"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
exports.default = new app_1.Route({
    path: "/user/:id",
    method: "get",
    async run() {
        let id = this.req.params.id;
        try {
            let user = await this.client.users.fetch(id);
            this.send(user);
        }
        catch (error) {
            this.send(`Couldnt find a user with id (${id})`);
        }
    },
});
//# sourceMappingURL=user.js.map