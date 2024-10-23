import { Client as _Client, UserResolvable, Collection, User, ApplicationCommand, GuildResolvable } from "discord.js";
import { CommandManager } from "./commands";
import { ClientUtils } from "./classes/ClientUtils";
import { PasswordGame } from "./classes/Games";
import { Database } from "discord-channel.db";
import { ICommand } from "./rawCommands";
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
    db: Database;
    rawCommands: {
        categories: Collection<string, string[]>;
        constructor: import("@discordjs/collection").CollectionConstructor;
        ensure(key: string, defaultValueGenerator: (key: string, collection: any) => ICommand): ICommand;
        hasAll(...keys: string[]): boolean;
        hasAny(...keys: string[]): boolean;
        first(): ICommand | undefined;
        first(amount: number): ICommand[];
        firstKey(): string | undefined;
        firstKey(amount: number): string[];
        last(): ICommand | undefined;
        last(amount: number): ICommand[];
        lastKey(): string | undefined;
        lastKey(amount: number): string[];
        at(index: number): ICommand | undefined;
        keyAt(index: number): string | undefined;
        random(): ICommand | undefined;
        random(amount: number): ICommand[];
        randomKey(): string | undefined;
        randomKey(amount: number): string[];
        reverse(): any;
        find<V2 extends ICommand>(fn: (value: ICommand, key: string, collection: any) => value is V2): V2 | undefined;
        find(fn: (value: ICommand, key: string, collection: any) => unknown): ICommand | undefined;
        find<This, V2 extends ICommand>(fn: (this: This, value: ICommand, key: string, collection: any) => value is V2, thisArg: This): V2 | undefined;
        find<This>(fn: (this: This, value: ICommand, key: string, collection: any) => unknown, thisArg: This): ICommand | undefined;
        findKey<K2 extends string>(fn: (value: ICommand, key: string, collection: any) => key is K2): K2 | undefined;
        findKey(fn: (value: ICommand, key: string, collection: any) => unknown): string | undefined;
        findKey<This, K2 extends string>(fn: (this: This, value: ICommand, key: string, collection: any) => key is K2, thisArg: This): K2 | undefined;
        findKey<This>(fn: (this: This, value: ICommand, key: string, collection: any) => unknown, thisArg: This): string | undefined;
        sweep(fn: (value: ICommand, key: string, collection: any) => unknown): number;
        sweep<T>(fn: (this: T, value: ICommand, key: string, collection: any) => unknown, thisArg: T): number;
        filter<K2 extends string>(fn: (value: ICommand, key: string, collection: any) => key is K2): Collection<K2, ICommand>;
        filter<V2 extends ICommand>(fn: (value: ICommand, key: string, collection: any) => value is V2): Collection<string, V2>;
        filter(fn: (value: ICommand, key: string, collection: any) => unknown): Collection<string, ICommand>;
        filter<This, K2 extends string>(fn: (this: This, value: ICommand, key: string, collection: any) => key is K2, thisArg: This): Collection<K2, ICommand>;
        filter<This, V2 extends ICommand>(fn: (this: This, value: ICommand, key: string, collection: any) => value is V2, thisArg: This): Collection<string, V2>;
        filter<This>(fn: (this: This, value: ICommand, key: string, collection: any) => unknown, thisArg: This): Collection<string, ICommand>;
        partition<K2 extends string>(fn: (value: ICommand, key: string, collection: any) => key is K2): [Collection<K2, ICommand>, Collection<Exclude<string, K2>, ICommand>];
        partition<V2 extends ICommand>(fn: (value: ICommand, key: string, collection: any) => value is V2): [Collection<string, V2>, Collection<string, Exclude<ICommand, V2>>];
        partition(fn: (value: ICommand, key: string, collection: any) => unknown): [Collection<string, ICommand>, Collection<string, ICommand>];
        partition<This, K2 extends string>(fn: (this: This, value: ICommand, key: string, collection: any) => key is K2, thisArg: This): [Collection<K2, ICommand>, Collection<Exclude<string, K2>, ICommand>];
        partition<This, V2 extends ICommand>(fn: (this: This, value: ICommand, key: string, collection: any) => value is V2, thisArg: This): [Collection<string, V2>, Collection<string, Exclude<ICommand, V2>>];
        partition<This>(fn: (this: This, value: ICommand, key: string, collection: any) => unknown, thisArg: This): [Collection<string, ICommand>, Collection<string, ICommand>];
        flatMap<T>(fn: (value: ICommand, key: string, collection: any) => Collection<string, T>): Collection<string, T>;
        flatMap<T, This>(fn: (this: This, value: ICommand, key: string, collection: any) => Collection<string, T>, thisArg: This): Collection<string, T>;
        map<T>(fn: (value: ICommand, key: string, collection: any) => T): T[];
        map<This, T>(fn: (this: This, value: ICommand, key: string, collection: any) => T, thisArg: This): T[];
        mapValues<T>(fn: (value: ICommand, key: string, collection: any) => T): Collection<string, T>;
        mapValues<This, T>(fn: (this: This, value: ICommand, key: string, collection: any) => T, thisArg: This): Collection<string, T>;
        some(fn: (value: ICommand, key: string, collection: any) => unknown): boolean;
        some<T>(fn: (this: T, value: ICommand, key: string, collection: any) => unknown, thisArg: T): boolean;
        every<K2 extends string>(fn: (value: ICommand, key: string, collection: any) => key is K2): this is Collection<K2, ICommand>;
        every<V2 extends ICommand>(fn: (value: ICommand, key: string, collection: any) => value is V2): this is Collection<string, V2>;
        every(fn: (value: ICommand, key: string, collection: any) => unknown): boolean;
        every<This, K2 extends string>(fn: (this: This, value: ICommand, key: string, collection: any) => key is K2, thisArg: This): this is Collection<K2, ICommand>;
        every<This, V2 extends ICommand>(fn: (this: This, value: ICommand, key: string, collection: any) => value is V2, thisArg: This): this is Collection<string, V2>;
        every<This>(fn: (this: This, value: ICommand, key: string, collection: any) => unknown, thisArg: This): boolean;
        reduce<T = ICommand>(fn: (accumulator: T, value: ICommand, key: string, collection: any) => T, initialValue?: T | undefined): T;
        each(fn: (value: ICommand, key: string, collection: any) => void): any;
        each<T>(fn: (this: T, value: ICommand, key: string, collection: any) => void, thisArg: T): any;
        tap(fn: (collection: any) => void): any;
        tap<T>(fn: (this: T, collection: any) => void, thisArg: T): any;
        clone(): Collection<string, ICommand>;
        concat(...collections: import("discord.js").ReadonlyCollection<string, ICommand>[]): Collection<string, ICommand>;
        equals(collection: import("discord.js").ReadonlyCollection<string, ICommand>): boolean;
        sort(compareFunction?: import("@discordjs/collection").Comparator<string, ICommand> | undefined): any;
        intersect<T>(other: import("discord.js").ReadonlyCollection<string, T>): Collection<string, T>;
        subtract<T>(other: import("discord.js").ReadonlyCollection<string, T>): Collection<string, ICommand>;
        difference<T>(other: import("discord.js").ReadonlyCollection<string, T>): Collection<string, ICommand | T>;
        merge<T, R>(other: import("discord.js").ReadonlyCollection<string, T>, whenInSelf: (value: ICommand, key: string) => import("@discordjs/collection").Keep<R>, whenInOther: (valueOther: T, key: string) => import("@discordjs/collection").Keep<R>, whenInBoth: (value: ICommand, valueOther: T, key: string) => import("@discordjs/collection").Keep<R>): Collection<string, R>;
        sorted(compareFunction?: import("@discordjs/collection").Comparator<string, ICommand> | undefined): Collection<string, ICommand>;
        toJSON(): ICommand[];
        clear(): void;
        delete(key: string): boolean;
        forEach(callbackfn: (value: ICommand, key: string, map: Map<string, ICommand>) => void, thisArg?: any): void;
        get(key: string): ICommand | undefined;
        has(key: string): boolean;
        set(key: string, value: ICommand): any;
        readonly size: number;
        entries(): MapIterator<[string, ICommand]>;
        keys(): MapIterator<string>;
        values(): MapIterator<ICommand>;
        [Symbol.iterator](): MapIterator<[string, ICommand]>;
        readonly [Symbol.toStringTag]: string;
    };
    customStatuses: Array<(this: Client) => Promise<string>>;
    constructor();
    isDev(user: UserResolvable): boolean;
    login(): Promise<string>;
    randomUser(noBot?: boolean): User | null;
    randomStatus(): Promise<string | null>;
    randomQuote(): Promise<Record<"author" | "quote", string>>;
    findCommand(s: string): {
        json: ICommand | undefined;
        app: ApplicationCommand<{
            guild: GuildResolvable;
        }> | undefined;
    };
}
//# sourceMappingURL=client.d.ts.map