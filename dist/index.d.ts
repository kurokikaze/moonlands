/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { Writable } from 'stream';
import EventEmitter from 'events';
import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_STATUS, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, CALCULATION_MULTIPLY } from './const';
import CardInGame, { ConvertedCard } from './classes/CardInGame';
import Zone from './classes/Zone';
import { AnyEffectType, PromptTypeType, RestrictionObjectType, RestrictionType, SelectorTypeType, LogEntryType, PropertyType, EnrichedAction, StaticAbilityType, OperatorType, ConditionType, FindType, TriggerEffectType, ReplacementEffectType, ContinuousEffectType, EffectType, ZoneType } from './types';
declare type EnrichedStaticAbilityType = StaticAbilityType & {
    player: number;
};
declare type GameStaticAbility = StaticAbilityType & {
    selector: typeof SELECTOR_STATUS;
};
declare type PriorityType = typeof NO_PRIORITY | typeof PRIORITY_PRS | typeof PRIORITY_ATTACK | typeof PRIORITY_CREATURES;
declare type MetadataRecord = {
    source?: CardInGame;
    new_card?: CardInGame;
};
declare type PromptParamsType = {
    cards?: ConvertedCard[];
    source?: CardInGame;
    availableCards?: string[];
    numberOfCards?: number;
    restrictions?: RestrictionObjectType[] | null;
    restriction?: RestrictionType;
    amount?: number;
    zone?: ZoneType;
    zoneOwner?: number;
    min?: number;
    max?: number;
};
declare type StateShape = {
    step: number | null;
    turn?: number;
    prompt: boolean;
    players: number[];
    promptType: PromptTypeType | null;
    promptMessage?: string;
    promptPlayer?: number;
    promptGeneratedBy?: string;
    promptVariable?: string;
    promptParams: PromptParamsType;
    activePlayer: number;
    goesFirst?: number;
    zones: Zone[];
    log: LogEntryType[];
    actions: AnyEffectType[];
    savedActions: AnyEffectType[];
    mayEffectActions: AnyEffectType[];
    fallbackActions: AnyEffectType[];
    continuousEffects: ContinuousEffectType[];
    spellMetaData: Record<string, MetadataRecord>;
    delayedTriggers: Record<string, any>[];
};
declare type DeckType = {
    player: number;
    deck: CardInGame[];
};
export declare class State {
    state: StateShape;
    players: number[];
    decks: DeckType[];
    winner: boolean | number;
    debug: boolean;
    turn: number | null;
    rollDebugValue: number | null;
    actionsOne: any[];
    actionsTwo: any[];
    actionStreamOne: EventEmitter;
    actionStreamTwo: EventEmitter;
    logStream: EventEmitter;
    commandStream: Writable;
    turnTimer: number | null;
    timerEnabled: boolean;
    turnTimeout: NodeJS.Timer | null;
    turnNotifyTimeout: NodeJS.Timer | null;
    constructor(state: StateShape);
    closeStreams(): void;
    addActionToStream(action: AnyEffectType): void;
    addValuesToAction(action: AnyEffectType): AnyEffectType;
    enableDebug(): void;
    setRollDebugValue(value: number): void;
    resetRollDebugValue(): void;
    setWinner(player: number): void;
    hasWinner(): boolean;
    clone(): State;
    setPlayers(player1: number, player2: number): this;
    setDeck(player: number, cardNames: string[]): void;
    enableTurnTimer(timer?: number): void;
    startTurnTimer(): void;
    stopTurnTimer(): void;
    endTurn(): void;
    addActionToLog(action: AnyEffectType): void;
    createZones(): Zone[];
    serializeData(playerId: number): {
        zones: {
            playerHand: ConvertedCard[];
            opponentHand: import("./classes/CardInGame").HiddenConvertedCard[];
            playerDeck: import("./classes/CardInGame").HiddenConvertedCard[];
            opponentDeck: import("./classes/CardInGame").HiddenConvertedCard[];
            playerActiveMagi: ConvertedCard[];
            opponentActiveMagi: ConvertedCard[];
            playerMagiPile: ConvertedCard[];
            opponentMagiPile: import("./classes/CardInGame").HiddenConvertedCard[];
            inPlay: (import("./classes/CardInGame").HiddenConvertedCard | ConvertedCard)[];
            playerDefeatedMagi: ConvertedCard[];
            opponentDefeatedMagi: ConvertedCard[];
            playerDiscard: ConvertedCard[];
            opponentDiscard: ConvertedCard[];
        };
        continuousEffects: ContinuousEffectType[];
        step: number;
        turn: number;
        goesFirst: number;
        activePlayer: number;
        prompt: boolean;
        promptType: PromptTypeType;
        promptMessage: string;
        promptPlayer: number;
        promptGeneratedBy: string;
        promptParams: PromptParamsType;
        log: LogEntryType[];
        gameEnded: boolean;
        winner: number | boolean;
    };
    serializeZones(playerId: number): {
        playerHand: ConvertedCard[];
        opponentHand: import("./classes/CardInGame").HiddenConvertedCard[];
        playerDeck: import("./classes/CardInGame").HiddenConvertedCard[];
        opponentDeck: import("./classes/CardInGame").HiddenConvertedCard[];
        playerActiveMagi: ConvertedCard[];
        opponentActiveMagi: ConvertedCard[];
        playerMagiPile: ConvertedCard[];
        opponentMagiPile: import("./classes/CardInGame").HiddenConvertedCard[];
        inPlay: (import("./classes/CardInGame").HiddenConvertedCard | ConvertedCard)[];
        playerDefeatedMagi: ConvertedCard[];
        opponentDefeatedMagi: ConvertedCard[];
        playerDiscard: ConvertedCard[];
        opponentDiscard: ConvertedCard[];
    };
    setup(): void;
    getOpponent(player: number): number;
    getZone(type: ZoneType, player?: number | null): Zone;
    getCurrentStep(): number;
    getActivePlayer(): number;
    getCurrentPriority(): PriorityType;
    addActions(...args: AnyEffectType[]): void;
    transformIntoActions(...args: AnyEffectType[]): void;
    removeDelayedTrigger(triggerId: number): void;
    getNextAction(): AnyEffectType;
    hasActions(): boolean;
    setSpellMetadata(metadata: any, spellId: string): void;
    getSpellMetadata(spellId: string): MetadataRecord | Record<string, any>;
    setSpellMetaDataField(field: string, value: any, spellId: string): void;
    getMetaValue<T>(value: string | T, spellId: string): T | any;
    /**
     * Same as getMetaValue, but instead of $-variables it uses %-variables
     * $-variables are kept intact, we probably need them
     * %-variables include usual "self": link to trigger source
     */
    prepareMetaValue<T>(value: string | T, action: AnyEffectType, self: CardInGame, spellId: string): T | any;
    useSelector(selector: SelectorTypeType, player: number, argument?: any): CardInGame[] | number;
    getByProperty(target: CardInGame, property: PropertyType, subProperty?: any): any;
    isCardAffectedByEffect(card: CardInGame, effect: EnrichedAction & EffectType): boolean;
    isCardAffectedByStaticAbility(card: CardInGame, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): any;
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: any): any;
    layeredDataReducer(currentCard: CardInGame, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): CardInGame | {
        modifiedCard: {
            cost: number;
            name: string;
            type: import("./types").CardType;
            region: any;
            data: import("./types").CardData;
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                energize: number;
                text?: string;
                startingEnergy?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                ableToAttack?: boolean;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                attacksPerTurn: number;
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                ableToAttack?: boolean;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                energyLossThreshold: number;
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                ableToAttack?: boolean;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                ableToAttack: any;
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                canBeAttacked: any;
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                ableToAttack?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        data: {
            controller: any;
            text?: string;
            startingEnergy?: number;
            energize?: number;
            startingCards?: string[];
            attacksPerTurn?: number;
            canAttackMagiDirectly?: boolean;
            canPackHunt?: boolean;
            powers?: {
                name: string;
                text: string;
                cost: number | "X";
                effects: AnyEffectType[];
            }[];
            protection?: import("./types").ProtectionType;
            staticAbilities?: StaticAbilityType[];
            effects?: AnyEffectType[];
            triggerEffects?: TriggerEffectType[];
            replacementEffects?: ReplacementEffectType[];
            energyLossThreshold?: number;
            ableToAttack?: boolean;
            canBeAttacked?: boolean;
            burrowed?: boolean;
            maxCostX?: number;
        };
        id: string;
        owner: number;
        modifiedCard: import("./classes/Card").default;
    } | {
        data: {
            burrowed: any;
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        id: string;
        owner: number;
        modifiedCard: import("./classes/Card").default;
    } | {
        modifiedCard: {
            data: {
                protection: any;
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                powers?: {
                    name: string;
                    text: string;
                    cost: number | "X";
                    effects: AnyEffectType[];
                }[];
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                ableToAttack?: boolean;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    } | {
        modifiedCard: {
            data: {
                powers: {
                    cost: number;
                    name: string;
                    text: string;
                    effects: AnyEffectType[];
                }[];
                text?: string;
                startingEnergy?: number;
                energize?: number;
                startingCards?: string[];
                attacksPerTurn?: number;
                canAttackMagiDirectly?: boolean;
                canPackHunt?: boolean;
                protection?: import("./types").ProtectionType;
                staticAbilities?: StaticAbilityType[];
                effects?: AnyEffectType[];
                triggerEffects?: TriggerEffectType[];
                replacementEffects?: ReplacementEffectType[];
                energyLossThreshold?: number;
                ableToAttack?: boolean;
                canBeAttacked?: boolean;
                burrowed?: boolean;
                maxCostX?: number;
            };
            name: string;
            type: import("./types").CardType;
            region: any;
            cost: number | "X" | "X_PLUS_ONE";
        };
        id: string;
        data: {
            energy: number;
            controller: number;
            attacked: number;
            actionsUsed: string[];
            energyLostThisTurn: number;
            defeatedCreature: boolean;
            hasAttacked: boolean;
            wasAttacked: boolean;
            burrowed?: boolean;
            ableToAttack?: boolean;
            energyLossThreshold?: number;
        };
        owner: number;
    };
    makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean;
    checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]): boolean;
    checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    makeCardFilter(restrictions?: RestrictionObjectType[]): (c: CardInGame) => boolean;
    getObjectOrSelf(action: AnyEffectType, self: CardInGame, object: string | number | boolean, property: boolean): any;
    replaceByReplacementEffect(action: AnyEffectType): AnyEffectType[];
    checkCondition(action: AnyEffectType, self: CardInGame, condition: ConditionType): any;
    matchAction(action: AnyEffectType, find: FindType, self: CardInGame): boolean;
    triggerAbilities(action: AnyEffectType): void;
    performCalculation(operator: OperatorType, operandOne: number, operandTwo: number): number;
    calculateTotalCost(card: CardInGame): number | null;
    getAvailableCards(player: number, topMagi: CardInGame): string[];
    checkPrompts(source: CardInGame, preparedActions: AnyEffectType[], isPower?: boolean, powerCost?: number): boolean;
    update(initialAction: AnyEffectType): boolean;
}
export { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, CALCULATION_MULTIPLY, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, };
