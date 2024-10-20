"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordGame = exports.PasswordGameRules = exports.TwoLetterElements = void 0;
exports.getRule = getRule;
const discord_js_1 = require("discord.js");
const canvas_1 = require("@napi-rs/canvas");
const ClientUtils_1 = require("../ClientUtils");
exports.TwoLetterElements = Array.from(ClientUtils_1.ChemicalElements.filter((x) => x[1].length == 2).keys());
exports.PasswordGameRules = [
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
        show: async function (password, p) {
            return password.replace(/\d+/g, (m) => (0, discord_js_1.bold)(m));
        },
    },
    {
        id: "captcha",
        rule: "The password must contain the captcha string provided in the image.",
        simple: true,
        check: async function (password, p) {
            p._.captcha ??= randomCaptcha(5);
            p._.captchaImage ??= await createCaptchaImage(p._.captcha);
            return password.includes(p._.captcha);
        },
    },
    {
        id: "consecutiveNumbers",
        rule: "The password must contain a sequence of three consecutive numbers.",
        simple: true,
        check: async function (password) {
            let seqs = "012 123 234 345 456 567 678 789 890".split(" ");
            for (let i = 0; i < seqs.length; i++) {
                const seq = seqs[i];
                if (password.includes(seq))
                    return true;
            }
            return false;
        },
    },
    {
        id: "wordle",
        rule: "The password must contain today's wordle answer.",
        simple: true,
        check: async function (password, p) {
            p._.wordleAnswer ??= await getWordleAnswer(p);
            return password.toLowerCase().includes(p._.wordleAnswer);
        },
    },
    {
        id: "twoLetterElements",
        rule: "Your password must include a two letter symbol from the periodic table",
        simple: true,
        check: async function (password) {
            for (const ele of exports.TwoLetterElements) {
                if (password.includes(ele))
                    return true;
            }
            return false;
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
        id: "strong",
        rule: "Your password must be strong enough.",
        simple: true,
        check: async function (password, p) {
            let emo = "🏋️";
            let req = 3;
            let count = [...new Intl.Segmenter().segment(password)].filter((x) => x.segment == emo).length;
            let r = count == req;
            if (!r && !p?._.tips.get("strongPassword"))
                p?.sendTip("strongPassword", count == 0
                    ? `Add ${emo} to make your password stronger.`
                    : count < req
                        ? `Password needs to be more stronger!!`
                        : `Its too strong!! Try making it little weaker.`, 10 * 1000);
            return r;
        },
    },
    {
        id: "fire",
        rule: "Oh no! The password is on fire!!!",
        simple: false,
        check: async function (password, p) {
            return p?._.hadfire
                ? !password.includes("🔥")
                : (await p?.fireThePassword(), false);
        },
    },
    {
        id: "username",
        rule: "The password must contain your username.",
        simple: true,
        check: async function (password, p) {
            let username = p.ctx.user.username;
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
    {
        id: "sumAtomicNumber",
        rule: "The elements in your password must have the sum of their atomic number equal to 200.",
        simple: true,
        check: async function (password, p) {
            let elements = p.ctx.util.getElements(password);
            return elements.reduce((a, b) => a + b[2], 0) == 200;
        },
        show: async function (password, p) {
            let elms = p.ctx.util.getElements(password);
            for (let i = 0; i < elms.length; i++) {
                const elm = elms[i][0];
                password = password.replaceAll(elm, (0, discord_js_1.bold)(elm));
            }
            return password;
        },
    },
    {
        id: "plength",
        rule: "The password must include the length of the password.",
        simple: true,
        check: async function (password) {
            let length = password.length;
            return password.includes(length.toString());
        },
    },
    {
        id: "primelength",
        rule: "The length of the password must be a prime number",
        simple: true,
        check: async function (password) {
            return isPrime(password.length);
        },
    },
];
function getRule(q) {
    return typeof q == "number"
        ? exports.PasswordGameRules[q - 1]
        : exports.PasswordGameRules.find((r) => r.id == q);
}
class PasswordGame {
    ctx;
    time = Date.now();
    password = "";
    emoji = ["✅", "❌"];
    ruleN = 1;
    sruleN = 1;
    _ = {
        wordleAnswer: null,
        captcha: null,
        captchaImage: null,
        hadfire: false,
        tips: new discord_js_1.Collection(),
    };
    message = null;
    constructor(ctx) {
        this.ctx = ctx;
        ctx.client.cache.games.password.set(ctx.user.id, this);
    }
    async passedAllRules() {
        let rules = exports.PasswordGameRules.slice(0, this.ruleN);
        for (let rule of rules) {
            if (!(await rule.check(this.password, this)))
                return false;
        }
        return true;
    }
    rulesCompleted() {
        return this.ruleN > exports.PasswordGameRules.length;
    }
    async getRulesString() {
        let rules = [[], []];
        this.sruleN = Infinity;
        for (let i = 0; i < this.ruleN; i++) {
            let rule = getRule(i + 1);
            let check = await rule.check(this.password, this);
            if (!check)
                this.sruleN = Math.min(this.sruleN, i + 1);
            rules[check ? 1 : 0].push((check ? "" : "> ") +
                `\`${this.emoji[check ? 0 : 1]}\` ${i + 1}. ${rule.rule}`);
        }
        return rules.flat().join("\n").trim();
    }
    async formatPassword() {
        let pass = this.password;
        if (this.rulesCompleted())
            return pass;
        let rule = getRule(this.ruleN);
        if (rule && rule.show)
            return await rule.show(pass, this);
        return pass;
    }
    async makeEmbed(includelength = true) {
        let ps = `> ${this.password ? await this.formatPassword() : "*Enter your password*"}`;
        let embed_1 = this.ctx.util
            .embed()
            .setTitle("Password Game")
            .setDescription(includelength
            ? this.ctx.join(ps, `> -# (${this.password.length} chars)`)
            : ps);
        let embed_2 = this.ctx.util
            .embed()
            .setTitle("Rules")
            .setDescription(await this.getRulesString());
        let embeds = [embed_1, embed_2];
        if (await this.showCaptcha()) {
            embeds.push(this.ctx.util
                .embed()
                .setTitle("Captcha")
                .setImage("attachment://captcha.png"));
        }
        return embeds;
    }
    makeModal() {
        let modal = new discord_js_1.ModalBuilder()
            .setCustomId("game_password_" + this.ctx.user.id)
            .setTitle("Password Game");
        let input = new discord_js_1.TextInputBuilder()
            .setCustomId("password")
            .setLabel("Password")
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Enter your password");
        if (this.password)
            input.setValue(this.password);
        modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(input));
        return modal;
    }
    async makeMessage() {
        let data = {
            embeds: await this.makeEmbed(),
            components: [
                this.ctx.client.util.addButtonRow([
                    "gamebtn_password_" + this.ctx.user.id,
                    "Edit Password",
                    "✏️",
                    discord_js_1.ButtonStyle.Primary,
                    false,
                ]),
            ],
        };
        if (await this.showCaptcha()) {
            let attac = new discord_js_1.AttachmentBuilder(this._.captchaImage, {
                name: "captcha.png",
            });
            data.files = [attac];
            let refreshcaptchabtn = new discord_js_1.ButtonBuilder()
                .setCustomId("gamebtn_password_" + this.ctx.user.id + "_rc")
                .setLabel("Refresh captcha?")
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            data.components[1] = new discord_js_1.ActionRowBuilder().addComponents(refreshcaptchabtn);
        }
        else {
            data.files = [];
            let l = data.components[1];
            if (l &&
                l.components[0].toJSON().custom_id.endsWith("_rc"))
                data.components.pop();
        }
        return data;
    }
    async showCaptcha() {
        if (!this._.captchaImage)
            return false;
        let rule = getRule("captcha");
        let check = await rule.check(this.password, this);
        return !check;
    }
    isFireTask() {
        let rule = getRule("fire");
        let ruleIndex = exports.PasswordGameRules.indexOf(rule);
        return this.ruleN == ruleIndex + 1;
    }
    fireThePassword() {
        for (let i = 0; i < 3; i++) {
            let index = Math.floor(Math.random() * this.password.length);
            this.password =
                this.password.substring(0, index) +
                    "🔥" +
                    this.password.substring(index + 1);
        }
        this._.hadfire = true;
    }
    async start() {
        let modal = this.makeModal();
        await this.ctx.interaction.showModal(modal).catch(this.noerr.bind(this));
        try {
            let am = await this.ctx.interaction.awaitModalSubmit({
                time: 60 * 1000,
                filter: (i) => i.user.id == this.ctx.user.id &&
                    i.customId == "game_password_" + this.ctx.user.id,
            });
            await am.deferReply().catch(this.noerr.bind(this));
            this.password = am.fields.getTextInputValue("password");
            /* Check the rules */
            if (this.password) {
                let passed = await this.passedAllRules();
                while (passed && this.ruleN < exports.PasswordGameRules.length) {
                    this.ruleN++;
                    passed = await this.passedAllRules();
                }
                if (!!passed)
                    this.ruleN++;
            }
            let message = await this.makeMessage();
            this.message = await am.editReply(message);
        }
        catch {
            this.noerr();
        }
    }
    async listenModal(interaction) {
        if (!this.message)
            return;
        await interaction.deferUpdate().catch(this._noerr.bind(this));
        let value = interaction.fields.getTextInputValue("password");
        this.password = value;
        let passed = await this.passedAllRules();
        while (passed && this.ruleN < exports.PasswordGameRules.length) {
            this.ruleN++;
            passed = await this.passedAllRules();
        }
        if (passed)
            this.ruleN++;
        if (this.rulesCompleted()) {
            this.ruleN--;
            let embeds = await this.makeEmbed(false);
            embeds[1].setTitle("You Won!!");
            embeds[0].addFields({
                name: "Password Length",
                value: `**${this.password.length}** Characters`,
            }, {
                name: "Time Spent",
                value: `**${this.ctx.util.parseMS(Date.now() - this.time)}**`,
            });
            await this.message.edit({
                components: [],
                files: [],
                embeds,
            });
            this.ctx.client.cache.games.password.delete(this.ctx.user.id);
            return;
        }
        let message = await this.makeMessage();
        await this.message.edit(message);
    }
    async listenButton(interaction) {
        let cid = interaction.customId;
        if (cid.endsWith("_rc")) {
            await this.refreshCaptcha(interaction);
            return;
        }
        let modal = this.makeModal();
        await interaction.showModal(modal).catch(this.noerr.bind(this));
    }
    async refreshCaptcha(interaction) {
        try {
            await interaction.deferUpdate();
            this._.captcha = randomCaptcha(5);
            this._.captchaImage = await createCaptchaImage(this._.captcha);
            let attac = new discord_js_1.AttachmentBuilder(this._.captchaImage, {
                name: "captcha.png",
            });
            await this.message?.edit({
                files: [attac],
            });
        }
        catch { }
    }
    sendTip(tipid, message, timeout) {
        if (this._.tips.get(tipid))
            return;
        if (timeout)
            this._.tips.set(tipid, true);
        return this.message
            ?.reply(message)
            .then((x) => {
            if (timeout) {
                setTimeout(async () => {
                    if (x.deletable)
                        x.delete().catch(() => { });
                    this._.tips.set(tipid, false);
                }, timeout);
            }
        })
            .catch(() => {
            this._.tips.set(tipid, false);
        });
    }
    noerr() {
        this._noerr(...arguments);
        return this.ctx.client.cache.games.password.delete(this.ctx.user.id);
    }
    _noerr(...a) {
        this.message?.reply("Something went wrong!");
        console.log(...a);
        return true;
    }
    exists() {
        return this.message
            ? this.message
                .fetch(true)
                .then(() => true)
                .catch(() => false)
            : false;
    }
    messageLocation() {
        return this.message
            ? (0, discord_js_1.messageLink)(this.message.channelId, this.message.id, this.message.guildId)
            : null;
    }
}
exports.PasswordGame = PasswordGame;
async function getWordleAnswer(p) {
    if (p.message)
        p.message
            .reply({
            content: `Get your wordle answer here. **[www.nytimes.com](https://www.nytimes.com/games/wordle/index.html)**`,
        })
            .then((msg) => {
            setTimeout(() => {
                if (msg.deletable) {
                    msg.delete().catch(() => { });
                }
            }, 30 * 1000);
        })
            .catch(() => { });
    let api = `https://www.nytimes.com/svc/wordle/v2/YYYY-MM-DD.json`;
    let YYYY = new Date().getFullYear();
    let MM = new Date().getMonth() + 1;
    let DD = new Date().getDate();
    let url = api
        .replace("YYYY", YYYY.toString())
        .replace("MM", MM.toString().padStart(2, "0"))
        .replace("DD", DD.toString().padStart(2, "0"));
    let res = await fetch(url);
    let json = await res.json();
    return json.solution;
}
async function createCaptchaImage(text) {
    let height = 100;
    let width = 150;
    let canvas = (0, canvas_1.createCanvas)(width, height);
    let ctx = canvas.getContext("2d");
    /* White Background*/
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    /* Random Dots */
    let dotRadius = 3;
    let dots = Math.floor(Math.sqrt((height * width) / dotRadius));
    for (let i = 0; i < dots; i++) {
        let color = "#" +
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
    ctx.strokeStyle = ctx.fillStyle = "#101010f0";
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
    ctx.fillText(text, Math.floor(Math.random() * 10) + width / 2, Math.floor(Math.random() * 10) + height / 2);
    /* More Black noise */
    let noise = Math.floor(Math.random() * 100);
    for (let i = 0; i < noise; i++) {
        let color = "#000000" +
            (Math.floor(Math.random() * 40) + 90).toString(16).padStart(2, "0");
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, lineWidth, lineWidth);
    }
    /* Buffer */
    return canvas.toBuffer("image/png");
}
function sumOfDigits(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= "0" && str[i] <= "9") {
            sum += parseInt(str[i]);
        }
    }
    return sum;
}
function randomCaptcha(n) {
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
    return sumOfDigits(r) > 18 ? randomCaptcha(n) : r;
}
function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=PasswordGame.js.map