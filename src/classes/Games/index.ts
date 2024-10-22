import { type Client } from "../../client";

export type TGame = {
  name: string;
  value: keyof Client["cache"]["games"];
};
export const Games = [{ name: "Password Game", value: "password" }] as TGame[];
export * from "./PasswordGame";

export * from "./GameLeaderboards";
