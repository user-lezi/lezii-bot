"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const api = `https://api.urbandictionary.com/v0/define?term=`;
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("define")
        .setDescription("Get the definition from urban dictionary")
        .addStringOption((opt) => opt.setName("word").setDescription(`Enter the word`).setRequired(true)),
    defer: true,
    execute: async (ctx) => {
        let word = ctx.interaction.options.getString("word", true);
        let encodedWord = encodeURIComponent(word);
        let url = api + encodedWord;
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error("");
            }
            let data = (await response.json());
            if (data.list.length == 0) {
                ctx.reply(`> Found no definitions for ${(0, discord_js_1.inlineCode)((0, discord_js_1.escapeInlineCode)(word))}`);
                return;
            }
            let embeds = [];
            let i = 1;
            let found = data.list.length;
            for (const def of data.list) {
                let embed = ctx.util
                    .embed()
                    .setTitle(`Definition #${i++}`)
                    .setURL(def.permalink);
                let definition = ">>> " + parse(def.definition, def.word);
                embed.setDescription(definition);
                let example = ">>> " + parse(def.example, def.word);
                embed.setFields({
                    name: "Example",
                    value: example,
                });
                embed.setFooter({ text: `By ${def.author}` });
                embeds.push(embed);
            }
            function components(i) {
                let def = data.list[i];
                let row1 = ctx.util.addButtonRow([
                    "tu",
                    def.thumbs_up.toLocaleString(),
                    "👍",
                    discord_js_1.ButtonStyle.Secondary,
                    true,
                ], [
                    "td",
                    def.thumbs_down.toLocaleString(),
                    "👎",
                    discord_js_1.ButtonStyle.Secondary,
                    true,
                ]);
                let row2 = ctx.util.addButtonRow(["bb", "", "⏪", discord_js_1.ButtonStyle.Secondary, i == 0], ["b", "", "⬅️", discord_js_1.ButtonStyle.Secondary, i == 0], ["f", "", "➡️", discord_js_1.ButtonStyle.Secondary, i == found - 1], ["ff", "", "⏩", discord_js_1.ButtonStyle.Secondary, i == found - 1]);
                return [row1, row2];
            }
            let g = 0;
            let msg = await ctx.reply({
                embeds: [embeds[0]],
                components: components(g),
            });
            let col = msg.createMessageComponentCollector({
                time: 30 * 1000,
                filter: (i) => i.user.id == ctx.user.id,
            });
            col.on("collect", async (i) => {
                await i.deferUpdate().catch(() => { });
                let cid = i.customId;
                if (cid.length == 1) {
                    g += cid == "b" ? -1 : 1;
                }
                else {
                    g = cid == "bb" ? 0 : found - 1;
                }
                await msg
                    .edit({
                    embeds: [embeds[g]],
                    components: components(g),
                })
                    .catch(() => { });
                col.resetTimer();
            });
        }
        catch (error) {
            console.log(error);
            ctx.reply(":warning: Something went wrong.");
        }
    },
};
function parse(str, word) {
    return str
        .replace(new RegExp(word, "gi"), (m) => (0, discord_js_1.underline)(m))
        .replace(/\[[^\]]+\]/g, (m) => {
        let text = m.slice(1, -1);
        let newText = (0, discord_js_1.bold)((0, discord_js_1.hyperlink)(text, `https://www.google.com/search?q=${encodeURIComponent(text)}`));
        return newText.includes("__")
            ? (0, discord_js_1.underline)(newText.replaceAll("_", ""))
            : newText;
    });
}
//# sourceMappingURL=define.js.map