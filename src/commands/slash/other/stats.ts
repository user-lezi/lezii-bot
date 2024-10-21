import {
  bold,
  hyperlink,
  inlineCode,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { SlashCommand } from "../..";

export default {
  builder: new SlashCommandBuilder()
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
      value: ctx.join(
        `> Bot Latency: ${inlineCode(ping + "ms")}`,
        `> Roundtrip Latency: ${inlineCode(roundtrip.toFixed(2) + "ms")}`,
        `> Database Latency: ${inlineCode(dbping.total.toFixed(2) + "ms")}`,
      ),
    });

    /* Statistics */
    embed.addFields({
      name: "📊 | Statistics",
      value: ctx.join(
        `> Server Count: ${inlineCode(count.server.toLocaleString())}`,
        `> Members Count: ${inlineCode(count.members.toLocaleString())}`,
        `> Uniquely Cached Users: ${inlineCode(count.users.toLocaleString())}`,
      ),
    });

    /* Infmarsion */
    let devs = ctx.client._.devs;
    let unfetchedDevs = [] as Promise<User>[];
    for (const dev of devs) {
      unfetchedDevs.push(ctx.client.users.fetch(dev));
    }
    let fetchedDevs = await Promise.all(unfetchedDevs);
    embed.addFields({
      name: "ℹ️ | Information",
      value: ctx.join(
        `> Uptime: ${bold(ctx.util.parseMS(ctx.client.uptime))}`,
        `> Developer: ${bold(fetchedDevs.map((x) => ctx.userMention(x)).join(" | "))}`,
      ),
    });

    /* Versions */
    embed.addFields({
      name: "⚙️ | Versions",
      value: ctx.join(
        `> Node.js: ${inlineCode(versions.node)}`,
        `> Discord.js: ${inlineCode(versions.djs)}`,
        `> Typescript: ${inlineCode(versions.ts)}`,
      ),
    });

    await ctx.reply({
      content: null,
      embeds: [embed],
    });
  },
} as SlashCommand<false>;
