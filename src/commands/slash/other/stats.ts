import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../..";

export default {
  builder: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Shows the bot's statistics."),
  defer: true,
  execute: async (ctx) => {
    let ping = ctx.client.ws.ping;
    let embed = ctx.util.embed();

    embed.setDescription(
      ctx.join(
        `**Ping:** ${ping}ms`,
        `**Guilds:** ${ctx.client.guilds.cache.size}`,
        `**Users:** ${ctx.client.users.cache.size}`,
      ),
    );

    ctx.reply({ embeds: [embed] });
  },
} as SlashCommand<false>;
