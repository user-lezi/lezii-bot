import { Collection } from "discord.js";
import commandsJson from "../json/commands.json";

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

class _RawCommands extends Collection<string, ICommand> {
  public categories = new Collection<string, string[]>();
}
const RawCommands = new _RawCommands();
commandsJson.forEach((x) => {
  let cmd = {
    name: x.name,
    category: x.category,
    description: x.description,
    options: x.options,
  } as ICommand;
  RawCommands.categories.set(
    x.category,
    (RawCommands.categories.get(x.category) ?? []).concat(x.name),
  );
  RawCommands.set(cmd.name, cmd);
});

export { RawCommands };
