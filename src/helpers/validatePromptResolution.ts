import type { State } from '../index.js';
import type { ResolvePromptType } from '../types/resolvePrompt.js';
import type { ZoneType } from '../types/index.js';
import type CardInGame from '../classes/CardInGame.js';
import * as C from '../const.js';

/** Validate before clearing a prompt or resuming its saved effects. */
export function validatePromptResolution(state: State, action: ResolvePromptType): boolean {
	const { promptType, promptParams: params, promptPlayer } = state.state;
	if (!state.state.prompt || !promptType) return false;
	const target = 'target' in action ? action.target : undefined;
	const creatures = state.getZone(C.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type === C.TYPE_CREATURE);
	const matches = (card: NonNullable<typeof target>) => state.makeCardFilter(params.restrictions || [])(card);
	const validCards = (cards: unknown[]) => {
		const ids = cards.map(card => typeof card === 'string' ? card : card && typeof card === 'object' && 'id' in card ? card.id : undefined);
		return new Set(ids).size === ids.length && ids.every(id => params.cards?.some(card => card.id === id));
	};
	const validDistribution = (distribution: Record<string, number>, rearrange = false) => {
		const eligible = creatures.filter(card => matches(card) && (!rearrange || state.modifyByStaticAbilities(card, C.PROPERTY_CONTROLLER) === promptPlayer));
		const entries = Object.entries(distribution);
		if (!entries.every(([id, value]) => Number.isSafeInteger(value) && value >= 0 && eligible.some(card => card.id === id))) return false;
		const total = entries.reduce((sum, [, value]) => sum + value, 0);
		if (!rearrange) return total === params.amount;
		return total === eligible.reduce((sum, card) => sum + card.data.energy, 0)
			&& eligible.every(card => (!card.card.data.energyStasis || (distribution[card.id] ?? card.data.energy) === card.data.energy)
				&& (card.id in distribution || card.data.energy === 0));
	};

	switch (promptType) {
		case C.PROMPT_TYPE_SINGLE_CREATURE:
			return target?.card.type === C.TYPE_CREATURE;
		case C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED:
			return target?.card.type === C.TYPE_CREATURE && matches(target);
		case C.PROMPT_TYPE_OWN_SINGLE_CREATURE:
			return target?.card.type === C.TYPE_CREATURE && state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER) === promptPlayer;
		case C.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
			return target?.card.type === C.TYPE_CREATURE && target.id !== params.source?.id;
		case C.PROMPT_TYPE_SINGLE_MAGI:
			return target?.card.type === C.TYPE_MAGI;
		case C.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
			return target?.card.type === C.TYPE_CREATURE || target?.card.type === C.TYPE_MAGI;
		case C.PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
			return target?.card.type === C.TYPE_MAGI && !creatures.some(card => state.modifyByStaticAbilities(card, C.PROPERTY_CONTROLLER) === state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER));
		case C.PROMPT_TYPE_RELIC:
			return target?.card.type === C.TYPE_RELIC;
		case C.PROMPT_TYPE_NUMBER: {
			if (!('number' in action) || action.number === undefined || (typeof action.number === 'string' && action.number.trim() === '')) return false;
			const number = Number(action.number);
			return Number.isSafeInteger(number) && number >= (params.min ?? -Infinity) && number <= (params.max ?? Infinity);
		}
		case C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE:
		case C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
			if (!('cards' in action) || !Array.isArray(action.cards)) return false;
			if (!action.cards.every((card): card is CardInGame => typeof card === 'object' && card !== null)) return false;
			const count = params.numberOfCards ?? 0;
			return (promptType === C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE ? action.cards.length === count : action.cards.length <= count)
				&& validCards(action.cards) && action.cards.every(matches);
		}
		case C.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE:
			return 'cards' in action && Array.isArray(action.cards) && action.cards.length === params.cards?.length && validCards(action.cards);
		case C.PROMPT_TYPE_DISTRIBUTE_CARDS_IN_ZONES: {
			if (!('cards' in action) || !action.cards || Array.isArray(action.cards)) return false;
			const cards = Object.values(action.cards).flat();
			return Object.keys(action.cards).every(zone => params.targetZones?.includes(zone as ZoneType))
				&& cards.length === params.cards?.length && validCards(cards);
		}
		case C.PROMPT_TYPE_CHOOSE_CARDS:
			return 'cards' in action && Array.isArray(action.cards)
				&& new Set<string | CardInGame>(action.cards).size === action.cards.length
				&& action.cards.every(card => params.availableCards?.includes(card as unknown as string));
		case C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES:
			return 'energyOnCreatures' in action && !!action.energyOnCreatures && validDistribution(action.energyOnCreatures);
		case C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES:
			return 'damageOnCreatures' in action && !!action.damageOnCreatures && validDistribution(action.damageOnCreatures);
		case C.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
			return 'energyOnCreatures' in action && !!action.energyOnCreatures && validDistribution(action.energyOnCreatures, true);
		case C.PROMPT_TYPE_PLAYER:
			return 'targetPlayer' in action && state.players.includes(action.targetPlayer);
		case C.PROMPT_TYPE_ALTERNATIVE:
			return 'alternative' in action && !!params.alternatives?.some(option => option.value === action.alternative);
		case C.PROMPT_TYPE_POWER_ON_MAGI: {
			if (!('source' in action) || !('power' in action)) return false;
			const magi = Array.isArray(params.magi) ? params.magi : params.magi ? [params.magi] : [];
			const source = state.getMetaValue(action.source, action.generatedBy);
			const power = state.getMetaValue(action.power, action.generatedBy);
			return !!source && source.card.type === C.TYPE_MAGI && magi.some(card => card.id === source.id)
				&& !!source.card.data.powers?.some((candidate: typeof power) => candidate.name === power?.name && candidate.cost === power.cost
					&& (candidate.cost === C.COST_X ? source.data.energy >= 3 : candidate.cost + 2 <= source.data.energy));
		}
		case C.PROMPT_TYPE_PAYMENT_SOURCE:
			return !!target && !!params.paymentType && !!params.cards?.some(card => card.id === target.id)
				&& state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER) === promptPlayer
				&& (target.card.type === C.TYPE_MAGI || (target.card.type === C.TYPE_CREATURE && !!target.card.data.paymentSource?.includes(params.paymentType)))
				&& target.data.energy >= (params.paymentAmount ?? 0);
		case C.PROMPT_TYPE_MAY_ABILITY:
			return typeof action.useEffect === 'boolean';
		default:
			return true;
	}
}
