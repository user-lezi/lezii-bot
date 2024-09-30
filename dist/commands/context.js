"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashContext = void 0;
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
}
exports.SlashContext = SlashContext;
//# sourceMappingURL=context.js.map