"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashContext = void 0;
const discord_js_1 = require("discord.js");
class SlashContext {
    client;
    interaction;
    constructor(client, interaction) {
        this.client = client;
        this.interaction = interaction;
    }
    get application() {
        return this.client.application;
    }
    get applicationCommands() {
        return this.application.commands.cache;
    }
    get user() {
        return this.interaction.user;
    }
    get guild() {
        return this.interaction.guild;
    }
    get channel() {
        return this.interaction.channel;
    }
    get util() {
        return this.client.util;
    }
    get db() {
        return this.client.db;
    }
    defer() {
        return this.interaction.deferReply().catch(() => null);
    }
    reply(message) {
        return this.interaction.deferred || this.interaction.replied
            ? this.interaction.editReply(message)
            : this.interaction.reply(message);
    }
    join(...str) {
        return str.flat().join("\n");
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    userLink(user) {
        return SlashContext.userLink(user);
    }
    userMention(user) {
        return SlashContext.userMention(user);
    }
    static userLink(user) {
        let id = user instanceof discord_js_1.GuildMember || user instanceof discord_js_1.ThreadMember
            ? user.user.id
            : user instanceof discord_js_1.Message
                ? user.author.id
                : user instanceof discord_js_1.User
                    ? user.id
                    : user;
        return `https://discord.com/users/${id}`;
    }
    static userMention(user) {
        let username = user instanceof discord_js_1.GuildMember || user instanceof discord_js_1.ThreadMember
            ? user.user.username
            : user instanceof discord_js_1.Message
                ? user.author.username
                : user instanceof discord_js_1.User
                    ? user.username
                    : "unknown-user";
        return (0, discord_js_1.hyperlink)(`@${username}`, this.userLink(user));
    }
}
exports.SlashContext = SlashContext;
//# sourceMappingURL=context.js.map