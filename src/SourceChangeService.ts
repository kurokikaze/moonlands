import type Zone from './classes/Zone.js';
import type CardInGame from './classes/CardInGame.js';
import type { ContinuousEffectType } from './types/index.js';
import type { EnhancedDelayedTriggerType } from './types/effect.js';

export type SourceChange =
	| { kind: 'zone'; zone: Zone; previous: CardInGame[]; current: CardInGame[] }
	| { kind: 'continuous'; previous: ContinuousEffectType[]; current: ContinuousEffectType[] }
	| { kind: 'delayed'; previous: EnhancedDelayedTriggerType[]; current: EnhancedDelayedTriggerType[] }
	| { kind: 'batch'; changes: SourceChange[] }
	| { kind: 'reset' };

/** Structural notifications are synchronous, post-mutation, and never gameplay actions. */
export class SourceChangeService {
	private listeners = new Set<(change: SourceChange) => void>();
	private players: number[] = [];
	private batchDepth = 0;
	private pending: SourceChange[] = [];
	private disposed = false;

	constructor(private getPlayers: () => number[]) {
		this.ensureCurrent();
	}

	subscribe(listener: (change: SourceChange) => void): () => void {
		if (this.disposed) throw new Error('Source subscriptions have been disposed');
		this.listeners.add(listener);
		return () => { this.listeners.delete(listener); };
	}

	dispose(): void {
		this.disposed = true;
		this.listeners.clear();
		this.pending = [];
	}

	/** Publish after the complete mutation/rollback, never between its two zone edits. */
	batch<T>(operation: () => T): T {
		this.batchDepth++;
		try { return operation(); }
		finally {
			if (--this.batchDepth === 0 && this.pending.length) {
				const changes = this.pending;
				this.pending = [];
				this.emit({ kind: 'batch', changes });
			}
		}
	}

	/** Player assignments are infrequent; this is an O(1) topology check, not a source scan. */
	ensureCurrent(): void {
		if (this.disposed) return;
		const players = this.getPlayers();
		if (players[0] !== this.players[0] || players[1] !== this.players[1]) {
			this.players = players.slice(0, 2);
			this.emit({ kind: 'reset' });
		}
	}

	/** Called only by explicit State mutation boundaries and non-recording Journal inverses. */
	emit(change: SourceChange): void {
		if (this.disposed) return;
		if (this.batchDepth) {
			this.pending.push('current' in change ? { ...change, previous: [...change.previous], current: [...change.current] } as SourceChange : change);
			return;
		}
		for (const listener of [...this.listeners]) listener(change);
	}

}