import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { type Client } from "../client";
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
}
//# sourceMappingURL=ClientUtils.d.ts.map