import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { type Client } from "../client";

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

  public roundN(n: number, decimals: number = 2) {
    return Number(n.toFixed(decimals));
  }

  public embed() {
    return new EmbedBuilder().setColor(this.client._.color.main);
  }
}
