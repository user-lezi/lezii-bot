"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUtils = void 0;
const discord_js_1 = require("discord.js");
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
    roundN(n, decimals = 2) {
        return Number(n.toFixed(decimals));
    }
    embed() {
        return new discord_js_1.EmbedBuilder().setColor(this.client._.color.main);
    }
}
exports.ClientUtils = ClientUtils;
//# sourceMappingURL=ClientUtils.js.map