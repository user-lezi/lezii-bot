import chalk from "chalk";
import express, { Express, Request, Response, NextFunction } from "express";
import { Client } from "./client";
import { readdirSync } from "fs";
import { join } from "path";

export async function App(client: Client) {
  const app = express();
  app.set("json spaces", 2);
  app.use(express.urlencoded());
  app.use(express.json());
  app.all("/", (req, res) => {
    res.send("uwu");
  });

  let routeFiles = readdirSync(join(__dirname, "routes"));
  for (const file of routeFiles) {
    if (!file.endsWith(".js")) continue;

    let res = (await import(join(__dirname, "routes", file))) as {
      default: Promise<Route>;
    };
    let route = res.default;

    (await route).listen(app, client);
  }

  app.all("/*", (req, res) => {
    res.status(404);
  });

  app.listen(5500, () => {
    console.log(chalk.greenBright("Server Running..."));
  });
}

export interface IRoute {
  method: string | string[];
  path: string;
  run: (this: RouteContext) => Promise<void> | void;
}
export class Route {
  constructor(public data: IRoute) {}
  public listen(app: Express, client: Client) {
    let run = this.data.run;
    let methods = Array.isArray(this.data.method)
      ? this.data.method
      : [this.data.method];
    for (let i = 0; i < methods.length; i++) {
      app[methods[i] as "get" | "post" | "delete" | "all"](
        this.data.path,
        (req, res, next) => {
          let ctx = new RouteContext(req, res, next, client);
          run.bind(ctx)();
        },
      );
      console.log(
        chalk.greenBright(
          `> Listening to ${chalk.green(methods[i].toUpperCase())} ${this.data.path}`,
        ),
      );
    }
  }
}
export class RouteContext {
  public startTime = performance.now();
  constructor(
    public req: Request,
    public res: Response,
    public next: NextFunction,
    public client: Client,
  ) {}

  public executionTime() {
    return performance.now() - this.startTime;
  }

  public send(json: any) {
    let data = {
      data: json,
      executionTime: this.executionTime(),
    };

    return this.res.json(Boolean(this.req.query.simple) ? data.data : data);
  }
}
