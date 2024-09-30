import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../..";

export default {
  builder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Need help?"),
  defer: true,
  execute: async (ctx) => {
    let commands = ctx.applicationCommands;
    function id(name: string) {
      return commands.find((x) => x.name == name.split(" ")[0])?.id ?? "0";
    }

    let categories = {
      Games: ["game password", "game uncache"],
      Utility: ["stats", "help", "define"],
    };
    let embed = ctx.util.embed();
    for (const category in categories) {
      let cmds = categories[category as keyof typeof categories].sort();
      let values: string[] = [];
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
} as SlashCommand<false>;
