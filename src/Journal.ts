import type CardInGame from './classes/CardInGame.js';
import type Zone from './classes/Zone.js';
import type { State, StateShape } from './index.js';

type CardDataSnapshot = {
	flags: number;
	data: CardInGame['data'];
}

type TwisterState = {
	mt: number[];
	mti: number;
}

/**
 * Un-actions recorded by the State mutation API.
 * Each entry holds exactly what is needed to restore the state
 * to how it was right before the corresponding mutation.
 */
export type JournalEntry =
	| {
		kind: 'energy',
		card: CardInGame,
		previousEnergy: number,
		previousEnergyLostThisTurn: number,
	}
	| {
		kind: 'cardData',
		card: CardInGame,
		previous: CardDataSnapshot,
	}
	| {
		kind: 'moveCard',
		card: CardInGame,
		newCard: CardInGame,
		from: Zone,
		to: Zone,
		fromIndex: number,
	}
	| {
		kind: 'zoneCards',
		zone: Zone,
		previousCards: CardInGame[],
	}
	| {
		// Generic "restore object key" un-action (spell metadata, attachments)
		kind: 'key',
		target: Record<string, any>,
		key: string,
		had: boolean,
		previous: any,
	}
	| {
		kind: 'stateFields',
		previous: Partial<StateShape>,
	}
	| {
		kind: 'arrayPush',
		array: any[],
		count: number,
	}
	| {
		kind: 'arrayUnshift',
		array: any[],
		count: number,
	}
	| {
		kind: 'arrayShift',
		array: any[],
		item: any,
	}
	| {
		kind: 'winner',
		previous: boolean | number,
	}
	| {
		kind: 'turn',
		previous: number | null,
	}

export type JournalFrame = {
	index: number;
	depth: number;
	twister: TwisterState | null;
}

export const snapshotCardData = (card: CardInGame): CardDataSnapshot => ({
	flags: card.flags,
	data: {
		...card.data,
		actionsUsed: [...card.data.actionsUsed],
	},
});

export class Journal {
	private entries: JournalEntry[] = [];
	private frames: JournalFrame[] = [];

	get length(): number {
		return this.entries.length;
	}

	get hasFrames(): boolean {
		return this.frames.length > 0;
	}

	record(entry: JournalEntry): void {
		this.entries.push(entry);
	}

	beginFrame(twister: any): JournalFrame {
		const frame: JournalFrame = {
			index: this.entries.length,
			depth: this.frames.length,
			// Snapshot PRNG so die rolls, shuffles and seeded ids replay identically
			twister: (twister && Array.isArray(twister.mt)) ? { mt: [...twister.mt], mti: twister.mti } : null,
		};
		this.frames.push(frame);

		return frame;
	}

	/** Drops the frame (and frames nested in it) keeping the changes */
	endFrame(frame: JournalFrame): void {
		this.checkFrame(frame);
		this.frames.length = frame.depth;
		if (this.frames.length === 0) {
			this.entries = [];
		}
	}

	/** Undoes every mutation recorded since the frame was started. Nested frames are discarded too. */
	rollback(frame: JournalFrame, state: State): void {
		this.checkFrame(frame);

		while (this.entries.length > frame.index) {
			this.undo(this.entries.pop() as JournalEntry, state);
		}

		const twister = state.twister as any;
		if (frame.twister && twister) {
			twister.mt = [...frame.twister.mt];
			twister.mti = frame.twister.mti;
		}

		this.frames.length = frame.depth;
	}

	private checkFrame(frame: JournalFrame): void {
		if (this.frames[frame.depth] !== frame) {
			throw new Error('Search frame is not active (already rolled back or ended)');
		}
	}

	private undo(entry: JournalEntry, state: State): void {
		switch (entry.kind) {
			case 'energy': {
				entry.card.data.energy = entry.previousEnergy;
				entry.card.data.energyLostThisTurn = entry.previousEnergyLostThisTurn;
				break;
			}
			case 'cardData': {
				entry.card.flags = entry.previous.flags;
				Object.assign(entry.card.data, entry.previous.data);
				break;
			}
			case 'moveCard': {
				entry.to.removeById(entry.newCard.id);
				const cards = entry.from.cards;
				entry.from.cards = [...cards.slice(0, entry.fromIndex), entry.card, ...cards.slice(entry.fromIndex)];
				break;
			}
			case 'zoneCards': {
				entry.zone.cards = entry.previousCards;
				break;
			}
			case 'key': {
				if (entry.had) {
					entry.target[entry.key] = entry.previous;
				} else {
					delete entry.target[entry.key];
				}
				break;
			}
			case 'stateFields': {
				Object.assign(state.state, entry.previous);
				break;
			}
			case 'arrayPush': {
				entry.array.splice(entry.array.length - entry.count, entry.count);
				break;
			}
			case 'arrayUnshift': {
				entry.array.splice(0, entry.count);
				break;
			}
			case 'arrayShift': {
				entry.array.unshift(entry.item);
				break;
			}
			case 'winner': {
				state.winner = entry.previous;
				break;
			}
			case 'turn': {
				state.turn = entry.previous;
				break;
			}
		}
	}
}
