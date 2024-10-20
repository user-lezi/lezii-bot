import {
  bold,
  ButtonStyle,
  italic,
  messageLink,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../..";

import { PasswordGame } from "../../../classes/Games";
import { type Client } from "../../../client";

export const Games = [{ name: "Password Game", value: "password" }] as {
  name: string;
  value: keyof Client["cache"]["games"];
}[];

export default {
  builder: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Play a game")
    .addSubcommand((sub) =>
      sub
        .setName("uncache")
        .setDescription("Uncache a game")
        .addStringOption((opt) =>
          opt
            .setName("game")
            .setDescription("The game to uncache")
            .setRequired(false)
            .addChoices(...Games),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName("password").setDescription("Play a password game"),
    ),
  defer: false,
  execute: {
    uncache: async function (ctx) {
      let input = ctx.interaction.options.getString("game");
      let gameCmd = ctx.applicationCommands.find((x) => x.name == "game")!;
      if (input) {
        let cache =
          ctx.client.cache.games[input as keyof Client["cache"]["games"]];
        let cached = cache.get(ctx.user.id);
        let game = Games.find((x) => x.value == input)!;
        if (!cached)
          return await ctx.reply({
            content: "No cache found for " + bold(game.name),
            ephemeral: true,
          });
        let exists = await cached.exists();
        if (!exists) {
          cache.delete(ctx.user.id);
          return await ctx.reply({
            content: "No cache found for " + bold(game.name),
            ephemeral: true,
          });
        }
        let m = await ctx.reply({
          content: ctx.join(
            "Are you sure to uncache it or continue the game?",
            `> ${cached.messageLocation() ?? italic("Not Found...")}`,
          ),
          ephemeral: true,
          components: [
            ctx.util.addButtonRow([
              "uncacheconfirm",
              "Uncache?",
              "",
              ButtonStyle.Danger,
            ]),
          ],
        });

        let col = m.createMessageComponentCollector({
          filter: (x) => x.user.id == ctx.user.id,
          time: 20 * 1000,
        });
        col.on("collect", async (i) => {
          await i.deferUpdate().catch(() => {});
          cache.delete(ctx.user.id);
          await m
            .edit({
              content: "Uncached",
              components: [],
            })
            .catch(() => {});
          col.stop("d");
        });
        col.on("end", async (_, r) => {
          if (r == "d") return;
          await m
            .edit({
              content: "Timeout.",
              components: [],
            })
            .catch(() => {});
        });
      } else {
        await ctx.defer();
        /* list all the games that has been cached */
        let list: { name: string; value: string }[] = [];
        let n = 1;
        for (const game of Games) {
          let cache = ctx.client.cache.games[game.value];
          let cached = cache.get(ctx.user.id);
          let cmd = `</game ${game.value}:${gameCmd.id}>`;
          if (cached) {
            let exists = await cached.exists();
            if (!exists) {
              cache.delete(ctx.user.id);
              list.push({
                name: `${n++}. ${game.name}`,
                value: `> ${cmd} - ${bold(`No Cache Found`)}`,
              });
            } else {
              list.push({
                name: `${n++}. ${game.name}`,
                value: ctx.join(
                  `> ${cmd} - ${bold(`Cache Found`)}`,
                  `> At ${cached.messageLocation() ?? italic("Not Found...")}`,
                ),
              });
            }
          } else {
            list.push({
              name: `${n++}. ${game.name}`,
              value: `> ${cmd} - ${bold(`No Cache Found`)}`,
            });
          }
        }
        await ctx.reply({
          embeds: [
            ctx.util
              .embed()
              .addFields(...list)
              .setTitle("Games"),
          ],
          ephemeral: true,
        });
      }
    },
    password: async function (ctx) {
      let existingGame = ctx.client.cache.games.password.get(ctx.user.id);
      if (existingGame) {
        return await ctx.reply({
          content: `You already have a game running! Use **/game uncache** to stop the running game.`,
          ephemeral: true,
        });
      }

      //await ctx.defer();
      let game = new PasswordGame(ctx);
      game.start();
    },
  },
} as SlashCommand<true>;
