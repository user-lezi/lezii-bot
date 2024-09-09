"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const path_1 = require("path");
const context_1 = require("./context");
class CommandManager {
    client;
    developer = new Map();
    commands = new Map();
    constructor(client) {
        this.client = client;
    }
    load() {
        let devFiles = read("developer");
        let startDevPerf = performance.now();
        let n = 1;
        console.log(chalk_1.default.blueBright(`Loading developer commands...`));
        for (let file of devFiles) {
            let command = require((0, path_1.join)(__dirname, file)).default;
            this.developer.set(command.name, command.execute);
            console.log(`> Loaded '${chalk_1.default.green(command.name)}' ${chalk_1.default.green(`[${n++}/${devFiles.length}]`)}`);
        }
        console.log(`Loaded ${chalk_1.default.green(devFiles.length)} developer commands in ${chalk_1.default.green(`${(performance.now() - startDevPerf).toFixed(2)}ms`)}`);
        this.addDevListener();
        let slashFiles = read("slash");
        let startSlashPerf = performance.now();
        n = 1;
        console.log(chalk_1.default.blueBright(`Loading slash commands...`));
        for (let file of slashFiles) {
            let command = require((0, path_1.join)(__dirname, file))
                .default;
            this.commands.set(command.builder.name, command);
            console.log(`> Loaded '${chalk_1.default.green(command.builder.name)}' ${chalk_1.default.green(`[${n++}/${slashFiles.length}]`)}`);
        }
        console.log(`Loaded ${chalk_1.default.green(slashFiles.length)} slash commands in ${chalk_1.default.green(`${(performance.now() - startSlashPerf).toFixed(2)}ms`)}`);
        this.addSlashListener();
    }
    addDevListener() {
        let prefix = "--";
        this.client.on(discord_js_1.Events.MessageCreate, (message) => {
            if (message.author.bot || !message.content.startsWith(prefix))
                return;
            if (!this.client.isDev(message.author.id))
                return;
            let commandName = message.content
                .slice(prefix.length)
                .split(" ")[0]
                .toLowerCase();
            let command = this.developer.get(commandName);
            if (!command)
                return;
            command(this.client, message);
        });
        console.log(chalk_1.default.blueBright(`Added dev listener!`));
    }
    addSlashListener() {
        this.client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            let command = this.commands.get(interaction.commandName);
            if (!command)
                return;
            let exe = command.execute;
            let ctx = new context_1.SlashContext(this.client, interaction);
            if (command.defer) {
                await ctx.interaction.deferReply();
            }
            if (typeof exe == "function") {
                /* Not sub slash command */
                exe(ctx);
            }
            else {
                /* Sub slash command */
                let sub = exe[interaction.options.getSubcommand(true)];
                if (typeof sub == "function") {
                    sub(ctx);
                }
            }
        });
        console.log(chalk_1.default.blueBright(`Added slash listener!`));
    }
    async registerSlashCommands() {
        let slashCommands = [...this.commands.values()].map((command) => command.builder);
        let rest = this.client.rest;
        let start = performance.now();
        await rest.put(discord_js_1.Routes.applicationCommands(this.client.user?.id), {
            body: slashCommands,
        });
        console.log(chalk_1.default.blueBright(`Registered ${slashCommands.length} Slash Commands. Took ${(performance.now() - start).toFixed(2)}ms`));
    }
}
exports.CommandManager = CommandManager;
function read(path) {
    let files = [];
    let dir = (0, path_1.join)(__dirname, path);
    for (let file of (0, fs_1.readdirSync)(dir)) {
        let stat = (0, fs_1.statSync)((0, path_1.join)(dir, file));
        if (stat.isDirectory()) {
            files = files.concat(read((0, path_1.join)(path, file)));
        }
        else if (file.endsWith(".js")) {
            files.push((0, path_1.join)(path, file));
        }
    }
    return files;
}
//# sourceMappingURL=index.js.map