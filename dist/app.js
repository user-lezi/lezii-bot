"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
async function default_1(client) {
    const app = (0, express_1.default)();
    app.set("json spaces", 2);
    app.use(express_1.default.urlencoded());
    app.use(express_1.default.json());
    app.listen(2000, () => {
        console.log(chalk_1.default.greenBright("Server Running..."));
    });
}
//# sourceMappingURL=app.js.map