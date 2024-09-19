import { SlashContext } from "../../commands/context";
import {
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  Message,
  ModalSubmitInteraction,
  ButtonStyle,
  ButtonInteraction,
  AttachmentBuilder,
} from "discord.js";
import { createCanvas } from "@napi-rs/canvas";
export type RuleChecker = (
  password: string,
  p?: PasswordGame,
) => Promise<boolean>;

export interface Rule {
  id: string;
  rule: string;
  simple: boolean;
  check: RuleChecker;
}

export const PasswordGameRules: Rule[] = [
  {
    id: "length",
    rule: "The password must be at least 5 characters long.",
    simple: true,
    check: async function (password) {
      return password.length >= 5;
    },
  },
  {
    id: "number",
    rule: "The password must contain at least one number.",
    simple: true,
    check: async function (password) {
      return /[0-9]/.test(password);
    },
  },
  {
    id: "uppercase",
    rule: "The password must contain at least one uppercase letter.",
    simple: true,
    check: async function (password) {
      return /[A-Z]/.test(password);
    },
  },
  {
    id: "specialCharacter",
    rule: "The password must contain at least one special character.",
    simple: true,
    check: async function (password) {
      return /[^\w\s]/.test(password);
    },
  },
  {
    id: "sumNumbers",
    rule: "The sum of the numbers in the password must be 25.",
    simple: true,
    check: async function (password) {
      let sum = sumOfDigits(password);
      return sum === 25;
    },
  },
  {
    id: "captcha",
    rule: "The password must contain the captcha string provided in the image.",
    simple: true,
    check: async function (password, p) {
      p!._.captcha ??= randomCaptcha(5);
      p!._.captchaImage ??= await createCaptchaImage(p!._.captcha);
      function randomCaptcha(n: number): number {
        let m = n - 2;
        let a = "0123456789";
        let b = "abcdefghijklmnopqrstuvwxyz";
        let r = "";
        r += b[Math.floor(Math.random() * b.length)];
        for (let i = 0; i < m; i++) {
          let i = Math.floor(Math.random() * (a.length + b.length));
          r += i < a.length ? a[i] : b[i - a.length];
        }
        r += b[Math.floor(Math.random() * b.length)];
        return (sumOfDigits(r) > 15 ? randomCaptcha(n) : r) as number;
      }
      return password.includes(p!._.captcha!);
    },
  },
  {
    id: "wordle",
    rule: "The password must contain today's wordle answer.",
    simple: true,
    check: async function (password, p) {
      p!._.wordleAnswer ??= await getWordleAnswer();
      return password.toLowerCase().includes(p!._.wordleAnswer!);
    },
  },
  {
    id: "pi",
    rule: "Keep this pi (π) safely in your password.",
    simple: true,
    check: async function (password) {
      return password.includes("π");
    },
  },
  {
    id: "fire",
    rule: "Oh no! The password is on fire!!!",
    simple: false,
    check: async function (password, p) {
      return p?._.hadfire ? !password.includes("🔥") : false;
    },
  },
  {
    id: "username",
    rule: "The password must contain your username.",
    simple: true,
    check: async function (password, p) {
      let username = p!.ctx.user.username;
      return password.toLowerCase().includes(username.toLowerCase());
    },
  },
  {
    id: "month",
    rule: "The password must contain the any month of a year",
    simple: true,
    check: async function (password) {
      let months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return months.some((m) => password.toLowerCase().includes(m));
    },
  },
];

export function getRule(q: number | string) {
  return typeof q == "number"
    ? PasswordGameRules[q - 1]
    : PasswordGameRules.find((r) => r.id == q);
}
export class PasswordGame {
  public time = Date.now();
  public password = "";
  public emoji = ["✅", "❌"];
  public ruleN = 1;
  public _ = {
    wordleAnswer: null,
    captcha: null,
    captchaImage: null,
    hadfire: false,
  } as any;
  public message: Message | null = null;
  constructor(public ctx: SlashContext) {
    ctx.client.cache.games.password.set(ctx.user.id, this);
  }

