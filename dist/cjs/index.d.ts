import { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, PROPERTY_POWER_COST, PROPERTY_CREATURE_TYPES, PROPERTY_STATUS, PROPERTY_ABLE_TO_ATTACK, PROPERTY_MAGI_NAME, PROPERTY_CAN_BE_ATTACKED, PROPERTY_PROTECTION, PROPERTY_CREATURE_NAME, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, CALCULATION_MULTIPLY, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_RELICS, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, SELECTOR_CREATURES_OF_TYPE, SELECTOR_CREATURES_NOT_OF_TYPE, SELECTOR_OWN_CREATURES_OF_TYPE, SELECTOR_STATUS, SELECTOR_CREATURES_WITHOUT_STATUS, SELECTOR_CREATURES_OF_PLAYER, SELECTOR_RANDOM_CARD_IN_HAND, STATUS_BURROWED, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_PROMPT_ENTERED, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI } from './const.js';
import CardInGame, { ConvertedCard } from './classes/CardInGame.js';
import { CostType } from './classes/Card.js';
import Zone from './classes/Zone.js';
import { Journal, JournalFrame } from './Journal.js';
export { Journal } from './Journal.js';
export type { JournalFrame, JournalEntry } from './Journal.js';
import { SelectorEngine } from './SelectorEngine.js';
import { PromptValidator } from './PromptValidator.js';
import { LogEngine } from './LogEngine.js';
import { CardWithModification, EnrichedStaticAbilityType, GameStaticAbility } from './LayeredModificationEngine.js';
import { AnyEffectType, PromptTypeType, RestrictionObjectType, RestrictionType, LogEntryType, PropertyType, PromptType, EnrichedAction, OperatorType, ConditionType, FindType, ContinuousEffectType, EffectType, ZoneType, Region, ProtectionType, SerializedState, FullSerializedState, SerializedZones, MercenneFixed, MetaDataRecord } from './types/index.js';
import { AnyPromptEnteredEffect, EnhancedDelayedTriggerType } from './types/effect.js';
import { CardType, StatusType } from './types/common.js';
import { AlternativeType } from './types/promptParams.js';
type PriorityType = typeof NO_PRIORITY | typeof PRIORITY_PRS | typeof PRIORITY_ATTACK | typeof PRIORITY_CREATURES;
export declare const DEFAULT_PROMPT_VARIABLE: Record<PromptTypeType, string>;
export type PromptParamsType = {
    cards?: ConvertedCard[];
    source?: CardInGame;
    availableCards?: string[];
    startingCards?: string[];
    paymentType?: typeof TYPE_CREATURE | typeof TYPE_RELIC | typeof TYPE_SPELL;
    paymentAmount?: number;
    numberOfCards?: number;
    restrictions?: RestrictionObjectType[] | null;
    restriction?: RestrictionType;
    amount?: number;
    effect?: {
        name: string;
        text: string;
    };
    zone?: ZoneType;
    zoneOwner?: number;
    sourceZone?: ZoneType;
    sourceZoneOwner?: number;
    targetZones?: ZoneType[];
    magi?: CardInGame[];
    min?: number;
    max?: number;
    alternatives?: AlternativeType[];
};
export type StateShape = {
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
    controllingPlayer: number;
    goesFirst?: number;
    zones: Zone[];
    log: LogEntryType[];
    actions: AnyEffectType[];
    savedActions: AnyEffectType[];
    mayEffectActions: AnyEffectType[];
    fallbackActions: AnyEffectType[];
    continuousEffects: ContinuousEffectType[];
    spellMetaData: Record<string, MetaDataRecord>;
    cardsAttached: Record<string, string[]>;
    attachedTo: Record<string, string>;
    delayedTriggers: EnhancedDelayedTriggerType[];
};
type DeckType = {
    player: number;
    deck: CardInGame[];
};
export declare class State {
    state: StateShape;
    players: number[];
    decks: DeckType[];
    winner: boolean | number;
    debug: boolean;
    twister: MercenneFixed | null;
    nanoid: () => string;
    twisterSeed: number;
    turn: number | null;
    rollDebugValue: number | null;
    actionsOne: any[];
    actionsTwo: any[];
    onAction: Function | null;
    onFullAction: Function | null;
    turnTimer: number | null;
    timerEnabled: boolean;
    turnTimeout: ReturnType<typeof setTimeout> | null;
    turnNotifyTimeout: ReturnType<typeof setTimeout> | null;
    selectorEngine: SelectorEngine;
    promptValidator: PromptValidator;
    logEngine: LogEngine;
    journal: Journal | null;
    private replacementEffectsCache;
    constructor(state?: StateShape);
    closeStreams(): void;
    initiatePRNG(seed: number): void;
    setOnAction(callback: (e: AnyEffectType) => void, fullStream?: boolean): void;
    addActionToStream(action: AnyEffectType): void;
    addValuesToAction(action: AnyEffectType): AnyEffectType;
    enableDebug(): void;
    setRollDebugValue(value: number): void;
    resetRollDebugValue(): void;
    hasWinner(): boolean;
    /**
     * Starts recording un-actions for every Mutation API call.
     * Frames can be nested; `rollback(frame)` restores the state to the moment
     * the frame was started, `endSearchFrame(frame)` keeps the changes.
     */
    beginSearchFrame(): JournalFrame;
    rollback(frame: JournalFrame): void;
    endSearchFrame(frame: JournalFrame): void;
    clone(): State;
    setPlayers(player1: number, player2: number): this;
    setDeck(player: number, cardNames: string[]): void;
    enableTurnTimer(timer?: number): void;
    startTurnTimer(): void;
    stopTurnTimer(): void;
    endTurn(): void;
    addActionToLog(action: AnyEffectType): void;
    createZones(): Zone[];
    serializeData(playerId: number, hideZones?: boolean): SerializedState;
    serializeFullState(playerId: number): FullSerializedState;
    serializeZones(playerId: number, hideZones?: boolean): SerializedZones;
    setup(): void;
    getOpponent(player: number): number;
    zoneHash: Map<string, Zone>;
    clearModifiedCardDataCache(): void;
    get modifiedCardDataCache(): Map<string, CardWithModification>;
    getZone(type: ZoneType, player?: number | null): Zone;
    getCurrentStep(): number | null;
    getActivePlayer(): number;
    getControllingPlayer(): number;
    getCurrentPriority(): PriorityType;
    private recordStateFields;
    private recordKey;
    /** Call before deleting keys from the record, so rollback can restore their order */
    private recordRecord;
    private recordCardData;
    private recordEnergy;
    unsetWinner(): void;
    setWinner(player: number): void;
    setTurn(turn: number | null): void;
    /** Adds (positive amount) or removes (negative amount) energy from the card */
    changeEnergy(card: CardInGame, amount: number): void;
    setEnergy(card: CardInGame, amount: number): void;
    markAttackDone(card: CardInGame): void;
    markAttackReceived(card: CardInGame): void;
    unmarkAttackReceived(card: CardInGame): void;
    markDefeatedCreature(card: CardInGame): void;
    unmarkDefeatedCreature(card: CardInGame): void;
    forbidAttacks(card: CardInGame): void;
    clearAttackMarkers(card: CardInGame): void;
    setActionUsed(card: CardInGame, actionName: string): void;
    clearActionsUsed(card: CardInGame): void;
    /**
     * Moves the card between zones. Moved card becomes a new object with a new id.
     * Returns the new card object, or null if the card is not in the source zone.
     */
    moveCard(card: CardInGame, from: Zone, to: Zone, bottom?: boolean): CardInGame | null;
    setZoneCards(zone: Zone, cards: CardInGame[]): void;
    shuffleZone(zone: Zone): void;
    setSpellMetadata(metadata: any, spellId: string): void;
    setSpellMetaDataField(field: string, value: any, spellId: string): void;
    clearSpellMetaDataField(field: string, spellId: string): void;
    attachCard(cardId: string, attachmentTargetId: string): void;
    removeAttachments(cardId: string): void;
    detachCard(cardId: string): void;
    addContinuousEffect(effect: ContinuousEffectType): void;
    setContinuousEffects(effects: ContinuousEffectType[]): void;
    addDelayedTrigger(trigger: EnhancedDelayedTriggerType): void;
    removeDelayedTrigger(triggerId: string): void;
    setPrompt(prompt: {
        promptType: PromptTypeType;
        promptParams: PromptParamsType;
        promptMessage?: string;
        promptPlayer?: number;
        promptVariable?: string;
        promptGeneratedBy?: string;
    }): void;
    clearPrompt(): void;
    /** Sets actions to apply if the may effect is accepted (and, optionally, if it is declined) */
    setMayEffectActions(mayEffectActions: AnyEffectType[], fallbackActions?: AnyEffectType[]): void;
    clearMayEffectActions(): void;
    addActions(...args: AnyEffectType[]): void;
    transformIntoActions(...args: AnyEffectType[]): void;
    setActions(actions: AnyEffectType[]): void;
    setSavedActions(actions: AnyEffectType[]): void;
    setStep(step: number | null): void;
    /** Sets both the active and the controlling player */
    setActivePlayer(player: number): void;
    addLogEntry(entry: LogEntryType): void;
    private getNextAction;
    hasActions(): boolean;
    getSpellMetadata(spellId: string): MetaDataRecord;
    getMetaValue<T>(value: string | T, spellId: string | undefined): T | any;
    /**
         * Same as getMetaValue, but instead of $-variables it uses %-variables
         * $-variables are kept intact, we probably need them
         * %-variables include usual "self": link to trigger source
         */
    prepareMetaValue<T>(value: string | T, action: AnyEffectType, self: CardInGame, spellId: string): T | any;
    selectNthCardOfZone(player: number, zoneType: ZoneType, cardNumber: number, restrictions?: RestrictionObjectType[]): CardInGame[];
    selectRandomCardOfZone(player: number, zoneType: ZoneType): CardInGame[];
    useSelector(selector: typeof SELECTOR_STATUS, player: null, argument: StatusType): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS, player: null, argument: StatusType): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE, player: number, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_TYPE, player: null, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE, player: null, argument: string): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_REGION, player: number, argument: Region): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_REGION, player: number, argument: Region): CardInGame[];
    useSelector(selector: typeof SELECTOR_OPPONENT_ID, player: number | null, argument: number): number;
    useSelector(selector: typeof SELECTOR_TOP_MAGI_OF_PILE, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_MAGI, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_ENEMY_MAGI, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CREATURES, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_CREATURES_OF_PLAYER, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CARDS_IN_PLAY, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, player: number): CardInGame[];
    useSelector(selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_RELICS, player: null): CardInGame[];
    useSelector(selector: typeof SELECTOR_RANDOM_CARD_IN_HAND, player: null): CardInGame[];
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_ATTACK): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_BE_ATTACKED): boolean;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ATTACKS_PER_TURN): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGIZE): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGY_COUNT): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_POWER_COST, subProperty: string): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLER): number;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_PROTECTION): ProtectionType | undefined;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_MAGI_NAME): string;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_TYPE): CardType;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_TYPES): string[];
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_NAME): string;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_COST): CostType;
    getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_STATUS, subProperty: typeof STATUS_BURROWED): boolean;
    isCardAffectedByEffect(card: CardInGame, effect: EnrichedAction & EffectType): boolean;
    isCardAffectedByStaticAbility(card: CardInGame | CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): boolean;
    modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty?: string | null | undefined): any;
    layeredDataReducer(currentCard: CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): CardWithModification;
    makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean;
    checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]): boolean;
    checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any): boolean;
    makeCardFilter(restrictions?: RestrictionObjectType[]): (c: CardInGame) => boolean;
    getObjectOrSelf(action: AnyEffectType, self: CardInGame, object: string | number | boolean, property: boolean): any;
    clearReplacementEffectsCache(): void;
    invalidateReplacementEffectsForZoneChange(zone: Zone, previousCards: CardInGame[], cards: CardInGame[]): void;
    replaceByReplacementEffect(action: AnyEffectType): AnyEffectType[];
    checkCondition(action: AnyEffectType, self: CardInGame, condition: ConditionType): any;
    matchAction(action: AnyEffectType, find: FindType, self: CardInGame): boolean;
    triggerAbilities(action: AnyEffectType): void;
    convertPromptActionToEffect(action: PromptType & {
        source: CardInGame;
    }): AnyPromptEnteredEffect;
    performCalculation(operator: OperatorType, operandOne: number, operandTwo: number): number;
    calculateTotalCost(card: CardInGame): number;
    getAvailableCards(player: number, topMagi: CardInGame): string[];
    checkPrompts(source: CardInGame, preparedActions: AnyEffectType[], isPower?: boolean, powerCost?: number): boolean;
    update(initialAction: AnyEffectType): boolean;
}
export { TYPE_CREATURE, TYPE_MAGI, TYPE_RELIC, TYPE_SPELL, ACTION_PASS, ACTION_PLAY, ACTION_POWER, ACTION_EFFECT, ACTION_SELECT, ACTION_CALCULATE, ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT, ACTION_GET_PROPERTY_VALUE, ACTION_ATTACK, ACTION_PLAYER_WINS, PROPERTY_ID, PROPERTY_TYPE, PROPERTY_CONTROLLER, PROPERTY_ENERGY_COUNT, PROPERTY_REGION, PROPERTY_COST, PROPERTY_ENERGIZE, PROPERTY_MAGI_STARTING_ENERGY, PROPERTY_ATTACKS_PER_TURN, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, CALCULATION_MULTIPLY, SELECTOR_CREATURES, SELECTOR_CREATURES_AND_MAGI, SELECTOR_OWN_MAGI, SELECTOR_ENEMY_MAGI, SELECTOR_CREATURES_OF_REGION, SELECTOR_CREATURES_NOT_OF_REGION, SELECTOR_OWN_CREATURES, SELECTOR_ENEMY_CREATURES, SELECTOR_TOP_MAGI_OF_PILE, SELECTOR_MAGI_OF_REGION, SELECTOR_OPPONENT_ID, SELECTOR_MAGI_NOT_OF_REGION, SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, SELECTOR_CARDS_WITH_ENERGIZE_RATE, SELECTOR_OWN_CARDS_IN_PLAY, NO_PRIORITY, PRIORITY_PRS, PRIORITY_ATTACK, PRIORITY_CREATURES, PROMPT_TYPE_NUMBER, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, EFFECT_TYPE_DRAW, EFFECT_TYPE_RESHUFFLE_DISCARD, EFFECT_TYPE_ADD_DELAYED_TRIGGER, EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES, EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE, EFFECT_TYPE_MOVE_ENERGY, EFFECT_TYPE_ROLL_DIE, EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_PLAY_SPELL, EFFECT_TYPE_CREATURE_ENTERS_PLAY, EFFECT_TYPE_RELIC_ENTERS_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_ADD_ENERGY_TO_MAGI, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI, EFFECT_TYPE_CREATURE_DEFEATS_CREATURE, EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
EFFECT_TYPE_BEFORE_DAMAGE, EFFECT_TYPE_DEAL_DAMAGE, EFFECT_TYPE_AFTER_DAMAGE, EFFECT_TYPE_CREATURE_ATTACKS, EFFECT_TYPE_CREATURE_IS_ATTACKED, EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_TURN, EFFECT_TYPE_START_STEP, EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MAGI_FLIPPED, EFFECT_TYPE_FIND_STARTING_CARDS, EFFECT_TYPE_DRAW_REST_OF_CARDS, EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_PROMPT_ENTERED, REGION_UNIVERSAL, COST_X, COST_X_PLUS_ONE, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DISCARD, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_MAGI_PILE, ZONE_TYPE_DECK, ZONE_TYPE_DEFEATED_MAGI, };
