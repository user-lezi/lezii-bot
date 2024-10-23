"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawCommands = void 0;
const discord_js_1 = require("discord.js");
const commands_json_1 = __importDefault(require("../json/commands.json"));
class _RawCommands extends discord_js_1.Collection {
    categories = new discord_js_1.Collection();
}
const RawCommands = new _RawCommands();
exports.RawCommands = RawCommands;
commands_json_1.default.forEach((x) => {
    let cmd = {
        name: x.name,
        category: x.category,
        description: x.description,
        options: x.options,
    };
    RawCommands.categories.set(x.category, (RawCommands.categories.get(x.category) ?? []).concat(x.name));
    RawCommands.set(cmd.name, cmd);
});
//# sourceMappingURL=rawCommands.js.map