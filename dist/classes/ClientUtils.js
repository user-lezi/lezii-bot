"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUtils = void 0;
const discord_js_1 = require("discord.js");
const ChemicalElements = new discord_js_1.Collection();
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
        let c = {
            s: 1000,
            m: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24,
        };
        if (ms < 1000)
            return ms + "ms";
        let d = ms / c.d;
        let h = (ms % c.d) / c.h;
        let m = (ms % c.h) / c.m;
        let s = (ms % c.s) / c.s;
        return ((d >= 1 ? `${Math.floor(d)}d ` : "") +
            (h >= 1 ? `${Math.floor(h)}h ` : "") +
            (m >= 1 ? `${Math.floor(m)}m ` : "") +
            (s >= 1 ? `${Math.floor(s)}s` : ""));
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