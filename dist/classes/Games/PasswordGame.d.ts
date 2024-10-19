import { SlashContext } from "../../commands/context";
import { EmbedBuilder, ModalBuilder, Message, ModalSubmitInteraction, ButtonInteraction, Collection } from "discord.js";
export type RuleChecker = (password: string, p?: PasswordGame) => Promise<boolean>;
export type ShowPasswordError = (password: string, p: PasswordGame) => Promise<string>;
export interface Rule {
    id: string;
    rule: string;
    simple: boolean;
    check: RuleChecker;
    show?: ShowPasswordError;
}
export type ICE = [string, string, number, number, string];
export declare const TwoLetterElements: string[];
export declare const PasswordGameRules: Rule[];
export declare function getRule(q: number | string): Rule | undefined;
export declare class PasswordGame {
    ctx: SlashContext;
    time: number;
    password: string;
    emoji: string[];
    ruleN: number;
    sruleN: number;
    _: {
        wordleAnswer: string | null;
        captcha: string | null;
        captchaImage: Buffer | null;
        hadfire: boolean;
        tips: Collection<string, boolean>;
    };
    message: Message | null;
    constructor(ctx: SlashContext);
    passedAllRules(): Promise<boolean>;
    rulesCompleted(): boolean;
    getRulesString(): Promise<string>;
    formatPassword(): Promise<string>;
    makeEmbed(includelength?: boolean): Promise<EmbedBuilder[]>;
    makeModal(): ModalBuilder;
    makeMessage(): Promise<any>;
    showCaptcha(): Promise<boolean>;
    isFireTask(): boolean;
    fireThePassword(): void;
    start(): Promise<void>;
    listenModal(interaction: ModalSubmitInteraction): Promise<void>;
    listenButton(interaction: ButtonInteraction): Promise<void>;
    refreshCaptcha(interaction: ButtonInteraction): Promise<void>;
    sendTip(tipid: string, message: string, timeout?: number): Promise<void> | undefined;
    noerr(): boolean;
    _noerr(...a: unknown[]): boolean;
}
//# sourceMappingURL=PasswordGame.d.ts.map