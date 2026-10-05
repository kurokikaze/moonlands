import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import type { AnyEffectType, ContinuousEffectType, FindType, TriggerEffectType } from './types/index.js';
import type { EnhancedDelayedTriggerType } from './types/effect.js';
import type { SourceChange } from './SourceChangeService.js';
export interface TriggerEffectRegistryContext {
    getZones(): Zone[];
    getPlayers(): number[];
    getDelayedTriggers(): EnhancedDelayedTriggerType[];
    getContinuousEffects(): ContinuousEffectType[];
    matchAction(action: AnyEffectType, find: FindType, self?: CardInGame): boolean;
    subscribeSourceChanges?(listener: (change: SourceChange) => void): () => void;
    ensureSourcesCurrent?(): void;
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
 * State contexts subscribe to structural edits, maintaining per-source chunks.
 * Only initialization or an explicit definition refresh scans all sources.
 * Standalone contexts without subscriptions retain the legacy reconciliation path.
 */
export declare class TriggerEffectRegistry {
    private context;
    private initialized;
    private watchedZones;
    private unsubscribe?;
    private index;
    private sources;
    private byEffectType;
    private indexedEffectTypes;
    constructor(context: TriggerEffectRegistryContext);
    dispose(): void;
    invalidate(): void;
    synchronize(): void;
    private onSourceChange;
    getCandidates(action: AnyEffectType): RegisteredTriggerEffect[];
    /** Evaluate lazily, preserving metadata updates between successive matches. */
    getMatchingTriggers(action: AnyEffectType): IterableIterator<RegisteredTriggerEffect>;
}
