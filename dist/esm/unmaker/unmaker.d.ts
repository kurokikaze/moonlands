import { State } from '../index.js';
import { AnyEffectType } from '../types/index.js';
import { UnAction } from './types.js';
export declare class Unmaker {
    private state;
    unActions: UnAction[];
    private historyStack;
    constructor(state: State);
    setCheckpoint(): void;
    revertToCheckpoint(state: State): void;
    generateUnAction(action: AnyEffectType): UnAction | undefined;
    applyUnAction(state: State, unaction: UnAction): void;
}
