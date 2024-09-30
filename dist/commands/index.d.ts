import { Message, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { type Client } from "../client";
import { SlashContext } from "./context";
export interface DeveloperCommand {
    name: string;
    execute: (client: Client, message: Message) => void;
}
export type SE = (ctx: SlashContext) => void;
export type SlashExecutor<S extends boolean> = S extends true ? Record<string, SE> : SE;
export interface SlashCommand<S extends boolean = false> {
    builder: S extends true ? SlashCommandSubcommandsOnlyBuilder : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    defer: boolean;
    execute: SlashExecutor<S>;
}
export declare class CommandManager {
    client: Client;
    developer: Map<string, (client: Client, message: Message) => void>;
    commands: Map<string, SlashCommand<boolean>>;
    constructor(client: Client);
    load(): void;
    private addDevListener;
    private addSlashListener;
    registerSlashCommands(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map