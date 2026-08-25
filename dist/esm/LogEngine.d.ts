import { AnyEffectType, LogEntryType, PromptTypeType } from './types/index.js';
export interface LogEngineContext {
    getMetaValue(value: any, spellId: string | undefined): any;
    getLog(): LogEntryType[];
    getPromptType(): PromptTypeType | null;
}
export declare class LogEngine {
    private context;
    constructor(context: LogEngineContext);
    addActionToLog(action: AnyEffectType): void;
    shouldCreateLog(action: AnyEffectType): LogEntryType[];
}
