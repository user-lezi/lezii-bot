import { Client as _Client, UserResolvable, Collection } from "discord.js";
import { CommandManager } from "./commands";
import { ClientUtils } from "./classes/ClientUtils";
import { PasswordGame } from "./classes/Games";
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
    cache: {
        games: {
            password: Collection<string, PasswordGame>;
        };
    };
    commands: CommandManager;
    util: ClientUtils;
    constructor();
    isDev(user: UserResolvable): boolean;
    login(): Promise<string>;
}
//# sourceMappingURL=client.d.ts.map