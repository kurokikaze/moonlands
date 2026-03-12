import { State } from '../index.js';
import { AnyEffectType } from '../types/index.js';
import { UnAction } from './types.js';
export declare class Unmaker {
    private state;
    unActions: UnAction[];
    dataBlob: Uint16Array<ArrayBuffer>;
    pointer: number;
    numberOfUnActions: number;
    private strings;
    private objects;
    private historyStack;
    constructor(state: State);
    setCheckpoint(): void;
    outputDebug(): void;
    revertToCheckpoint(): void;
    private saveNumber;
    private saveActionType;
    private readNumber;
    private saveString;
    private readString;
    private saveObject;
    private readObject;
    generateUnAction(action: AnyEffectType): UnAction | undefined;
    readAndApplyUnAction(state: State): void;
    applyUnAction(state: State, unaction: UnAction): void;
}
