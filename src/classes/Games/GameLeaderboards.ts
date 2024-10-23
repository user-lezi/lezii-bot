import { Games, TGame, TPasswordScore } from ".";
import { Client } from "../../client";
import {
  ActionRowBuilder,
  bold,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  heading,
  HeadingLevel,
  hyperlink,
  italic,
  Message,
  MessageActionRowComponentBuilder,
  quote,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  subtext,
} from "discord.js";
import { SlashContext } from "../../commands/context";

export type ValueTypes = TPasswordScore;

export const LeaderboardEmojis = {
  first: "🥇",
  second: "🥈",
  third: "🥉",
  next: "🏅",
  other: "🎖",
};

export type IValue<T> = {
  key: string;
  value: T;
  type: string;
  createdTimestamp: number;
  editedTimestamp: number;
  _id: string;
};
export class BaseLeaderboard<T = ValueTypes[], S extends string = string> {
  public values: IValue<T>[] = [];
  public sortingTypes: S[] = [];
  public sorterEmojis = {} as Record<S, string>;
  public defaultSort!: S;
  public sliceIndex = 0;
  public Game = {} as TGame;
  public constructor(
    public client: Client,
    public sliceLength: number,
  ) {}
  public get db() {
    return this.client.db;
  }
  public get size() {
    return this.values.length;
  }
  public async init() {}
  public fetchValues(g: string) {
    return this.db
      .all()
      .then(
        (d) => (this.values = d.filter((x) => x.key.startsWith(`lb_${g}_`))),
      );
  }
  public async sort(sortBy: S = this.defaultSort) {}
  public _format(caller: (value: IValue<T>, index: number) => string) {
    let startIndex = this.sliceIndex * this.sliceLength;
    let res: string[] = [];
    for (let i = startIndex; i < startIndex + this.sliceLength; i++) {
      let value = this.values[i];
      if (!value) break;
      res.push(caller(value, i));
    }
    return res;
  }
  public list() {
    return [] as string[];
  }
  public components<
    C extends ActionRowBuilder<MessageActionRowComponentBuilder>[],
  >(uid: string): C[] {
    return [];
  }

  public async interact(msg: Message): Promise<unknown> {
    return;
  }
}

export type TPasswordValues = "length" | "time";
export class PasswordGameLeaderboard extends BaseLeaderboard<
  TPasswordScore[],
  TPasswordValues
> {
  public constructor(client: Client, sliceLength: number) {
    super(client, sliceLength);
    this.sortingTypes = ["length", "time"];
    this.defaultSort = "length";
    this.sorterEmojis = {
      length: "📏",
      time: "⏰",
    };
    this.Game = Games.find((x) => x.value == "password")!;
  }
  public override async init() {
    await this.fetchValues("pg");
    await this.sort();
  }
  public override async sort(sortBy = this.defaultSort) {
    this.values = this.values.sort(function (a, b) {
      switch (sortBy) {
        case "length":
          return a.value[0].length - b.value[0].length;
        case "time":
          return a.value[1].time - b.value[1].time;
        default:
          return 0;
      }
    });
  }
  public override list(valueType = this.defaultSort): string[] {
    let func: (value: IValue<TPasswordScore[]>, index: number) => string = (
      v,
      i,
    ) => {
      let id = v.key.split("_")[2];
      let user = this.client.users.cache.get(id);
      let u = user
        ? SlashContext.userMention(user)
        : hyperlink(id, SlashContext.userLink(id));
      let emoji =
        i == 0
          ? LeaderboardEmojis.first
          : i == 1
            ? LeaderboardEmojis.second
            : i == 2
              ? LeaderboardEmojis.third
              : i <= 4
                ? LeaderboardEmojis.next
                : LeaderboardEmojis.other;
      let head = heading(
        bold(`${i + 1}. ${emoji} ${u}`) + "\n",
        HeadingLevel.Three,
      );
      switch (valueType) {
        case "length":
          return (
            head +
            subtext(`Password Length: ${bold(v.value[0].length + " chars")}\n`)
          );
        case "time":
          return (
            head +
            subtext(
              `Time Taken: ${bold(this.client.util.parseMS(v.value[1].time))}\n`,
            )
          );
        default:
          return "";
      }
    };
    return this._format(func);
  }

  // @ts-ignore
  public override components(uid: string) {
    let options: StringSelectMenuOptionBuilder[] = [];
    for (const x of this.sortingTypes) {
      options.push(
        new StringSelectMenuOptionBuilder()
          .setEmoji(this.sorterEmojis[x])
          .setValue(x)
          .setLabel(title(x)),
      );
    }

    let sortByMenu = new StringSelectMenuBuilder()
      .setCustomId(uid + "_lb_pg_s")
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Sort By")
      .setOptions(...options);

    let buttonRow = this.client.util.addButtonRow(
      [`${uid}_lb_pg_bb`, "", "⏪", ButtonStyle.Primary, this.sliceIndex == 0],
      [`${uid}_lb_pg_b`, "", "◀️", ButtonStyle.Primary, this.sliceIndex == 0],
      [
        `${uid}_lb_pg_f`,
        "",
        "▶️",
        ButtonStyle.Primary,
        (this.sliceIndex + 1) * this.sliceLength >= this.size,
      ],
      [
        `${uid}_lb_pg_ff`,
        "",
        "⏩",
        ButtonStyle.Primary,
        (this.sliceIndex + 1) * this.sliceLength >= this.size,
      ],
    );

    return [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(sortByMenu),
      buttonRow,
    ];
  }

  public override async interact(msg: Message): Promise<unknown> {
    let collector = msg.createMessageComponentCollector({
      filter: (i) => i.customId.startsWith(i.user.id + "_"),
      time: 30 * 1000,
    });

    collector.on(
      "collect",
      async (i: StringSelectMenuInteraction | ButtonInteraction) => {
        await i.deferUpdate().catch(() => {});
        if (i.isStringSelectMenu()) {
          let newSortType = i.values[0] as TPasswordValues;
          this.defaultSort = newSortType;
          await this.sort();
        } else if (i.isButton()) {
          let movement = i.customId.split("_")[3];
          //ff or bb
          if (movement.length == 2) {
            this.sliceIndex =
              movement == "bb"
                ? 0
                : Math.ceil(this.size / this.sliceLength) - 1;
          } else this.sliceIndex += movement == "b" ? -1 : 1;
        } else {
          return;
        }
        let list = this.list();
        let embed = new EmbedBuilder(msg.embeds[0].toJSON()).setDescription(
          [
            heading(`Leaderboard`, HeadingLevel.One),
            heading(this.Game.name, HeadingLevel.Two),
            heading(list.join("\n"), HeadingLevel.Three),
          ].join("\n"),
        );
        await msg
          .edit({
            embeds: [embed],
            components: this.components(i.user.id),
          })
          .catch(() => {});
        collector.resetTimer();
      },
    );

    collector.on("end", () => {
      msg.edit({ content: italic("Timeout"), components: [] }).catch(() => {});
    });
    return;
  }
}

function title(s: string) {
  return s
    .split(" ")
    .map((x) => x[0].toUpperCase() + x.slice(1, x.length))
    .join(" ");
}
