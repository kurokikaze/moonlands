import { StaticAbilityType, TriggerEffectType } from "./index.js";
import CardInGame from "../classes/CardInGame.js";
import { ACTION_CHANGE, CHANGE_TYPE_ADD_ENERGY_TO_CREATURE, CHANGE_TYPE_ADD_ENERGY_TO_MAGI, CHANGE_TYPE_CREATE_CONTINUOUS_EFFECT, CHANGE_TYPE_CREATE_METADATA, CHANGE_TYPE_DISCARD_ENERGY_FROM_CREATURE, CHANGE_TYPE_DISCARD_ENERGY_FROM_MAGI, CHANGE_TYPE_DRAW, CHANGE_TYPE_FIND_STARTING_CARDS, CHANGE_TYPE_MOVE_CARD_BETWEEN_ZONES, CHANGE_TYPE_RESHUFFLE_DISCARD, CHANGE_TYPE_START_STEP, CHANGE_TYPE_START_TURN, EFFECT_TYPE_ADD_DELAYED_TRIGGER } from "../const.js";
import { ExpirationObjectType, ZoneType } from "./common.js";
import { DelayedTriggerType } from "./effect.js";
type ActionChange = {
    type: typeof ACTION_CHANGE;
    generatedBy: string;
    player?: number;
};
type DrawChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_DRAW;
    stepEffect?: boolean;
};
type ReshuffleDiscardChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_RESHUFFLE_DISCARD;
    player: number;
};
type FindStartingCardsChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_FIND_STARTING_CARDS;
    cards: string;
};
type StartTurnChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_START_TURN;
    player: number;
};
type StartStepChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_START_STEP;
    player: number;
    step: number;
};
type MoveCardBetwenZonesChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_MOVE_CARD_BETWEEN_ZONES;
    target: string | CardInGame;
    bottom: boolean;
    attack?: boolean;
    sourceZone: ZoneType;
    destinationZone: ZoneType;
};
type AddEnergyToCreatureChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_ADD_ENERGY_TO_CREATURE;
    target: CardInGame;
    source: CardInGame | undefined;
    power?: boolean;
    amount: number;
};
type AddEnergyToMagiChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_ADD_ENERGY_TO_MAGI;
    target: CardInGame | CardInGame[];
    amount: string | number;
};
type DiscardEnergyFromCreatureChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_DISCARD_ENERGY_FROM_CREATURE;
    target: CardInGame;
    source: CardInGame;
    power?: boolean;
    attack?: boolean;
    spell?: boolean;
    relic?: boolean;
    amount: number;
};
type DiscardEnergyFromMagiChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_DISCARD_ENERGY_FROM_MAGI;
    target: CardInGame | CardInGame[];
    source: CardInGame;
    attack?: boolean;
    relic?: boolean;
    spell?: boolean;
    amount: number;
};
export type CreateContinuousChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_CREATE_CONTINUOUS_EFFECT;
    staticAbilities?: StaticAbilityType[];
    triggerEffects?: TriggerEffectType[];
    expiration: ExpirationObjectType;
};
export type CreateMetadataChange = ActionChange & {
    changeType: typeof CHANGE_TYPE_CREATE_METADATA;
    metadata: string;
    value: any;
};
type AddDelayedTriggerChange = ActionChange & {
    changeType: typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER;
    delayedTrigger: DelayedTriggerType;
};
export type ChangeType = DrawChange | ReshuffleDiscardChange | FindStartingCardsChange | StartTurnChange | StartStepChange | MoveCardBetwenZonesChange | AddEnergyToCreatureChange | AddEnergyToMagiChange | DiscardEnergyFromCreatureChange | DiscardEnergyFromMagiChange | CreateContinuousChange | AddDelayedTriggerChange | CreateMetadataChange;
export {};
