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

export type ResolveRearrangeEnergyPrompt = ResolvePromptInterface & {
    energyOnCreatures: Record<string, number>;
};

export type ResolveDistributeEnergyPrompt = ResolvePromptInterface & {
    energyOnCreatures: Record<string, number>;
};

export type ResolveDistributeDamagePrompt = ResolvePromptInterface & {
    damageOnCreatures: Record<string, number>;
};

export type ResolvePromptType = ResolvePromptInterface & {
    number?: number | string;
    cards?: CardInGame[];
    target?: CardInGame;
} | ResolveRearrangeEnergyPrompt | ResolveDistributeEnergyPrompt | ResolveDistributeDamagePrompt;
