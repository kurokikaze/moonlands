import { State } from '../index';
import { AnyEffectType } from '../types';
import { UnAction } from './types';
export declare class Unmaker {
    private state;
    unActions: UnAction[];
    dataBlob: Uint32Array;
    pointer: number;
    numberOfUnActions: number;
    private strings;
    private objects;
    private historyStack;
    constructor(state: State);
    setCheckpointOld(): void;
    setCheckpoint(): void;
    revertToCheckpointOld(state: State): void;
    revertToCheckpoint(state: State): void;
    private saveNumber;
    private readNumber;
    private saveString;
    private readString;
    private saveObject;
    private readObject;
    generateUnAction(action: AnyEffectType): UnAction | undefined;
    readAndApplyUnAction(state: State): void;
    applyUnAction(state: State, unaction: UnAction): void;
}
