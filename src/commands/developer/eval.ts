import { inspect } from "util";
import {
  AttachmentBuilder,
  ButtonStyle,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { DeveloperCommand } from "..";

export default {
  name: "eval",
  execute: async (client, message) => {
    let args = message.content.split(" ").slice(1);
    let code = args.join(" ");
    if (code.length == 0) {
      message.reply("Please provide some code to evaluate!");
      return;
    }
    let results: any;
    try {
      results = await eval(code);
    } catch (e: any) {
      results = e;
    }
    let type = typeof results;
    let resultsString = (type == "object" ? inspect(results) : results) + "";
    let chunks = client.util.stringChunks(resultsString, 4000) ?? [""];
    let embeds: EmbedBuilder[] = [];
    let n = 1;
    for (let chunk of chunks) {
      embeds.push(
        new EmbedBuilder()
          .setTitle("Eval")
          .setDescription(codeBlock("js", chunk))
          .setFooter({
            text: `Page ${n++}/${chunks.length} • ${type} • ${resultsString.length}`,
          }),
      );
    }

    let fileSize = client.util.stringSize(resultsString);

    function createComponents(
      a = true,
      b = true,
      c = true,
      d = true,
      e = true,
      f = true,
      g = true,
    ) {
      return [
        client.util.addButtonRow(
          ["bb", "", "⏪", ButtonStyle.Secondary, a],
          ["b", "", "⬅️", ButtonStyle.Secondary, b],
          ["d", "", "🗑️", ButtonStyle.Danger, c],
          ["f", "", "➡️", ButtonStyle.Secondary, d],
          ["ff", "", "⏩", ButtonStyle.Secondary, e],
        ),
        client.util.addButtonRow(
          ["show", "Show Code", "🔍", ButtonStyle.Secondary, f],
          [
            "file",
            `Download File (${fileSize.MB > 1.1 ? `${fileSize.MB}MB` : `${fileSize.KB}KB`})`,
            "📁",
            ButtonStyle.Secondary,
            g,
          ],
        ),
      ];
    }

    let g = 0;

    let msg = await message.reply({
      embeds: [embeds[g]],
      components: createComponents(
        true,
        true,
        false,
        embeds.length == 1,
        embeds.length == g + 1,
        false,
        false,
      ),
    });
    let collector = msg.createMessageComponentCollector({
      time: 30_000,
      filter: (i) => i.user.id == message.author.id,
    });

    collector.on("collect", async (i) => {
      collector.resetTimer();
      if (i.customId == "d") {
        await msg.delete().catch(() => {});
        return;
      } else if (i.customId == "show") {
        await i.reply({
          embeds: [new EmbedBuilder().setDescription(codeBlock("js", code))],
          ephemeral: true,
        });
        return;
      } else if (i.customId == "file") {
        let fileName = `${msg.id}_results.txt`;
        let file = new AttachmentBuilder(Buffer.from(resultsString), {
          name: fileName,
          description: `Results of the code at https://discord.com/channels/${msg.guild!.id}/${msg.channel!.id}/${msg.id}`,
        });
        await i.reply({
          files: [file],
          ephemeral: true,
        });
      } else {
        await i.deferUpdate().catch(() => {});
        g =
          i.customId == "ff"
            ? embeds.length - 1
            : i.customId == "bb"
              ? 0
              : g + (i.customId == "f" ? 1 : -1);
        await msg.edit({
          embeds: [embeds[g]],
          components: createComponents(
            g == 0,
            g == 0,
            false,
            g == embeds.length - 1,
            g == embeds.length - 1,
            false,
            false,
          ),
        });
      }
    });
    collector.on("end", async () => {
      await msg
        .edit({
          components: createComponents(),
        })
        .catch(() => {});
    });
  },
} as DeveloperCommand;
