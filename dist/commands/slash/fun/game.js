"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Games_1 = require("../../../classes/Games");
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
        .setRequired(true)
        .addChoices({ name: "Password Game", value: "password" })))
        .addSubcommand((sub) => sub.setName("password").setDescription("Play a password game")),
    defer: false,
    execute: {
        uncache: async function (ctx) {
            let game = ctx.interaction.options.getString("game");
            if (!game)
                return;
            let has = ctx.client.cache.games[game].has(ctx.user.id);
            if (!has)
                return ctx.reply({
                    content: `You don't have a ${game} game in cache`,
                    ephemeral: true,
                });
            ctx.client.cache.games[game].delete(ctx.user.id);
            ctx.reply({
                content: `Uncached ${game} game`,
                ephemeral: true,
            });
        },
        password: async function (ctx) {
            let existingGame = ctx.client.cache.games.password.get(ctx.user.id);
            if (existingGame) {
                return await ctx.reply({
                    content: `You already have a game running! Use **/game uncache** to stop the running game.`,
                    ephemeral: true,
                });
            }
            await ctx.defer();
            let game = new Games_1.PasswordGame(ctx);
            game.start();
        },
    },
};
//# sourceMappingURL=game.js.map