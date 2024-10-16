import { ChatInputCommandInteraction, Message, User, UserResolvable } from "discord.js";
import { type Client } from "../client";
export declare class SlashContext {
    client: Client;
    interaction: ChatInputCommandInteraction;
    constructor(client: Client, interaction: ChatInputCommandInteraction);
    get application(): import("discord.js").ClientApplication;
    get applicationCommands(): import("discord.js").Collection<string, import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>>;
    get user(): User;
    get guild(): import("discord.js").Guild | null;
    get channel(): import("discord.js").TextBasedChannel | null;
    get util(): import("../classes/ClientUtils").ClientUtils;
    defer(): Promise<import("discord.js").InteractionResponse<boolean> | null>;
    reply(message: any): Promise<Message<boolean>>;
    join(...str: (string | string[])[]): string;
    sleep(ms: number): Promise<unknown>;
    userLink(user: UserResolvable): `https://discord.com/users/${string}`;
}
//# sourceMappingURL=context.d.ts.map