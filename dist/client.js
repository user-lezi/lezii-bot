"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const ClientUtils_1 = require("./classes/ClientUtils");
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
    constructor() {
        super({
            intents: ["Guilds", "GuildMessages", "MessageContent"],
        });
        this.commands.load();
        this.on("ready", () => {
            this.commands.registerSlashCommands();
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
        });
        this.on("interactionCreate", async (interaction) => {
            if (interaction.isModalSubmit()) {
                let customId = interaction.customId;
                let [_, gameName, id] = customId.split("_");
                if (_ !== "game")
                    return;
                if (id !== interaction.user.id)
                    return;
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
                if (id !== interaction.user.id)
                    return;
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
}
exports.Client = Client;
//# sourceMappingURL=client.js.map