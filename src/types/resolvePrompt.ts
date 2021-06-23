import { ACTION_RESOLVE_PROMPT } from "../const";
import CardInGame from "../classes/CardInGame";

export type ResolvePromptType = {
    type: typeof ACTION_RESOLVE_PROMPT;
    generatedBy?: string;
    variable?: string;
    number?: number | string;
    player: number;
    cards?: CardInGame[];
    target?: CardInGame;
    useEffect?: boolean;
    replacedBy?: string[];
}
