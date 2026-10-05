import type CardInGame from './classes/CardInGame.js';
import type Zone from './classes/Zone.js';
import type { FindType, ReplacementEffectType } from './types/index.js';
import type { SourceChange } from './SourceChangeService.js';
export type RegisteredReplacementEffect = ReplacementEffectType<FindType> & {
    self: CardInGame;
};
export interface ReplacementEffectRegistryContext {
    getZones(): Zone[];
    getPlayers(): number[];
    ensureSourcesCurrent(): void;
    subscribeSourceChanges(listener: (change: SourceChange) => void): () => void;
}
/** Conditions, controller and once-per-turn usage are intentionally not cached. */
export declare class ReplacementEffectRegistry {
    private context;
    private initialized;
    private watchedZones;
    private unsubscribe;
    private index;
    constructor(context: ReplacementEffectRegistryContext);
    private onSourceChange;
    dispose(): void;
    invalidate(): void;
    getCandidates(): RegisteredReplacementEffect[];
}
