import { Client as _Client, UserResolvable } from "discord.js";
import { CommandManager } from "./commands";
import { ClientUtils } from "./classes/ClientUtils";
export declare class Client extends _Client<true> {
    _: {
        devs: string[];
        channels: {
            readyLog: string;
        };
        color: {
            main: number;
        };
    };
    commands: CommandManager;
    util: ClientUtils;
    constructor();
    isDev(user: UserResolvable): boolean;
    login(): Promise<string>;
}
//# sourceMappingURL=client.d.ts.map