/** Ordered source chunks: edits reuse every unchanged source's registrations. */
export class SourceEffectIndex {
    constructor(createEntries, effectType) {
        this.createEntries = createEntries;
        this.effectType = effectType;
        this.groups = new Map();
        this.buckets = new Map();
        this.all = null;
    }
    clear() {
        this.groups.clear();
        this.buckets.clear();
        this.all = null;
    }
    setGroup(key, sources) {
        var _a;
        const previous = this.groups.get(key);
        if (previous && previous.sources.length === sources.length && previous.sources.every((source, index) => source === sources[index]))
            return;
        const chunks = new Map();
        const byType = new Map();
        const all = [];
        for (const source of sources) {
            const existing = previous === null || previous === void 0 ? void 0 : previous.chunks.get(source);
            const entries = (_a = existing === null || existing === void 0 ? void 0 : existing.entries) !== null && _a !== void 0 ? _a : this.createEntries(source);
            const chunk = existing !== null && existing !== void 0 ? existing : { entries, types: new Set(entries.map(this.effectType)) };
            chunks.set(source, chunk);
            all.push(...chunk.entries);
            for (const entry of chunk.entries) {
                const type = this.effectType(entry);
                const bucket = byType.get(type);
                if (bucket)
                    bucket.push(entry);
                else
                    byType.set(type, [entry]);
            }
        }
        const same = (left = [], right = []) => left.length === right.length && left.every((entry, index) => entry === right[index]);
        for (const type of new Set([...(previous === null || previous === void 0 ? void 0 : previous.byType.keys()) || [], ...byType.keys()])) {
            if (!same(previous === null || previous === void 0 ? void 0 : previous.byType.get(type), byType.get(type)))
                this.buckets.delete(type);
        }
        this.groups.set(key, { sources: [...sources], chunks, byType, all });
        if (!same(previous === null || previous === void 0 ? void 0 : previous.all, all))
            this.all = null;
    }
    getAll() {
        if (this.all === null)
            this.all = this.collect();
        return this.all;
    }
    getByEffectType(type) {
        let bucket = this.buckets.get(type);
        if (!bucket) {
            bucket = this.collect(type);
            this.buckets.set(type, bucket);
        }
        return bucket;
    }
    collect(type) {
        const entries = [];
        // Only a fixed number of groups are visited, never their cards/source definitions.
        for (const group of this.groups.values()) {
            entries.push(...(type === undefined ? group.all : group.byType.get(type) || []));
        }
        return entries;
    }
}
//# sourceMappingURL=SourceEffectIndex.js.map