import { Message, Events, SlashCommandBuilder, Routes } from "discord.js";
import chalk from "chalk";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { type Client } from "../client";
import { SlashContext } from "./context";

export interface DeveloperCommand {
  name: string;
  execute: (client: Client, message: Message) => void;
}

export type SE = (ctx: SlashContext) => void;
export type SlashExecutor<S extends boolean> = S extends true
  ? Record<string, SE>
  : SE;

export interface SlashCommand<S extends boolean = false> {
  builder: SlashCommandBuilder;
  defer: boolean;
  execute: SlashExecutor<S>;
}

export class CommandManager {
  public developer = new Map<string, DeveloperCommand["execute"]>();
  public commands = new Map<string, SlashCommand<boolean>>();
  constructor(public client: Client) {}
  public load() {
    let devFiles = read("developer");
    let startDevPerf = performance.now();
    let n = 1;
    console.log(chalk.blueBright(`Loading developer commands...`));
    for (let file of devFiles) {
      let command = require(join(__dirname, file)).default as DeveloperCommand;
      this.developer.set(command.name, command.execute);
      console.log(
        `> Loaded '${chalk.green(command.name)}' ${chalk.green(`[${n++}/${devFiles.length}]`)}`,
      );
    }
    console.log(
      `Loaded ${chalk.green(devFiles.length)} developer commands in ${chalk.green(
        `${(performance.now() - startDevPerf).toFixed(2)}ms`,
      )}`,
    );
    this.addDevListener();

    let slashFiles = read("slash");
    let startSlashPerf = performance.now();
    n = 1;
    console.log(chalk.blueBright(`Loading slash commands...`));
    for (let file of slashFiles) {
      let command = require(join(__dirname, file))
        .default as SlashCommand<boolean>;
      this.commands.set(command.builder.name, command);
      console.log(
        `> Loaded '${chalk.green(command.builder.name)}' ${chalk.green(`[${n++}/${slashFiles.length}]`)}`,
      );
    }
    console.log(
      `Loaded ${chalk.green(slashFiles.length)} slash commands in ${chalk.green(
        `${(performance.now() - startSlashPerf).toFixed(2)}ms`,
      )}`,
    );
    this.addSlashListener();
  }

  private addDevListener() {
    let prefix = "--";
    this.client.on(Events.MessageCreate, (message: Message) => {
      if (message.author.bot || !message.content.startsWith(prefix)) return;
      if (!this.client.isDev(message.author.id)) return;
      let commandName = message.content
        .slice(prefix.length)
        .split(" ")[0]
        .toLowerCase();
      let command = this.developer.get(commandName);
      if (!command) return;
      command(this.client, message);
    });
    console.log(chalk.blueBright(`Added dev listener!`));
  }
  private addSlashListener() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      let command = this.commands.get(interaction.commandName);
      if (!command) return;
      let exe = command.execute;
      let ctx = new SlashContext(this.client, interaction);
      if (command.defer) {
        await ctx.interaction.deferReply();
      }
      if (typeof exe == "function") {
        /* Not sub slash command */
        exe(ctx);
      } else {
        /* Sub slash command */
        let sub = (exe as SlashCommand<true>["execute"])[
          interaction.options.getSubcommand(true)
        ];
        if (typeof sub == "function") {
          sub(ctx);
        }
      }
    });
    console.log(chalk.blueBright(`Added slash listener!`));
  }

  public async registerSlashCommands() {
    let slashCommands = [...this.commands.values()].map(
      (command) => command.builder,
    );
    let rest = this.client.rest;
    let start = performance.now();
    await rest.put(Routes.applicationCommands(this.client.user?.id!), {
      body: slashCommands,
    });
    console.log(
      chalk.blueBright(
        `Registered ${slashCommands.length} Slash Commands. Took ${(
          performance.now() - start
        ).toFixed(2)}ms`,
      ),
    );
  }
}

function read(path: string) {
  let files: string[] = [];
  let dir = join(__dirname, path);
  for (let file of readdirSync(dir)) {
    let stat = statSync(join(dir, file));
    if (stat.isDirectory()) {
      files = files.concat(read(join(path, file)));
    } else if (file.endsWith(".js")) {
      files.push(join(path, file));
    }
  }
  return files;
}
