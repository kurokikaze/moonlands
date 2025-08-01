import { State } from "..";
import CardInGame from "../classes/CardInGame";
import { PromptType } from "../types";
import { AnyPromptEnteredEffect } from "../types/effect";
export default function convertPromptActionToEffect(action: PromptType & {
    source: CardInGame;
}, state: State): AnyPromptEnteredEffect;
