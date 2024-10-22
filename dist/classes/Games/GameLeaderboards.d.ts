import { TGame, TPasswordScore } from ".";
import { Client } from "../../client";
import { ActionRowBuilder, Message, MessageActionRowComponentBuilder, StringSelectMenuBuilder } from "discord.js";
export type ValueTypes = TPasswordScore;
export declare const LeaderboardEmojis: {
    first: string;
    second: string;
    third: string;
    next: string;
    other: string;
};
export type IValue<T> = {
    key: string;
    value: T;
    type: string;
    createdTimestamp: number;
    editedTimestamp: number;
    _id: string;
};
export declare class BaseLeaderboard<T = ValueTypes[], S extends string = string> {
    client: Client;
    sliceLength: number;
    values: IValue<T>[];
    sortingTypes: S[];
    sorterEmojis: Record<S, string>;
    defaultSort: S;
    sliceIndex: number;
    Game: TGame;
    constructor(client: Client, sliceLength: number);
    get db(): import("discord-channel.db").Database;
    get size(): number;
    init(): Promise<void>;
    fetchValues(g: string): Promise<{
        key: string;
        value: any;
        type: string;
        createdTimestamp: number;
        editedTimestamp: number;
        _id: string;
    }[]>;
    sort(sortBy?: S): Promise<void>;
    _format(caller: (value: IValue<T>, index: number) => string): string[];
    list(): string[];
    components<C extends ActionRowBuilder<MessageActionRowComponentBuilder>[]>(uid: string): C[];
    interact(msg: Message): Promise<unknown>;
}
export type TPasswordValues = "length" | "time";
export declare class PasswordGameLeaderboard extends BaseLeaderboard<TPasswordScore[], TPasswordValues> {
    constructor(client: Client, sliceLength: number);
    init(): Promise<void>;
    sort(sortBy?: TPasswordValues): Promise<void>;
    list(valueType?: TPasswordValues): string[];
    components(uid: string): (ActionRowBuilder<import("discord.js").ButtonBuilder> | ActionRowBuilder<StringSelectMenuBuilder>)[];
    interact(msg: Message): Promise<unknown>;
}
//# sourceMappingURL=GameLeaderboards.d.ts.map