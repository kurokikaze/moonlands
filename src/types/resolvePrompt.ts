import { ACTION_RESOLVE_PROMPT } from "../const";
import CardInGame from "../classes/CardInGame";

export type ResolvePromptType = {
    type: typeof ACTION_RESOLVE_PROMPT;
    generatedBy?: string;
    variable?: string;
    number?: number;
    player: number;
    cards?: CardInGame[];
    target?: CardInGame;
}
