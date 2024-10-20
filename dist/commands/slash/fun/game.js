"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const discord_js_1 = require("discord.js");
const Games_1 = require("../../../classes/Games");
exports.Games = [{ name: "Password Game", value: "password" }];
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("game")
        .setDescription("Play a game")
        .addSubcommand((sub) => sub
        .setName("uncache")
        .setDescription("Uncache a game")
        .addStringOption((opt) => opt
        .setName("game")
        .setDescription("The game to uncache")
        .setRequired(false)
        .addChoices(...exports.Games)))
        .addSubcommand((sub) => sub.setName("password").setDescription("Play a password game")),
    defer: false,
    execute: {
        uncache: async function (ctx) {
            let input = ctx.interaction.options.getString("game");
            let gameCmd = ctx.applicationCommands.find((x) => x.name == "game");
            if (input) {
                let cache = ctx.client.cache.games[input];
                let cached = cache.get(ctx.user.id);
                let game = exports.Games.find((x) => x.value == input);
                if (!cached)
                    return await ctx.reply({
                        content: "No cache found for " + (0, discord_js_1.bold)(game.name),
                        ephemeral: true,
                    });
                let exists = await cached.exists();
                if (!exists) {
                    cache.delete(ctx.user.id);
                    return await ctx.reply({
                        content: "No cache found for " + (0, discord_js_1.bold)(game.name),
                        ephemeral: true,
                    });
                }
                let m = await ctx.reply({
                    content: ctx.join("Are you sure to uncache it or continue the game?", `> ${cached.messageLocation() ?? (0, discord_js_1.italic)("Not Found...")}`),
                    ephemeral: true,
                    components: [
                        ctx.util.addButtonRow([
                            "uncacheconfirm",
                            "Uncache?",
                            "",
                            discord_js_1.ButtonStyle.Danger,
                        ]),
                    ],
                });
                let col = m.createMessageComponentCollector({
                    filter: (x) => x.user.id == ctx.user.id,
                    time: 20 * 1000,
                });
                col.on("collect", async (i) => {
                    await i.deferUpdate().catch(() => { });
                    cache.delete(ctx.user.id);
                    await m
                        .edit({
                        content: "Uncached",
                        components: [],
                    })
                        .catch(() => { });
                    col.stop("d");
                });
                col.on("end", async (_, r) => {
                    if (r == "d")
                        return;
                    await m
                        .edit({
                        content: "Timeout.",
                        components: [],
                    })
                        .catch(() => { });
                });
            }
            else {
                await ctx.defer();
                /* list all the games that has been cached */
                let list = [];
                let n = 1;
                for (const game of exports.Games) {
                    let cache = ctx.client.cache.games[game.value];
                    let cached = cache.get(ctx.user.id);
                    let cmd = `</game ${game.value}:${gameCmd.id}>`;
                    if (cached) {
                        let exists = await cached.exists();
                        if (!exists) {
                            cache.delete(ctx.user.id);
                            list.push({
                                name: `${n++}. ${game.name}`,
                                value: `> ${cmd} - ${(0, discord_js_1.bold)(`No Cache Found`)}`,
                            });
                        }
                        else {
                            list.push({
                                name: `${n++}. ${game.name}`,
                                value: ctx.join(`> ${cmd} - ${(0, discord_js_1.bold)(`Cache Found`)}`, `> At ${cached.messageLocation() ?? (0, discord_js_1.italic)("Not Found...")}`),
                            });
                        }
                    }
                    else {
                        list.push({
                            name: `${n++}. ${game.name}`,
                            value: `> ${cmd} - ${(0, discord_js_1.bold)(`No Cache Found`)}`,
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
            let game = new Games_1.PasswordGame(ctx);
            game.start();
        },
    },
};
//# sourceMappingURL=game.js.map