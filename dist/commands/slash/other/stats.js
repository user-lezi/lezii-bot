"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("stats")
        .setDescription("Shows the bot's statistics."),
    defer: true,
    execute: async (ctx) => {
        let ping = ctx.client.ws.ping;
        let embed = ctx.util.embed();
        embed.setDescription(ctx.join(`**Ping:** ${ping}ms`, `**Guilds:** ${ctx.client.guilds.cache.size}`, `**Users:** ${ctx.client.users.cache.size}`));
        ctx.reply({ embeds: [embed] });
    },
};
//# sourceMappingURL=stats.js.map