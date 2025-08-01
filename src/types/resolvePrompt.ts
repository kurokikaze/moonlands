import { ACTION_RESOLVE_PROMPT } from "../const";
import CardInGame from "../classes/CardInGame";
import { ZoneType } from "./common";

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

export type ResolvePlayerPrompt = ResolvePromptInterface & {
    targetPlayer: number;
};

export type ResolveRearrangeCardsPrompt = ResolvePromptInterface & {
  cardsOrder: string[];
};

export type ResolvePowerOnMagiPrompt = ResolvePromptInterface & {
  power: any; // PowerType
  source: CardInGame;
}

export type ResolveAlternativePrompt = ResolvePromptInterface & {
  alternative: string;
}

export type ResolvePaymentSourcePrompt = ResolvePromptInterface & {
  target: CardInGame;
}

export type ResolveDistributeCardsPrompt = ResolvePromptInterface & {
  cards: Record<ZoneType, CardInGame>
}

export type ResolveMagiWithoutCreaturesPrompt = ResolvePromptInterface & {
  target: CardInGame;
}

export type ResolvePromptType = ResolvePromptInterface & {
    number?: number | string;
    cards?: CardInGame[];
    target?: CardInGame;
} | ResolveRearrangeEnergyPrompt
  | ResolveDistributeEnergyPrompt
  | ResolveDistributeDamagePrompt
  | ResolvePlayerPrompt
  | ResolveRearrangeCardsPrompt
  | ResolveAlternativePrompt
  | ResolvePaymentSourcePrompt
  | ResolvePowerOnMagiPrompt
  | ResolveMagiWithoutCreaturesPrompt;
