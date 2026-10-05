import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import { ACTION_EFFECT, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_IN_PLAY } from './const.js';
import type { AnyEffectType, ContinuousEffectType, FindType, TriggerEffectType } from './types/index.js';
import type { EnhancedDelayedTriggerType } from './types/effect.js';

export interface TriggerEffectRegistryContext {
	getZones(): Zone[];
	getPlayers(): number[];
	getDelayedTriggers(): EnhancedDelayedTriggerType[];
	getContinuousEffects(): ContinuousEffectType[];
	matchAction(action: AnyEffectType, find: FindType, self?: CardInGame): boolean;
}

export type RegisteredTriggerEffect = {
	kind: 'card' | 'delayed' | 'continuous';
	trigger: TriggerEffectType;
	self?: CardInGame;
	/** Identity of the owning delayed trigger or continuous effect, not its source. */
	id?: string;
	player: number;
};

type TriggerSource = {
	kind: RegisteredTriggerEffect['kind'];
	owner: CardInGame | EnhancedDelayedTriggerType | ContinuousEffectType;
	self?: CardInGame;
	id?: string;
	player: number;
	triggers: TriggerEffectType[];
};

/**
 * Derived state: never serialized or shared between State clones.
 * Reconcile source identities and definitions before lookup, because public zone
 * arrays and unmaker can mutate canonical state without going through handlers.
 * Unchanged sources reuse the index; only candidates of this effectType are matched.
 */
export class TriggerEffectRegistry {
	private sources: TriggerSource[] = [];
	private byEffectType = new Map<string, RegisteredTriggerEffect[]>();
	private indexedEffectTypes = new WeakMap<TriggerEffectType, FindType['effectType']>();

	constructor(private context: TriggerEffectRegistryContext) {}

	invalidate(): void {
		this.sources = [];
		this.byEffectType.clear();
	}

	synchronize(): void {
		const zones = this.context.getZones();
		const watchedZones = [
			zones.find(zone => zone.type === ZONE_TYPE_IN_PLAY && zone.player === null),
			...this.context.getPlayers().slice(0, 2).map(player =>
				zones.find(zone => zone.type === ZONE_TYPE_ACTIVE_MAGI && zone.player === player)),
		];
		const sources: TriggerSource[] = [];
		for (const zone of watchedZones) {
			for (const card of zone?.cards || []) {
				if (card.card.data.triggerEffects?.length) {
					sources.push({ kind: 'card', owner: card, self: card, player: card.data.controller, triggers: card.card.data.triggerEffects });
				}
			}
		}
		for (const trigger of this.context.getDelayedTriggers()) {
			sources.push({ kind: 'delayed', owner: trigger, self: trigger.self, id: trigger.id, player: trigger.self.data.controller, triggers: [trigger] });
		}
		for (const effect of this.context.getContinuousEffects()) {
			if (effect.triggerEffects?.length) {
				sources.push({ kind: 'continuous', owner: effect, self: effect.self, id: effect.id, player: effect.player, triggers: effect.triggerEffects });
			}
		}

		const unchanged = sources.length === this.sources.length && sources.every((source, index) => {
			const previous = this.sources[index];
			return source.kind === previous.kind && source.owner === previous.owner &&
				source.self === previous.self && source.id === previous.id && source.player === previous.player &&
				source.triggers.length === previous.triggers.length && source.triggers.every((trigger, ordinal) =>
					trigger === previous.triggers[ordinal] && trigger.find.effectType === this.indexedEffectTypes.get(trigger));
		});
		if (unchanged) return;

		this.byEffectType.clear();
		for (const source of sources) {
			for (const trigger of source.triggers) {
				this.indexedEffectTypes.set(trigger, trigger.find.effectType);
				const entry: RegisteredTriggerEffect = { kind: source.kind, trigger, self: source.self, id: source.id, player: source.player };
				const bucket = this.byEffectType.get(trigger.find.effectType);
				if (bucket) bucket.push(entry);
				else this.byEffectType.set(trigger.find.effectType, [entry]);
			}
		}
		this.sources = sources.map(source => ({ ...source, triggers: [...source.triggers] }));
	}

	getCandidates(action: AnyEffectType): RegisteredTriggerEffect[] {
		if (action.type !== ACTION_EFFECT) return [];
		this.synchronize();
		return [...(this.byEffectType.get(action.effectType) || [])];
	}

	/** Evaluate lazily, preserving metadata updates between successive matches. */
	*getMatchingTriggers(action: AnyEffectType): IterableIterator<RegisteredTriggerEffect> {
		for (const entry of this.getCandidates(action)) {
			if (this.context.matchAction(action, entry.trigger.find, entry.self)) yield entry;
		}
	}
}