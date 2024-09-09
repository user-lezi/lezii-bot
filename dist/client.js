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
            channel.send(message);
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