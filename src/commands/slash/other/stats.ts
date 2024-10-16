import { bold, hyperlink, SlashCommandBuilder, User } from "discord.js";
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

    let embed = ctx.util.embed().setTitle(`Bot Statistics`);

    let count = {
      server: ctx.client.guilds.cache.size,
      members: ctx.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
    };

    /* Pings */
    embed.addFields({
      name: "Latency",
      value: ctx.join(
        `Bot Latency: ${bold(ping + "ms")}`,
        `Roundtrip Latency: ${bold(roundtrip.toFixed(2) + "ms")}`,
      ),
    });

    /* Statistics */
    embed.addFields({
      name: "Statistics",
      value: ctx.join(
        `Server Count: ${bold(count.server.toLocaleString())}`,
        `Members Count: ${bold(count.members.toLocaleString())}`,
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
      name: "Information",
      value: ctx.join(
        `Uptime: ${bold(ctx.util.parseMS(ctx.client.uptime))}`,
        `Developer: ${bold(fetchedDevs.map((x) => ctx.userLink(x)).join(" | "))}`,
      ),
    });

    await ctx.reply({
      content: "*Calculated*",
      embeds: [embed],
    });
  },
} as SlashCommand<false>;
