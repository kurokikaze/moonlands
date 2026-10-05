/** Ordered source chunks: edits reuse every unchanged source's registrations. */
export declare class SourceEffectIndex<S extends object, E> {
    private createEntries;
    private effectType;
    private groups;
    private buckets;
    private all;
    constructor(createEntries: (source: S) => E[], effectType: (entry: E) => string);
    clear(): void;
    setGroup(key: object | string, sources: S[]): void;
    getAll(): E[];
    getByEffectType(type: string): E[];
    private collect;
}
