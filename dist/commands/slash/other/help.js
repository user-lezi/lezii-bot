"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    builder: new discord_js_1.SlashCommandBuilder()
        .setName("help")
        .setDescription("Need help?"),
    defer: true,
    execute: async (ctx) => {
        let commands = ctx.applicationCommands;
        function id(name) {
            return commands.find((x) => x.name == name.split(" ")[0])?.id ?? "0";
        }
        let categories = {
            Games: ["game password", "game uncache"],
            Utility: ["stats", "help", "define"],
        };
        let embed = ctx.util.embed();
        for (const category in categories) {
            let cmds = categories[category].sort();
            let values = [];
            for (const cmd of cmds) {
                let cmdid = id(cmd);
                values.push(`</${cmd}:${cmdid}>`);
            }
            embed.addFields({
                name: category,
                value: values.join(", "),
            });
        }
        ctx.reply({ embeds: [embed] });
    },
};
//# sourceMappingURL=help.js.map