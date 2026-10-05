import type CardInGame from './classes/CardInGame.js';
import type Zone from './classes/Zone.js';
import { ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from './const.js';
import type { FindType, ReplacementEffectType } from './types/index.js';
import type { SourceChange } from './SourceChangeService.js';
import { SourceEffectIndex } from './SourceEffectIndex.js';

export type RegisteredReplacementEffect = ReplacementEffectType<FindType> & { self: CardInGame };

export interface ReplacementEffectRegistryContext {
	getZones(): Zone[];
	getPlayers(): number[];
	ensureSourcesCurrent(): void;
	subscribeSourceChanges(listener: (change: SourceChange) => void): () => void;
}

/** Conditions, controller and once-per-turn usage are intentionally not cached. */
export class ReplacementEffectRegistry {
	private initialized = false;
	private watchedZones: (Zone | undefined)[] = [];
	private unsubscribe: () => void;
	private index = new SourceEffectIndex<CardInGame, RegisteredReplacementEffect>(
		card => (card.card.data.replacementEffects || []).map(effect => ({ ...effect, self: card })),
		entry => entry.find.effectType,
	);

	constructor(private context: ReplacementEffectRegistryContext) {
		this.unsubscribe = context.subscribeSourceChanges(change => this.onSourceChange(change));
	}

	private onSourceChange(change: SourceChange): void {
		if (change.kind === 'batch') change.changes.forEach(item => this.onSourceChange(item));
		else if (change.kind === 'reset') this.invalidate();
		else if (change.kind === 'zone' && this.initialized) {
			const position = this.watchedZones.indexOf(change.zone);
			if (position !== -1) this.index.setGroup(`zone:${position}`, change.current);
		}
	}

	dispose(): void { this.unsubscribe(); this.invalidate(); }
	invalidate(): void { this.initialized = false; this.index.clear(); }

	getCandidates(): RegisteredReplacementEffect[] {
		this.context.ensureSourcesCurrent();
		if (!this.initialized) {
			const zones = this.context.getZones();
			this.watchedZones = [
				zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
				...this.context.getPlayers().slice(0, 2).map(player => zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
			];
			this.watchedZones.forEach((zone, index) => this.index.setGroup(`zone:${index}`, zone?.cards || []));
			this.initialized = true;
		}
		return this.index.getAll();
	}
}