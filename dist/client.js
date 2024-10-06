"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const ClientUtils_1 = require("./classes/ClientUtils");
const chalk_1 = __importDefault(require("chalk"));
class Client extends discord_js_1.Client {
    _ = {
        devs: ["910837428862984213"],
        channels: {
            readyLog: "1282594208980533251",
        },
        color: {
            main: 0xb3c6ff,
        },
    };
    cache = {
        games: {
            password: new discord_js_1.Collection(),
        },
    };
    commands = new commands_1.CommandManager(this);
    util = new ClientUtils_1.ClientUtils(this);
    customStatuses;
    constructor() {
        super({
            intents: ["Guilds", "GuildMessages", "MessageContent"],
        });
        this.commands.load();
        this.customStatuses = [
            async () => `${this.guilds.cache.size} Guilds FR`,
            async () => `${this.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Users FR`,
            async () => `Touch some grass`,
            async () => `Try out /${this.application.commands.cache.random().name}`,
            async () => {
                let a = this.randomUser();
                let r = ["hello {}", "{} needs to touch some grass."];
                return a
                    ? r[Math.floor(Math.random() * r.length)].replace("{}", `@${a.username}`)
                    : `uwu`;
            },
            async () => {
                let total = this.customStatuses.length;
                return `The probability of showing up this text is 1/${total} (~${(100 / total).toFixed(2)}%)`;
            },
        ];
        this.on("ready", () => {
            this.commands
                .registerSlashCommands()
                .then(() => this.application
                .fetch()
                .then(() => (console.log(chalk_1.default.greenBright("!! Fetched the application information")),
                1) &&
                this.application.commands
                    .fetch()
                    .then(() => console.log(chalk_1.default.greenBright("!! Fetched all the application commands")))));
            let channel = this.channels.cache.get(this._.channels.readyLog);
            let message = {
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Ready")
                        .setDescription(`Bot Online!`)
                        .setColor(this._.color.main),
                ],
            };
            channel?.send(message);
            setInterval(this.randomStatus.bind(this), 30 * 1000);
        });
        this.on("interactionCreate", async (interaction) => {
            if (interaction.isModalSubmit()) {
                let customId = interaction.customId;
                let [_, gameName, id] = customId.split("_");
                if (_ !== "game")
                    return;
                if (id !== interaction.user.id) {
                    interaction
                        .reply({
                        ephemeral: true,
                        content: "no.",
                    })
                        .catch(() => { });
                    return;
                }
                if (gameName === "password") {
                    let game = this.cache.games.password.get(id);
                    if (!game)
                        return;
                    game.listenModal(interaction);
                }
            }
            if (interaction.isButton()) {
                let customId = interaction.customId;
                let [_, gameName, id] = customId.split("_");
                if (_ !== "gamebtn")
                    return;
                if (id !== interaction.user.id) {
                    interaction
                        .reply({
                        ephemeral: true,
                        content: "no.",
                    })
                        .catch(() => { });
                    return;
                }
                if (gameName === "password") {
                    let game = this.cache.games.password.get(id);
                    if (!game)
                        return;
                    game.listenButton(interaction);
                }
            }
        });
    }
    isDev(user) {
        let uid = typeof user == "string" ? user : "user" in user ? user.user?.id : user.id;
        return this._.devs.includes(uid ?? "");
    }
    login() {
        return super.login(process.env.BotToken);
    }
    randomUser(noBot = true) {
        try {
            let found = this.users.cache.random();
            return found ? (found.bot && noBot ? this.randomUser() : found) : null;
        }
        catch {
            return null;
        }
    }
    async randomStatus() {
        let randomIndex = Math.floor(Math.random() * this.customStatuses.length);
        let status = this.customStatuses[randomIndex].bind(this);
        this.user.setActivity(await status(), {
            type: discord_js_1.ActivityType.Custom,
        });
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map