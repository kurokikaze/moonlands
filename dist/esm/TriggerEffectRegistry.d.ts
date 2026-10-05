import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import type { AnyEffectType, ContinuousEffectType, FindType, TriggerEffectType } from './types/index.js';
import type { EnhancedDelayedTriggerType } from './types/effect.js';
export interface TriggerEffectRegistryContext {
    getZones(): Zone[];
    getPlayers(): number[];
    getDelayedTriggers(): EnhancedDelayedTriggerType[];
    getContinuousEffects(): ContinuousEffectType[];
    matchAction(action: AnyEffectType, find: FindType, self?: CardInGame): boolean;
}
export type RegisteredTriggerEffect = {
    kind: 'card' | 'delayed' | 'continuous';
    trigger: TriggerEffectType;
    self?: CardInGame;
    /** Identity of the owning delayed trigger or continuous effect, not its source. */
    id?: string;
    player: number;
};
/**
 * Derived state: never serialized or shared between State clones.
 * Reconcile source identities and definitions before lookup, because public zone
 * arrays and unmaker can mutate canonical state without going through handlers.
 * Unchanged sources reuse the index; only candidates of this effectType are matched.
 */
export declare class TriggerEffectRegistry {
    private context;
    private sources;
    private byEffectType;
    private indexedEffectTypes;
    constructor(context: TriggerEffectRegistryContext);
    invalidate(): void;
    synchronize(): void;
    getCandidates(action: AnyEffectType): RegisteredTriggerEffect[];
    /** Evaluate lazily, preserving metadata updates between successive matches. */
    getMatchingTriggers(action: AnyEffectType): IterableIterator<RegisteredTriggerEffect>;
}
