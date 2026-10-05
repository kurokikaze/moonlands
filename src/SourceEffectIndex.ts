type Chunk<E> = { entries: E[]; types: Set<string> };
type Group<S, E> = { sources: S[]; chunks: Map<S, Chunk<E>>; byType: Map<string, E[]>; all: E[] };

/** Ordered source chunks: edits reuse every unchanged source's registrations. */
export class SourceEffectIndex<S extends object, E> {
	private groups = new Map<object | string, Group<S, E>>();
	private buckets = new Map<string, E[]>();
	private all: E[] | null = null;

	constructor(private createEntries: (source: S) => E[], private effectType: (entry: E) => string) {}

	clear(): void {
		this.groups.clear();
		this.buckets.clear();
		this.all = null;
	}

	setGroup(key: object | string, sources: S[]): void {
		const previous = this.groups.get(key);
		if (previous && previous.sources.length === sources.length && previous.sources.every((source, index) => source === sources[index])) return;
		const chunks = new Map<S, Chunk<E>>();
		const byType = new Map<string, E[]>();
		const all: E[] = [];
		for (const source of sources) {
			const existing = previous?.chunks.get(source);
			const entries = existing?.entries ?? this.createEntries(source);
			const chunk = existing ?? { entries, types: new Set(entries.map(this.effectType)) };
			chunks.set(source, chunk);
			all.push(...chunk.entries);
			for (const entry of chunk.entries) {
				const type = this.effectType(entry);
				const bucket = byType.get(type);
				if (bucket) bucket.push(entry);
				else byType.set(type, [entry]);
			}
		}
		const same = (left: E[] = [], right: E[] = []) => left.length === right.length && left.every((entry, index) => entry === right[index]);
		for (const type of new Set([...previous?.byType.keys() || [], ...byType.keys()])) {
			if (!same(previous?.byType.get(type), byType.get(type))) this.buckets.delete(type);
		}
		this.groups.set(key, { sources: [...sources], chunks, byType, all });
		if (!same(previous?.all, all)) this.all = null;
	}

	getAll(): E[] {
		if (this.all === null) this.all = this.collect();
		return this.all;
	}

	getByEffectType(type: string): E[] {
		let bucket = this.buckets.get(type);
		if (!bucket) {
			bucket = this.collect(type);
			this.buckets.set(type, bucket);
		}
		return bucket;
	}

	private collect(type?: string): E[] {
		const entries: E[] = [];
		// Only a fixed number of groups are visited, never their cards/source definitions.
		for (const group of this.groups.values()) {
			entries.push(...(type === undefined ? group.all : group.byType.get(type) || []));
		}
		return entries;
	}
}