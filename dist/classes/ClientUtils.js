"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUtils = exports.TimeParser = void 0;
const discord_js_1 = require("discord.js");
const ms_utility_1 = __importDefault(require("ms-utility"));
const constants_1 = require("ms-utility/dist/constants");
exports.TimeParser = new ms_utility_1.default([
    ...constants_1.DefaultTimeUnits,
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
const elements_json_1 = __importDefault(require("../../json/elements.json"));
const ChemicalElements = new discord_js_1.Collection();
elements_json_1.default.forEach((x) => ChemicalElements.set(x[1], x));
class ClientUtils {
    #client;
    constructor(client) {
        this.#client = client;
    }
    get client() {
        return this.#client;
    }
    addButton(id, label, emoji, style, disabled = false) {
        let btn = new discord_js_1.ButtonBuilder().setStyle(style).setDisabled(disabled);
        if (label.length)
            btn.setLabel(label);
        if (emoji.length)
            btn.setEmoji(emoji);
        return style == discord_js_1.ButtonStyle.Link ? btn.setURL(id) : btn.setCustomId(id);
    }
    addButtonRow(...btns) {
        let row = new discord_js_1.ActionRowBuilder();
        for (let btn of btns)
            row.addComponents(this.addButton(...btn));
        return row;
    }
    stringChunks(str, length = 1000) {
        let regex = new RegExp(`[\\s\\S]{1,${length}}`, "g");
        return str.match(regex) ?? [];
    }
    stringSize(str) {
        let size = new TextEncoder().encode(str).length;
        return {
            size,
            KB: this.roundN(size / 1024),
            MB: this.roundN(size / 1024 / 1024),
        };
    }
    parseMS(ms) {
        return exports.TimeParser.parseToString(ms, {
            and: false,
            separator: " ",
        });
    }
    roundN(n, decimals = 2) {
        return Number(n.toFixed(decimals));
    }
    embed() {
        return new discord_js_1.EmbedBuilder().setColor(this.client._.color.main);
    }
    shuffleArr(arr, n = 2) {
        for (let i = 0; i < arr.length; i++) {
            let j = Math.floor(Math.random() * arr.length);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return n > 1 ? this.shuffleArr(arr, n - 1) : arr;
    }
    getElements(s) {
        let e = [];
        for (let i = 0; i < s.length - 1; i++) {
            let j = i + 1;
            let t = s[i] + s[j];
            let el = ChemicalElements.get(t);
            if (el)
                e.push(el);
        }
        return e;
    }
}
exports.ClientUtils = ClientUtils;
//# sourceMappingURL=ClientUtils.js.map