import {
  Client as _Client,
  UserResolvable,
  GuildTextBasedChannel,
  EmbedBuilder,
} from "discord.js";
import { CommandManager } from "./commands";
import { ClientUtils } from "./classes/ClientUtils";
export class Client extends _Client<true> {
  public _ = {
    devs: ["910837428862984213"],
    channels: {
      readyLog: "1282594208980533251",
    },
    color: {
      main: 0xb3c6ff,
    },
  };
  public commands = new CommandManager(this);
  public util = new ClientUtils(this);
  constructor() {
    super({
      intents: ["Guilds", "GuildMessages", "MessageContent"],
    });
    this.commands.load();

    this.on("ready", () => {
      this.commands.registerSlashCommands();
      let channel = this.channels.cache.get(
        this._.channels.readyLog,
      ) as GuildTextBasedChannel;
      let message = {
        embeds: [
          new EmbedBuilder()
            .setTitle("Ready")
            .setDescription(`Bot Online!`)
            .setColor(this._.color.main),
        ],
      };
      channel.send(message);
    });
  }

  isDev(user: UserResolvable) {
    let uid =
      typeof user == "string" ? user : "user" in user ? user.user?.id : user.id;
    return this._.devs.includes(uid ?? "");
  }

  login() {
    return super.login(process.env.BotToken!);
  }
}
