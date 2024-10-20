import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
} from "discord.js";
import { type Client } from "../client";

import _ChemicalElements from "../../json/elements.json";
export type ICE = [string, string, number, number, string];
const ChemicalElements = new Collection<string, ICE>();
(_ChemicalElements as ICE[]).forEach((x) => ChemicalElements.set(x[1], x));

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
    let c = {
      s: 1000,
      m: 1000 * 60,
      h: 1000 * 60 * 60,
      d: 1000 * 60 * 60 * 24,
    };
    if (ms < 1000) return ms + "ms";
    let d = ms / c.d;
    let h = (ms % c.d) / c.h;
    let m = (ms % c.h) / c.m;
    let s = (ms % c.s) / c.s;
    return (
      (d >= 1 ? `${Math.floor(d)}d ` : "") +
      (h >= 1 ? `${Math.floor(h)}h ` : "") +
      (m >= 1 ? `${Math.floor(m)}m ` : "") +
      (s >= 1 ? `${Math.floor(s)}s` : "")
    );
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
