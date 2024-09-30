import { ChatInputCommandInteraction } from "discord.js";
import { type Client } from "../client";
export declare class SlashContext {
    client: Client;
    interaction: ChatInputCommandInteraction;
    constructor(client: Client, interaction: ChatInputCommandInteraction);
    get application(): import("discord.js").ClientApplication;
    get applicationCommands(): import("discord.js").Collection<string, import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>>;
    get user(): import("discord.js").User;
    get guild(): import("discord.js").Guild | null;
    get channel(): import("discord.js").TextBasedChannel | null;
    get util(): import("../classes/ClientUtils").ClientUtils;
    reply(message: any): Promise<import("discord.js").Message<boolean>>;
    join(...str: (string | string[])[]): string;
    sleep(ms: number): Promise<unknown>;
}
//# sourceMappingURL=context.d.ts.map