import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
} from "discord.js";
import { type Client } from "../client";
import Parser from "ms-utility";
import { DefaultTimeUnits } from "ms-utility/dist/constants";

export const TimeParser = new Parser([
  ...DefaultTimeUnits,
  [
    "w",
    {
      word: "week",
      ms: 1_000 * 60 * 60 * 24 * 7,
    },
  ],
  [
    "M",
    {
      word: "month",
      ms: 1_000 * 60 * 60 * 24 * 30,
    },
  ],
  [
    "y",
    {
      word: "year",
      ms: 1_000 * 60 * 60 * 24 * 30 * 12,
    },
  ],
]);

import _ChemicalElements from "../../json/elements.json";
export type ICE = [string, string, number, number, string];
const ChemicalElements = new Collection<string, ICE>();
(_ChemicalElements as ICE[]).forEach((x) => ChemicalElements.set(x[1], x));

export { ChemicalElements };

export class ClientUtils {
  #client: Client;
  constructor(client: Client) {
    this.#client = client;
  }
  get client() {
    return this.#client;
  }

  public addButton(
    id: string,
    label: string,
    emoji: string,
    style: ButtonStyle,
    disabled = false,
  ) {
    let btn = new ButtonBuilder().setStyle(style).setDisabled(disabled);
    if (label.length) btn.setLabel(label);
    if (emoji.length) btn.setEmoji(emoji);
    return style == ButtonStyle.Link ? btn.setURL(id) : btn.setCustomId(id);
  }
  public addButtonRow(...btns: Parameters<ClientUtils["addButton"]>[]) {
    let row = new ActionRowBuilder<ButtonBuilder>();
    for (let btn of btns) row.addComponents(this.addButton(...btn));
    return row;
  }

  public stringChunks(str: string, length: number = 1000) {
    let regex = new RegExp(`[\\s\\S]{1,${length}}`, "g");
    return str.match(regex) ?? [];
  }

  public stringSize(str: string) {
    let size = new TextEncoder().encode(str).length;
    return {
      size,
      KB: this.roundN(size / 1024),
      MB: this.roundN(size / 1024 / 1024),
    };
  }

  public parseMS(ms: number) {
    return TimeParser.parseToString(ms, {
      and: false,
      separator: " ",
    });
  }

  public roundN(n: number, decimals: number = 2) {
    return Number(n.toFixed(decimals));
  }

  public embed() {
    return new EmbedBuilder().setColor(this.client._.color.main);
  }

  public shuffleArr<T>(arr: T[], n = 2): T[] {
    for (let i = 0; i < arr.length; i++) {
      let j = Math.floor(Math.random() * arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return n > 1 ? this.shuffleArr(arr, n - 1) : arr;
  }

  getElements(s: string) {
    let e: ICE[] = [];
    for (let i = 0; i < s.length - 1; i++) {
      let j = i + 1;
      let t = s[i] + s[j];
      let el = ChemicalElements.get(t);
      if (el) e.push(el);
    }
    return e;
  }
}
