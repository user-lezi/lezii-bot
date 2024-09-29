import { Route } from "../app";

export default new Route({
  path: "/user/:id",
  method: "get",
  async run() {
    let id = this.req.params.id;
    try {
      let user = await this.client.users.fetch(id);
      this.send(user);
    } catch (error) {
      this.send(`Couldnt find a user with id (${id})`);
    }
  },
});
