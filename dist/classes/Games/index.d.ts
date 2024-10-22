import { type Client } from "../../client";
export type TGame = {
    name: string;
    value: keyof Client["cache"]["games"];
};
export declare const Games: TGame[];
export * from "./PasswordGame";
export * from "./GameLeaderboards";
//# sourceMappingURL=index.d.ts.map