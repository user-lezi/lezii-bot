import {
  Client as _Client,
  UserResolvable,
  GuildTextBasedChannel,
  EmbedBuilder,
  Collection,
  ActivityType,
  User,
} from "discord.js";
import { CommandManager } from "./commands";
import { ClientUtils } from "./classes/ClientUtils";

import { PasswordGame } from "./classes/Games";
import chalk from "chalk";

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
  public cache = {
    games: {
      password: new Collection<string, PasswordGame>(),
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
      this.commands
        .registerSlashCommands()
        .then(() =>
          this.application
            .fetch()
            .then(
              () =>
                (console.log(
                  chalk.greenBright("!! Fetched the application information"),
                ),
                1) &&
                this.application.commands
                  .fetch()
                  .then(() =>
                    console.log(
                      chalk.greenBright(
                        "!! Fetched all the application commands",
                      ),
                    ),
                  ),
            ),
        );
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
      channel?.send(message);

      const CustomStatuses = [
        async () => `${this.guilds.cache.size} Guilds FR`,
        async () =>
          `${this.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Users FR`,
        async () => `Touch some grass`,
        async () =>
          `Try out /${this.application.commands.cache.random()!.name}`,
        async () => {
          let a = this.randomUser();
          let r = ["hello {}", "{} needs to touch some grass."];
          return a
            ? r[Math.floor(Math.random() * r.length)].replace(
                "{}",
                `@${a.username}`,
              )
            : `uwu`;
        },
      ] as Array<(this: Client) => Promise<string>>;

      setInterval(async () => {
        let randomIndex = Math.floor(Math.random() * CustomStatuses.length);
        let status = CustomStatuses[randomIndex].bind(this);
        this.user.setActivity(await status(), {
          type: ActivityType.Custom,
        });
      }, 30 * 1000);
    });

    this.on("interactionCreate", async (interaction) => {
      if (interaction.isModalSubmit()) {
        let customId = interaction.customId;
        let [_, gameName, id] = customId.split("_");
        if (_ !== "game") return;
        if (id !== interaction.user.id) {
          interaction
            .reply({
              ephemeral: true,
              content: "no.",
            })
            .catch(() => {});
          return;
        }
        if (gameName === "password") {
          let game = this.cache.games.password.get(id);
          if (!game) return;
          game.listenModal(interaction);
        }
      }
      if (interaction.isButton()) {
        let customId = interaction.customId;
        let [_, gameName, id] = customId.split("_");
        if (_ !== "gamebtn") return;
        if (id !== interaction.user.id) {
          interaction
            .reply({
              ephemeral: true,
              content: "no.",
            })
            .catch(() => {});
          return;
        }
        if (gameName === "password") {
          let game = this.cache.games.password.get(id);
          if (!game) return;
          game.listenButton(interaction);
        }
      }
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

  randomUser(noBot = true): User | null {
    try {
      let found = this.users.cache.random();
      return found ? (found.bot && noBot ? this.randomUser() : found) : null;
    } catch {
      return null;
    }
  }
}