  public async passedAllRules() {
    let rules = PasswordGameRules.slice(0, this.ruleN);
    for (let rule of rules) {
      if (!(await rule.check(this.password, this))) return false;
    }
    return true;
  }
  public rulesCompleted() {
    return this.ruleN > PasswordGameRules.length;
  }

  public async getRulesString() {
    let rules: string[][] = [[], []];
    for (let i = 0; i < this.ruleN; i++) {
      let rule = getRule(i + 1)!;
      let check = await rule.check(this.password, this);
      rules[check ? 1 : 0].push(
        (check ? "" : "> ") +
          `\`${this.emoji[check ? 0 : 1]}\` ${i + 1}. ${rule.rule}`,
      );
    }
    return rules.flat().join("\n").trim();
  }

  public async makeEmbed() {
    let embed_1 = this.ctx.util
      .embed()
      .setTitle("Password Game")
      .setDescription(`> ${this.password ?? "*Enter your password*"}`);
    let embed_2 = this.ctx.util
      .embed()
      .setTitle("Rules")
      .setDescription(await this.getRulesString());
    let embeds = [embed_1, embed_2];

    if (await this.showCaptcha()) {
      embeds.push(
        this.ctx.util
          .embed()
          .setTitle("Captcha")
          .setImage("attachment://captcha.png"),
      );
    }
    return embeds;
  }

  public makeModal() {
    let modal = new ModalBuilder()
      .setCustomId("game_password_" + this.ctx.user.id)
      .setTitle("Password Game");
    let input = new TextInputBuilder()
      .setCustomId("password")
      .setLabel("Password")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder("Enter your password");
    if (this.password) input.setValue(this.password);
    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(input),
    );
    return modal;
  }

  public async makeMessage() {
    let data = {
      embeds: await this.makeEmbed(),
      components: [
        this.ctx.client.util.addButtonRow([
          "gamebtn_password_" + this.ctx.user.id,
          "Edit Password",
          "✏️",
          ButtonStyle.Primary,
          false,
        ]),
      ],
    } as any;
    if (await this.showCaptcha()) {
      let attac = new AttachmentBuilder(this._.captchaImage, {
        name: "captcha.png",
      });
      data.files = [attac];
    } else {
      data.files = [];
    }
    return data;
  }

  public async showCaptcha() {
    if (!this._.captchaImage) return false;
    let rule = getRule("captcha")!;
    let check = await rule.check(this.password, this);
    return !check;
  }
  public isFireTask() {
    let rule = getRule("fire")!;
    let ruleIndex = PasswordGameRules.indexOf(rule);
    return this.ruleN == ruleIndex + 1;
  }
  public fireThePassword() {
    for (let i = 0; i < 3; i++) {
      let index = Math.floor(Math.random() * this.password.length);
      this.password =
        this.password.substring(0, index) +
        "🔥" +
        this.password.substring(index + 1);
    }
    this._.hadfire = true;
  }

  public async start() {
    let modal = this.makeModal();

    await this.ctx.interaction.showModal(modal).catch(this.noerr.bind(this));

    try {
      let am = await this.ctx.interaction.awaitModalSubmit({
        time: 30 * 1000,
        filter: (i) =>
          i.user.id == this.ctx.user.id &&
          i.customId == "game_password_" + this.ctx.user.id,
      });
      await am.deferReply().catch(this.noerr.bind(this));

      this.password = am.fields.getTextInputValue("password");

      /* Check the rules */
      if (this.password) {
        let passed = await this.passedAllRules();
        while (passed && this.ruleN < PasswordGameRules.length) {
          this.ruleN++;
          passed = await this.passedAllRules();
        }
        if (passed) this.ruleN++;
        if (this.rulesCompleted()) {
          let embed = this.ctx.util
            .embed()
            .setTitle("Password Game")
            .setDescription(
              `> ${this.password}\n\n**You have completed all the rules at once!!!**\nYour password length is ${this.password.length}`,
            );
          await am.editReply({ embeds: [embed] });
          this.ctx.client.cache.games.password.delete(this.ctx.user.id);
          return;
        }
      }

      let message = await this.makeMessage();

      this.message = await am.editReply(message);
    } catch {
      this.noerr();
    }
  }

  public async listenModal(interaction: ModalSubmitInteraction) {
    if (!this.message) return;
    await interaction.deferUpdate().catch(this.noerr.bind(this));
    let value = interaction.fields.getTextInputValue("password");
    this.password = value;

    let passed = await this.passedAllRules();
    while (passed && this.ruleN < PasswordGameRules.length) {
      this.ruleN++;
      passed = await this.passedAllRules();
    }
    if (passed) this.ruleN++;
    if (this.rulesCompleted()) {
      this.ruleN--;
      let embeds = await this.makeEmbed();
      embeds[1].setTitle("You Won!!");
      embeds[0].addFields({
        name: "Password Length",
        value: `**${this.password.length}** Characters`,
      });
      await this.message!.edit({
        components: [],
        files: [],
        embeds,
      });
      this.ctx.client.cache.games.password.delete(this.ctx.user.id);
      return;
    }
    let message = await this.makeMessage();
    await this.message!.edit(message);
  }

  public async listenButton(interaction: ButtonInteraction) {
    let modal = this.makeModal();
    await interaction.showModal(modal).catch(this.noerr.bind(this));
  }

  public noerr() {
    this.message?.reply("Something went wrong!");
    return this.ctx.client.cache.games.password.delete(this.ctx.user.id);
  }
}

