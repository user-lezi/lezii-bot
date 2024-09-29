import { Route } from "../app";

export default new Route({
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
