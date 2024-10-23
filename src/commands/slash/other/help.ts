import {
  bold,
  ButtonStyle,
  EmbedBuilder,
  heading,
  HeadingLevel,
  hyperlink,
  inlineCode,
  quote,
  SlashCommandBuilder,
  subtext,
} from "discord.js";
import { SlashCommand } from "../..";
import { Client } from "../../../client";

export default {
  builder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gets the list of commands present in the bot.")
    .addStringOption((opt) =>
      opt
        .setName("command")
        .setDescription(
          "The command name that you want to get information about.",
        ),
    ),
  defer: true,
  execute: async (ctx) => {
    let raw = ctx.client.rawCommands;
    let input = ctx.interaction.options.getString("command");
    /* Command List */
    if (!input) {
      let categories = raw.categories;
      let categoryEmbeds: EmbedBuilder[] = [];
      /* Information page */
      categoryEmbeds.push(
        ctx.util
          .embed()
          .setFooter({
            iconURL: ctx.user.displayAvatarURL(),
            text: "@" + ctx.user.username,
          })
          .setTimestamp()
          .setDescription(
            ctx.join(
              heading(`Command List | Home Page`),
              subtext(
                `Get more information about a specfic command using ${inlineCode(`/help <command_name>`)}`,
              ),
              heading(`Categories`, HeadingLevel.Two),
              ...categories.map((x, y) =>
                quote(bold(hyperlink(y, "https://google.com"))),
              ),
            ),
          )
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/1298595211747786803.webp?size=128&quality=lossless",
          ),
      );
      for (const cat of categories) {
        let _embed = ctx.util
          .embed()
          .setFooter({
            iconURL: ctx.user.displayAvatarURL(),
            text: "@" + ctx.user.username,
          })
          .setTimestamp()
          .setThumbnail(
            "https://cdn.discordapp.com/emojis/1298595211747786803.webp?size=128&quality=lossless",
          );

        _embed.setDescription(
          ctx.join(
            heading(`Command List | ${cat[0]} Page`),
            subtext(
              `Get more information about a specfic command using ${inlineCode(`/help <command_name>`)}`,
            ),
            ...cat[1].map((x) => {
              let cmd = ctx.client.findCommand(x);
              return `${heading(`</${cmd.json?.name}:${cmd.app?.id}>`, HeadingLevel.Three)}\n${bold(cmd.json!.description.main)}`;
            }),
          ),
        );
        categoryEmbeds.push(_embed);
      }

      function components(i: number) {
        let r = ctx.util.addButtonRow(
          ["bb", "", "⏪", ButtonStyle.Secondary, i == 0],
          ["b", "", "⬅️", ButtonStyle.Secondary, i == 0],
          [
            "f",
            "",
            "➡️",
            ButtonStyle.Secondary,
            i == categoryEmbeds.length - 1,
          ],
          [
            "ff",
            "",
            "⏩",
            ButtonStyle.Secondary,
            i == categoryEmbeds.length - 1,
          ],
        );
        return [r];
      }

      let categoryIndex = 0;
      let msg = await ctx.reply({
        embeds: [categoryEmbeds[categoryIndex]],
        components: components(categoryIndex),
      });

      let col = msg.createMessageComponentCollector({
        time: 30 * 1000,
        filter: (i) => i.user.id == ctx.user.id,
      });
      col.on("collect", async (i) => {
        await i.deferUpdate().catch(() => {});
        let cid = i.customId;
        if (cid.length == 1) {
          categoryIndex += cid == "b" ? -1 : 1;
        } else {
          categoryIndex = cid == "bb" ? 0 : categoryEmbeds.length - 1;
        }
        await msg
          .edit({
            embeds: [categoryEmbeds[categoryIndex]],
            components: components(categoryIndex),
          })
          .catch(() => {});
        col.resetTimer();
      });

      col.on("end", async () => {
        await msg
          .edit({
            components: [],
          })
          .catch(() => {});
      });

      return;
    }

    let cmd = ctx.client.findCommand(input);
    if (!cmd.app || !cmd.json) {
      return ctx.reply(`Couldnt find ${bold(input)}`);
    }
    let embed = ctx.util
      .embed()
      .setTimestamp()
      .setFooter({
        iconURL: ctx.user.displayAvatarURL(),
        text: `@${ctx.user.username} • ${cmd.json.category}`,
      })
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/1298607771444318249.webp?size=128&quality=lossless",
      );

    embed.setDescription(
      ctx.join(
        heading(`Command Info | </${cmd.json.name}:${cmd.app.id}>`),
        cmd.json.description.main +
          (cmd.json.description.more
            ? "\n" + quote(cmd.json.description.more)
            : ""),
      ),
    );
    if (cmd.json.options.length) {
      embed.setDescription(
        ctx.join(
          embed.data.description!,
          heading("Options", HeadingLevel.Three),
        ),
      );
      for (let i = 0; i < cmd.json.options.length; i++) {
        const opt = cmd.json.options[i];
        embed.addFields({
          name: `${i + 1}. ${opt.name}`,
          value: ctx.join(
            bold(opt.description),
            quote(`Required: ${bold(opt.required ? "yes" : "no")}`),
            quote(`Type: ${inlineCode(opt.type)}`),
          ),
        });
      }
    }
    return ctx.reply({
      embeds: [embed],
    });
  },
} as SlashCommand<false>;
