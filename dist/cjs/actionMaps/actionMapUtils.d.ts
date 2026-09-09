import { ContinuousEffectType } from "../types/index.js";
export declare const updateContinuousEffects: (player: number) => (effect: ContinuousEffectType) => ContinuousEffectType | null | undefined;
export declare const oneOrSeveral: <T>(targets: T | T[], callback: (t: T) => void) => void;
