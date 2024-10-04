import { SlashContext } from "../../commands/context";
import { EmbedBuilder, ModalBuilder, Message, ModalSubmitInteraction, ButtonInteraction } from "discord.js";
export type RuleChecker = (password: string, p?: PasswordGame) => Promise<boolean>;
export interface Rule {
    id: string;
    rule: string;
    simple: boolean;
    check: RuleChecker;
}
export declare const PasswordGameRules: Rule[];
export declare function getRule(q: number | string): Rule | undefined;
export declare class PasswordGame {
    ctx: SlashContext;
    time: number;
    password: string;
    emoji: string[];
    ruleN: number;
    _: {
        wordleAnswer: string | null;
        captcha: string | null;
        captchaImage: Buffer | null;
        hadfire: boolean;
    };
    message: Message | null;
    constructor(ctx: SlashContext);
    passedAllRules(): Promise<boolean>;
    rulesCompleted(): boolean;
    getRulesString(): Promise<string>;
    makeEmbed(): Promise<EmbedBuilder[]>;
    makeModal(): ModalBuilder;
    makeMessage(): Promise<any>;
    showCaptcha(): Promise<boolean>;
    isFireTask(): boolean;
    fireThePassword(): void;
    start(): Promise<void>;
    listenModal(interaction: ModalSubmitInteraction): Promise<void>;
    listenButton(interaction: ButtonInteraction): Promise<void>;
    refreshCaptcha(interaction: ButtonInteraction): Promise<void>;
    noerr(): boolean;
}
//# sourceMappingURL=PasswordGame.d.ts.map