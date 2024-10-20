import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { type Client } from "../client";
import Parser from "ms-utility";
export declare const TimeParser: Parser;
export type ICE = [string, string, number, number, string];
export declare class ClientUtils {
    #private;
    constructor(client: Client);
    get client(): Client;
    addButton(id: string, label: string, emoji: string, style: ButtonStyle, disabled?: boolean): ButtonBuilder;
    addButtonRow(...btns: Parameters<ClientUtils["addButton"]>[]): ActionRowBuilder<ButtonBuilder>;
    stringChunks(str: string, length?: number): [] | RegExpMatchArray;
    stringSize(str: string): {
        size: number;
        KB: number;
        MB: number;
    };
    parseMS(ms: number): string;
    roundN(n: number, decimals?: number): number;
    embed(): EmbedBuilder;
    shuffleArr<T>(arr: T[], n?: number): T[];
    getElements(s: string): ICE[];
}
//# sourceMappingURL=ClientUtils.d.ts.map