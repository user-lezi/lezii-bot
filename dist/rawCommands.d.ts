import { Collection } from "discord.js";
export interface ICommandOption {
    name: string;
    description: string;
    type: string;
    required: boolean;
}
export interface ICommand {
    name: string;
    category: string;
    description: {
        main: string;
        more: string | null;
    };
    options: ICommandOption[];
}
declare class _RawCommands extends Collection<string, ICommand> {
    categories: Collection<string, string[]>;
}
declare const RawCommands: _RawCommands;
export { RawCommands };
//# sourceMappingURL=rawCommands.d.ts.map