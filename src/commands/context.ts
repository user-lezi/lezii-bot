import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  Message,
  ThreadMember,
  User,
  UserResolvable,
} from "discord.js";
import { type Client } from "../client";

export class SlashContext {
  constructor(
    public client: Client,
    public interaction: ChatInputCommandInteraction,
  ) {}

  public get application() {
    return this.client.application;
  }
  public get applicationCommands() {
    return this.application.commands.cache;
  }
  public get user() {
    return this.interaction.user;
  }
  public get guild() {
    return this.interaction.guild;
  }
  public get channel() {
    return this.interaction.channel;
  }
  public get util() {
    return this.client.util;
  }

  public defer() {
    return this.interaction.deferReply().catch(() => null);
  }
  public reply(message: any) {
    return this.interaction.deferred || this.interaction.replied
      ? this.interaction.editReply(message)
      : this.interaction.reply(message);
  }

  public join(...str: (string | string[])[]) {
    return str.flat().join("\n");
  }

  public sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public userLink(user: UserResolvable) {
    let id =
      user instanceof GuildMember || user instanceof ThreadMember
        ? user.user!.id
        : user instanceof Message
          ? user.author.id
          : user instanceof User
            ? user.id
            : user;
    return `https://discord.com/users/${id}` as const;
  }
}
