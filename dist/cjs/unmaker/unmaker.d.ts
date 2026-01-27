import { State } from '../index';
import { AnyEffectType } from '../types';
import { UnAction } from './types';
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
