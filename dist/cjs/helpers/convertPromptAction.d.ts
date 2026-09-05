import { State } from "../index.js";
import CardInGame from "../classes/CardInGame.js";
import { PromptType } from "../types/index.js";
import { AnyPromptEnteredEffect } from "../types/effect.js";
export default function convertPromptActionToEffect(action: PromptType & {
    source: CardInGame;
}, state: State): AnyPromptEnteredEffect;
