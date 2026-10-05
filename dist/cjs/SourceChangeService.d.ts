import type Zone from './classes/Zone.js';
import type CardInGame from './classes/CardInGame.js';
import type { ContinuousEffectType } from './types/index.js';
import type { EnhancedDelayedTriggerType } from './types/effect.js';
export type SourceChange = {
    kind: 'zone';
    zone: Zone;
    previous: CardInGame[];
    current: CardInGame[];
} | {
    kind: 'continuous';
    previous: ContinuousEffectType[];
    current: ContinuousEffectType[];
} | {
    kind: 'delayed';
    previous: EnhancedDelayedTriggerType[];
    current: EnhancedDelayedTriggerType[];
} | {
    kind: 'batch';
    changes: SourceChange[];
} | {
    kind: 'reset';
};
/** Structural notifications are synchronous, post-mutation, and never gameplay actions. */
export declare class SourceChangeService {
    private getPlayers;
    private listeners;
    private players;
    private batchDepth;
    private pending;
    private disposed;
    constructor(getPlayers: () => number[]);
    subscribe(listener: (change: SourceChange) => void): () => void;
    dispose(): void;
    /** Publish after the complete mutation/rollback, never between its two zone edits. */
    batch<T>(operation: () => T): T;
    /** Player assignments are infrequent; this is an O(1) topology check, not a source scan. */
    ensureCurrent(): void;
    /** Called only by explicit State mutation boundaries and non-recording Journal inverses. */
    emit(change: SourceChange): void;
}
