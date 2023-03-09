import { ACTION_RESOLVE_PROMPT } from "../const";
import CardInGame from "../classes/CardInGame";
interface ResolvePromptInterface {
    type: typeof ACTION_RESOLVE_PROMPT;
    generatedBy?: string;
    variable?: string;
    player: number;
    useEffect?: boolean;
    replacedBy?: string[];
}
export declare type ResolveRearrangeEnergyPrompt = ResolvePromptInterface & {
    energyOnCreatures: Record<string, number>;
};
export declare type ResolveDistributeEnergyPrompt = ResolvePromptInterface & {
    energyOnCreatures: Record<string, number>;
};
export declare type ResolveDistributeDamagePrompt = ResolvePromptInterface & {
    damageOnCreatures: Record<string, number>;
};
export declare type ResolvePlayerPrompt = ResolvePromptInterface & {
    targetPlayer: number;
};
export declare type ResolveRearrangeCardsPrompt = ResolvePromptInterface & {
    cardsOrder: string[];
};
export declare type ResolvePromptType = ResolvePromptInterface & {
    number?: number | string;
    cards?: CardInGame[];
    target?: CardInGame;
} | ResolveRearrangeEnergyPrompt | ResolveDistributeEnergyPrompt | ResolveDistributeDamagePrompt | ResolvePlayerPrompt | ResolveRearrangeCardsPrompt;
export {};
