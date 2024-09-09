"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const discord_js_1 = require("discord.js");
exports.default = {
    name: "eval",
    execute: async (client, message) => {
        let args = message.content.split(" ").slice(1);
        let code = args.join(" ");
        if (code.length == 0) {
            message.reply("Please provide some code to evaluate!");
            return;
        }
        let results;
        try {
            results = await eval(code);
        }
        catch (e) {
            results = e;
        }
        let type = typeof results;
        let resultsString = (type == "object" ? (0, util_1.inspect)(results) : results) + "";
        let chunks = client.util.stringChunks(resultsString, 4000) ?? [""];
        let embeds = [];
        let n = 1;
        for (let chunk of chunks) {
            embeds.push(new discord_js_1.EmbedBuilder()
                .setTitle("Eval")
                .setDescription((0, discord_js_1.codeBlock)("js", chunk))
                .setFooter({
                text: `Page ${n++}/${chunks.length} • ${type} • ${resultsString.length}`,
            }));
        }
        let fileSize = client.util.stringSize(resultsString);
        function createComponents(a = true, b = true, c = true, d = true, e = true, f = true, g = true) {
            return [
                client.util.addButtonRow(["bb", "", "⏪", discord_js_1.ButtonStyle.Secondary, a], ["b", "", "⬅️", discord_js_1.ButtonStyle.Secondary, b], ["d", "", "🗑️", discord_js_1.ButtonStyle.Danger, c], ["f", "", "➡️", discord_js_1.ButtonStyle.Secondary, d], ["ff", "", "⏩", discord_js_1.ButtonStyle.Secondary, e]),
                client.util.addButtonRow(["show", "Show Code", "🔍", discord_js_1.ButtonStyle.Secondary, f], [
                    "file",
                    `Download File (${fileSize.MB > 1.1 ? `${fileSize.MB}MB` : `${fileSize.KB}KB`})`,
                    "📁",
                    discord_js_1.ButtonStyle.Secondary,
                    g,
                ]),
            ];
        }
        let g = 0;
        let msg = await message.reply({
            embeds: [embeds[g]],
            components: createComponents(true, true, false, embeds.length == 1, embeds.length == g + 1, false, false),
        });
        let collector = msg.createMessageComponentCollector({
            time: 30000,
            filter: (i) => i.user.id == message.author.id,
        });
        collector.on("collect", async (i) => {
            collector.resetTimer();
            if (i.customId == "d") {
                await msg.delete().catch(() => { });
                return;
            }
            else if (i.customId == "show") {
                await i.reply({
                    embeds: [new discord_js_1.EmbedBuilder().setDescription((0, discord_js_1.codeBlock)("js", code))],
                    ephemeral: true,
                });
                return;
            }
            else if (i.customId == "file") {
                let fileName = `${msg.id}_results.txt`;
                let file = new discord_js_1.AttachmentBuilder(Buffer.from(resultsString), {
                    name: fileName,
                    description: `Results of the code at https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`,
                });
                await i.reply({
                    files: [file],
                    ephemeral: true,
                });
            }
            else {
                await i.deferUpdate().catch(() => { });
                g =
                    i.customId == "ff"
                        ? embeds.length - 1
                        : i.customId == "bb"
                            ? 0
                            : g + (i.customId == "f" ? 1 : -1);
                await msg.edit({
                    embeds: [embeds[g]],
                    components: createComponents(g == 0, g == 0, false, g == embeds.length - 1, g == embeds.length - 1, false, false),
                });
            }
        });
        collector.on("end", async () => {
            await msg
                .edit({
                components: createComponents(),
            })
                .catch(() => { });
        });
    },
};
//# sourceMappingURL=eval.js.map