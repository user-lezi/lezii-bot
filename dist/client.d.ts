import { Client as _Client, UserResolvable, Collection, User } from "discord.js";
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
    customStatuses: Array<(this: Client) => Promise<string>>;
    constructor();
    isDev(user: UserResolvable): boolean;
    login(): Promise<string>;
    randomUser(noBot?: boolean): User | null;
    randomStatus(): Promise<string | null>;
}
//# sourceMappingURL=client.d.ts.map