async function getWordleAnswer() {
  let api = `https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json`;
  let YYYY = new Date().getFullYear();
  let MM = new Date().getMonth() + 1;
  let DD = new Date().getDate();
  let url = api
    .replace("YYYY", YYYY.toString())
    .replace("MM", MM.toString().padStart(2, "0"))
    .replace("DD", DD.toString().padStart(2, "0"));
  console.log(url);
  let res = await fetch(url);
  let json = await res.json();
  return json.solution;
}

async function createCaptchaImage(text: string) {
  let height = 90;
  let width = 150;
  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext("2d");

  /* White Background*/
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  /* Random Dots */
  let dotRadius = 3;
  let dots = Math.floor(Math.sqrt((height * width) / dotRadius));
  for (let i = 0; i < dots; i++) {
    let color =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0") +
      (127).toString(16).padStart(2, "0");
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  /* Random Lines */
  ctx.strokeStyle = ctx.fillStyle = "#000000";
  let lineWidth = 3;
  let lines = Math.floor(Math.random() * 6) + 3;
  for (let i = 0; i < lines; i++) {
    let ran1 = Math.random();
    let ran2 = Math.random();
    let [x1, y1] = [
      ran1 > 0.5 ? 0 : Math.floor(Math.random() * width),
      ran1 > 0.5 ? Math.floor(Math.random() * height) : 0,
    ];
    let [x2, y2] = [
      ran2 > 0.5 ? width : Math.floor(Math.random() * width),
      ran2 > 0.5 ? Math.floor(Math.random() * height) : height,
    ];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  /* Text in center*/
  let fs = Math.floor(height / 4);
  ctx.font = "bold " + fs + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(text, width / 2, height / 2);
  ctx.font = "bold " + Math.round(fs * 1.8) + "px Arial";
  ctx.fillStyle = "#000000" + (30).toString(16).padStart(2, "0");
  ctx.fillText(
    text,
    Math.floor(Math.random() * 10) + width / 2,
    Math.floor(Math.random() * 10) + height / 2,
  );

  /* More Black noise */
  let noise = Math.floor(Math.random() * 100);
  for (let i = 0; i < noise; i++) {
    let color =
      "#000000" +
      (Math.floor(Math.random() * 40) + 90).toString(16).padStart(2, "0");
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, lineWidth, lineWidth);
  }

  /* Buffer */
  return canvas.toBuffer("image/png");
}

function sumOfDigits(str: string) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= "0" && str[i] <= "9") {
      sum += parseInt(str[i]);
    }
  }
  return sum;
}
