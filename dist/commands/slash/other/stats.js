"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("stats")
        .setDescription("Shows the bot's statistics/info."),
    defer: true,
    execute: async (ctx) => {
        let roundtrip = performance.now();
        await ctx.reply("*Calculating Roundtrip Latency...*");
        roundtrip = performance.now() - roundtrip;
        let ping = ctx.client.ws.ping;
        let dbping = await ctx.client.db.ping(false);
        let embed = ctx.util.embed().setTitle(`Bot Statistics`);
        let count = {
            server: ctx.client.guilds.cache.size,
            members: ctx.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
            users: ctx.client.users.cache.size,
        };
        let versions = {
            node: process.version,
            djs: "v" + require("discord.js").version,
            ts: "v" + require("typescript").version,
        };
        /* Pings */
        embed.addFields({
            name: "⏱ | Latency",
            value: ctx.join(`> Bot Latency: ${(0, discord_js_1.inlineCode)(ping + "ms")}`, `> Roundtrip Latency: ${(0, discord_js_1.inlineCode)(roundtrip.toFixed(2) + "ms")}`, `> Database Latency: ${(0, discord_js_1.inlineCode)(dbping.total.toFixed(2) + "ms")}`),
        });
        /* Statistics */
        embed.addFields({
            name: "📊 | Statistics",
            value: ctx.join(`> Server Count: ${(0, discord_js_1.inlineCode)(count.server.toLocaleString())}`, `> Members Count: ${(0, discord_js_1.inlineCode)(count.members.toLocaleString())}`, `> Uniquely Cached Users: ${(0, discord_js_1.inlineCode)(count.users.toLocaleString())}`),
        });
        /* Infmarsion */
        let devs = ctx.client._.devs;
        let unfetchedDevs = [];
        for (const dev of devs) {
            unfetchedDevs.push(ctx.client.users.fetch(dev));
        }
        let fetchedDevs = await Promise.all(unfetchedDevs);
        embed.addFields({
            name: "ℹ️ | Information",
            value: ctx.join(`> Uptime: ${(0, discord_js_1.bold)(ctx.util.parseMS(ctx.client.uptime))}`, `> Developer: ${(0, discord_js_1.bold)(fetchedDevs.map((x) => ctx.userMention(x)).join(" | "))}`),
        });
        /* Versions */
        embed.addFields({
            name: "⚙️ | Versions",
            value: ctx.join(`> Node.js: ${(0, discord_js_1.inlineCode)(versions.node)}`, `> Discord.js: ${(0, discord_js_1.inlineCode)(versions.djs)}`, `> Typescript: ${(0, discord_js_1.inlineCode)(versions.ts)}`),
        });
        await ctx.reply({
            content: null,
            embeds: [embed],
        });
    },
};
//# sourceMappingURL=stats.js.map