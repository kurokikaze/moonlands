import type CardInGame from './classes/CardInGame.js';
import type Zone from './classes/Zone.js';
import type { State, StateShape } from './index.js';
type CardDataSnapshot = {
    flags: number;
    data: CardInGame['data'];
};
type TwisterState = {
    mt: number[];
    mti: number;
};
/**
 * Un-actions recorded by the State mutation API.
 * Each entry holds exactly what is needed to restore the state
 * to how it was right before the corresponding mutation.
 */
export type JournalEntry = {
    kind: 'energy';
    card: CardInGame;
    previousEnergy: number;
    previousEnergyLostThisTurn: number;
} | {
    kind: 'cardData';
    card: CardInGame;
    previous: CardDataSnapshot;
} | {
    kind: 'moveCard';
    card: CardInGame;
    newCard: CardInGame;
    from: Zone;
    to: Zone;
    fromIndex: number;
} | {
    kind: 'zoneCards';
    zone: Zone;
    previousCards: CardInGame[];
} | {
    kind: 'key';
    target: Record<string, any>;
    key: string;
    had: boolean;
    previous: any;
} | {
    kind: 'stateFields';
    previous: Partial<StateShape>;
} | {
    kind: 'arrayPush';
    array: any[];
    count: number;
} | {
    kind: 'arrayUnshift';
    array: any[];
    count: number;
} | {
    kind: 'arrayShift';
    array: any[];
    item: any;
} | {
    kind: 'winner';
    previous: boolean | number;
} | {
    kind: 'turn';
    previous: number | null;
};
export type JournalFrame = {
    index: number;
    depth: number;
    twister: TwisterState | null;
};
export declare const snapshotCardData: (card: CardInGame) => CardDataSnapshot;
export declare class Journal {
    private entries;
    private frames;
    get length(): number;
    get hasFrames(): boolean;
    record(entry: JournalEntry): void;
    beginFrame(twister: any): JournalFrame;
    /** Drops the frame (and frames nested in it) keeping the changes */
    endFrame(frame: JournalFrame): void;
    /** Undoes every mutation recorded since the frame was started. Nested frames are discarded too. */
    rollback(frame: JournalFrame, state: State): void;
    private checkFrame;
    private undo;
}
export {};
