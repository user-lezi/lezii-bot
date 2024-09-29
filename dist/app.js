"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteContext = exports.Route = void 0;
exports.App = App;
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const path_1 = require("path");
async function App(client) {
    const app = (0, express_1.default)();
    app.set("json spaces", 2);
    app.use(express_1.default.urlencoded());
    app.use(express_1.default.json());
    app.all("/", (req, res) => {
        res.send("uwu");
    });
    let routeFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "routes"));
    for (const file of routeFiles) {
        if (!file.endsWith(".js"))
            continue;
        let res = (await Promise.resolve(`${(0, path_1.join)(__dirname, "routes", file)}`).then(s => __importStar(require(s))));
        let route = res.default;
        (await route).listen(app, client);
    }
    app.all("/*", (req, res) => {
        res.status(404);
    });
    app.listen(5500, () => {
        console.log(chalk_1.default.greenBright("Server Running..."));
    });
}
class Route {
    data;
    constructor(data) {
        this.data = data;
    }
    listen(app, client) {
        let run = this.data.run;
        let methods = Array.isArray(this.data.method)
            ? this.data.method
            : [this.data.method];
        for (let i = 0; i < methods.length; i++) {
            app[methods[i]](this.data.path, (req, res, next) => {
                let ctx = new RouteContext(req, res, next, client);
                run.bind(ctx)();
            });
            console.log(chalk_1.default.greenBright(`> Listening to ${chalk_1.default.green(methods[i].toUpperCase())} ${this.data.path}`));
        }
    }
}
exports.Route = Route;
class RouteContext {
    req;
    res;
    next;
    client;
    startTime = performance.now();
    constructor(req, res, next, client) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.client = client;
    }
    executionTime() {
        return performance.now() - this.startTime;
    }
    send(json) {
        let data = {
            data: json,
            executionTime: this.executionTime(),
        };
        return this.res.json(Boolean(this.req.query.simple) ? data.data : data);
    }
}
exports.RouteContext = RouteContext;
//# sourceMappingURL=app.js.map