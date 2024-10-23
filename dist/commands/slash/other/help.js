"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Gets the list of commands present in the bot.")
        .addStringOption((opt) => opt
        .setName("command")
        .setDescription("The command name that you want to get information about.")),
    defer: true,
    execute: async (ctx) => {
        let raw = ctx.client.rawCommands;
        let input = ctx.interaction.options.getString("command");
        /* Command List */
        if (!input) {
            let categories = raw.categories;
            let categoryEmbeds = [];
            /* Information page */
            categoryEmbeds.push(ctx.util
                .embed()
                .setFooter({
                iconURL: ctx.user.displayAvatarURL(),
                text: "@" + ctx.user.username,
            })
                .setTimestamp()
                .setDescription(ctx.join((0, discord_js_1.heading)(`Command List | Home Page`), (0, discord_js_1.subtext)(`Get more information about a specfic command using ${(0, discord_js_1.inlineCode)(`/help <command_name>`)}`), (0, discord_js_1.heading)(`Categories`, discord_js_1.HeadingLevel.Two), ...categories.map((x, y) => (0, discord_js_1.quote)((0, discord_js_1.bold)((0, discord_js_1.hyperlink)(y, "https://google.com"))))))
                .setThumbnail("https://cdn.discordapp.com/emojis/1298595211747786803.webp?size=128&quality=lossless"));
            for (const cat of categories) {
                let _embed = ctx.util
                    .embed()
                    .setFooter({
                    iconURL: ctx.user.displayAvatarURL(),
                    text: "@" + ctx.user.username,
                })
                    .setTimestamp()
                    .setThumbnail("https://cdn.discordapp.com/emojis/1298595211747786803.webp?size=128&quality=lossless");
                _embed.setDescription(ctx.join((0, discord_js_1.heading)(`Command List | ${cat[0]} Page`), (0, discord_js_1.subtext)(`Get more information about a specfic command using ${(0, discord_js_1.inlineCode)(`/help <command_name>`)}`), ...cat[1].map((x) => {
                    let cmd = ctx.client.findCommand(x);
                    return `${(0, discord_js_1.heading)(`</${cmd.json?.name}:${cmd.app?.id}>`, discord_js_1.HeadingLevel.Three)}\n${(0, discord_js_1.bold)(cmd.json.description.main)}`;
                })));
                categoryEmbeds.push(_embed);
            }
            function components(i) {
                let r = ctx.util.addButtonRow(["bb", "", "⏪", discord_js_1.ButtonStyle.Secondary, i == 0], ["b", "", "⬅️", discord_js_1.ButtonStyle.Secondary, i == 0], [
                    "f",
                    "",
                    "➡️",
                    discord_js_1.ButtonStyle.Secondary,
                    i == categoryEmbeds.length - 1,
                ], [
                    "ff",
                    "",
                    "⏩",
                    discord_js_1.ButtonStyle.Secondary,
                    i == categoryEmbeds.length - 1,
                ]);
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
                await i.deferUpdate().catch(() => { });
                let cid = i.customId;
                if (cid.length == 1) {
                    categoryIndex += cid == "b" ? -1 : 1;
                }
                else {
                    categoryIndex = cid == "bb" ? 0 : categoryEmbeds.length - 1;
                }
                await msg
                    .edit({
                    embeds: [categoryEmbeds[categoryIndex]],
                    components: components(categoryIndex),
                })
                    .catch(() => { });
                col.resetTimer();
            });
            col.on("end", async () => {
                await msg
                    .edit({
                    components: [],
                })
                    .catch(() => { });
            });
            return;
        }
        let cmd = ctx.client.findCommand(input);
        if (!cmd.app || !cmd.json) {
            return ctx.reply(`Couldnt find ${(0, discord_js_1.bold)(input)}`);
        }
        let embed = ctx.util
            .embed()
            .setTimestamp()
            .setFooter({
            iconURL: ctx.user.displayAvatarURL(),
            text: `@${ctx.user.username} • ${cmd.json.category}`,
        })
            .setThumbnail("https://cdn.discordapp.com/emojis/1298607771444318249.webp?size=128&quality=lossless");
        embed.setDescription(ctx.join((0, discord_js_1.heading)(`Command Info | </${cmd.json.name}:${cmd.app.id}>`), cmd.json.description.main +
            (cmd.json.description.more
                ? "\n" + (0, discord_js_1.quote)(cmd.json.description.more)
                : "")));
        if (cmd.json.options.length) {
            embed.setDescription(ctx.join(embed.data.description, (0, discord_js_1.heading)("Options", discord_js_1.HeadingLevel.Three)));
            for (let i = 0; i < cmd.json.options.length; i++) {
                const opt = cmd.json.options[i];
                embed.addFields({
                    name: `${i + 1}. ${opt.name}`,
                    value: ctx.join((0, discord_js_1.bold)(opt.description), (0, discord_js_1.quote)(`Required: ${(0, discord_js_1.bold)(opt.required ? "yes" : "no")}`), (0, discord_js_1.quote)(`Type: ${(0, discord_js_1.inlineCode)(opt.type)}`)),
                });
            }
        }
        return ctx.reply({
            embeds: [embed],
        });
    },
};
//# sourceMappingURL=help.js.map