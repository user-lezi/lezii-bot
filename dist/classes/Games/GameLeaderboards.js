"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordGameLeaderboard = exports.BaseLeaderboard = exports.LeaderboardEmojis = void 0;
const _1 = require(".");
const discord_js_1 = require("discord.js");
const context_1 = require("../../commands/context");
exports.LeaderboardEmojis = {
    first: "🥇",
    second: "🥈",
    third: "🥉",
    next: "🏅",
    other: "🎖",
};
class BaseLeaderboard {
    client;
    sliceLength;
    values = [];
    sortingTypes = [];
    sorterEmojis = {};
    defaultSort;
    sliceIndex = 0;
    Game = {};
    constructor(client, sliceLength) {
        this.client = client;
        this.sliceLength = sliceLength;
    }
    get db() {
        return this.client.db;
    }
    get size() {
        return this.values.length;
    }
    async init() { }
    fetchValues(g) {
        return this.db
            .all()
            .then((d) => (this.values = d.filter((x) => x.key.startsWith(`lb_${g}_`))));
    }
    async sort(sortBy = this.defaultSort) { }
    _format(caller) {
        let startIndex = this.sliceIndex * this.sliceLength;
        let res = [];
        for (let i = startIndex; i < startIndex + this.sliceLength; i++) {
            let value = this.values[i];
            if (!value)
                break;
            res.push(caller(value, i));
        }
        return res;
    }
    list() {
        return [];
    }
    components(uid) {
        return [];
    }
    async interact(msg) {
        return;
    }
}
exports.BaseLeaderboard = BaseLeaderboard;
class PasswordGameLeaderboard extends BaseLeaderboard {
    constructor(client, sliceLength) {
        super(client, sliceLength);
        this.sortingTypes = ["length", "time"];
        this.defaultSort = "length";
        this.sorterEmojis = {
            length: "📏",
            time: "⏰",
        };
        this.Game = _1.Games.find((x) => x.value == "password");
    }
    async init() {
        await this.fetchValues("pg");
        await this.sort();
    }
    async sort(sortBy = this.defaultSort) {
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
    list(valueType = this.defaultSort) {
        let func = (v, i) => {
            let id = v.key.split("_")[2];
            let user = this.client.users.cache.get(id);
            let u = user
                ? context_1.SlashContext.userMention(user)
                : (0, discord_js_1.hyperlink)(id, context_1.SlashContext.userLink(id));
            let emoji = i == 0
                ? exports.LeaderboardEmojis.first
                : i == 1
                    ? exports.LeaderboardEmojis.second
                    : i == 2
                        ? exports.LeaderboardEmojis.third
                        : i <= 4
                            ? exports.LeaderboardEmojis.next
                            : exports.LeaderboardEmojis.other;
            let head = (0, discord_js_1.heading)((0, discord_js_1.bold)(`${i + 1}. ${emoji} ${u}`) + "\n", discord_js_1.HeadingLevel.Three);
            switch (valueType) {
                case "length":
                    return (head +
                        (0, discord_js_1.subtext)(`Password Length: ${(0, discord_js_1.bold)(v.value[0].length + " chars")}\n`));
                case "time":
                    return (head +
                        (0, discord_js_1.subtext)(`Time Taken: ${(0, discord_js_1.bold)(this.client.util.parseMS(v.value[1].time))}\n`));
                default:
                    return "";
            }
        };
        return this._format(func);
    }
    // @ts-ignore
    components(uid) {
        let options = [];
        for (const x of this.sortingTypes) {
            options.push(new discord_js_1.StringSelectMenuOptionBuilder()
                .setEmoji(this.sorterEmojis[x])
                .setValue(x)
                .setLabel(title(x)));
        }
        let sortByMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(uid + "_lb_pg_s")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Sort By")
            .setOptions(...options);
        let buttonRow = this.client.util.addButtonRow([`${uid}_lb_pg_bb`, "", "⏪", discord_js_1.ButtonStyle.Primary, this.sliceIndex == 0], [`${uid}_lb_pg_b`, "", "◀️", discord_js_1.ButtonStyle.Primary, this.sliceIndex == 0], [
            `${uid}_lb_pg_f`,
            "",
            "▶️",
            discord_js_1.ButtonStyle.Primary,
            (this.sliceIndex + 1) * this.sliceLength >= this.size,
        ], [
            `${uid}_lb_pg_ff`,
            "",
            "⏩",
            discord_js_1.ButtonStyle.Primary,
            (this.sliceIndex + 1) * this.sliceLength >= this.size,
        ]);
        return [
            new discord_js_1.ActionRowBuilder().addComponents(sortByMenu),
            buttonRow,
        ];
    }
    async interact(msg) {
        let collector = msg.createMessageComponentCollector({
            filter: (i) => i.customId.startsWith(i.user.id + "_"),
            time: 30 * 1000,
        });
        collector.on("collect", async (i) => {
            await i.deferUpdate().catch(() => { });
            if (i.isStringSelectMenu()) {
                let newSortType = i.values[0];
                this.defaultSort = newSortType;
                await this.sort();
            }
            else if (i.isButton()) {
                let movement = i.customId.split("_")[3];
                //ff or bb
                if (movement.length == 2) {
                    this.sliceIndex =
                        movement == "bb"
                            ? 0
                            : Math.ceil(this.size / this.sliceLength) - 1;
                }
                else
                    this.sliceIndex += movement == "b" ? -1 : 1;
            }
            else {
                return;
            }
            let list = this.list();
            let embed = new discord_js_1.EmbedBuilder(msg.embeds[0].toJSON()).setDescription([
                (0, discord_js_1.heading)(`Leaderboard`, discord_js_1.HeadingLevel.One),
                (0, discord_js_1.heading)(this.Game.name, discord_js_1.HeadingLevel.Two),
                (0, discord_js_1.heading)(list.join("\n"), discord_js_1.HeadingLevel.Three),
            ].join("\n"));
            await msg
                .edit({
                embeds: [embed],
                components: this.components(i.user.id),
            })
                .catch(() => { });
            collector.resetTimer();
        });
        collector.on("end", () => {
            msg.edit({ content: (0, discord_js_1.italic)("Timeout"), components: [] }).catch(() => { });
        });
        return;
    }
}
exports.PasswordGameLeaderboard = PasswordGameLeaderboard;
function title(s) {
    return s
        .split(" ")
        .map((x) => x[0].toUpperCase() + x.slice(1, x.length))
        .join(" ");
}
//# sourceMappingURL=GameLeaderboards.js.map