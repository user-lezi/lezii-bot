import express, { Express, Request, Response, NextFunction } from "express";
import { Client } from "./client";
export declare function App(client: Client): Promise<void>;
export interface IRoute {
    method: string | string[];
    path: string;
    run: (this: RouteContext) => Promise<void> | void;
}
export declare class Route {
    data: IRoute;
    constructor(data: IRoute);
    listen(app: Express, client: Client): void;
}
export declare class RouteContext {
    req: Request;
    res: Response;
    next: NextFunction;
    client: Client;
    startTime: number;
    constructor(req: Request, res: Response, next: NextFunction, client: Client);
    executionTime(): number;
    send(json: any): express.Response<any, Record<string, any>>;
}
//# sourceMappingURL=app.d.ts.map