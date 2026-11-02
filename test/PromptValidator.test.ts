import { describe, expect, it } from 'vitest';
import { State, type PromptParamsType, type StateShape } from '../src/index.js';
import { byName } from '../src/cards.js';
import CardInGame from '../src/classes/CardInGame.js';
import Zone from '../src/classes/Zone.js';
import * as C from '../src/const.js';
import type { AnyEffectType, PromptType } from '../src/types/index.js';

const PLAYER = 10;
const OPPONENT = 12;
const card = (name: string, energy = 0, owner = PLAYER) => new CardInGame(byName(name)!, owner).addEnergy(energy);

function game(inPlay: CardInGame[] = [], magi: CardInGame[] = []) {
	const state = new State({ zones: [
		new Zone('In play', C.ZONE_TYPE_IN_PLAY).add(inPlay),
		new Zone('Our Magi', C.ZONE_TYPE_ACTIVE_MAGI, PLAYER).add(magi),
		new Zone('Their Magi', C.ZONE_TYPE_ACTIVE_MAGI, OPPONENT),
		new Zone('Hand', C.ZONE_TYPE_HAND, PLAYER),
	] } as StateShape);
	state.setPlayers(PLAYER, OPPONENT);
	return state;
}

function prompt(promptType: PromptType['promptType'], promptParams = {}): PromptType {
	return { type: C.ACTION_ENTER_PROMPT, promptType, promptParams, player: PLAYER } as PromptType;
}

describe('PromptValidator', () => {
	it('keeps a relic available when its power is paid for by a Magi', () => {
		const source = card('Water of Life');
		const state = game([source], [card('Yaki', 7)]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_RELIC)], true, 2)).toBe(true);
	});

	it('requires a creature even for an empty list of restrictions', () => {
		const source = card('Water of Life');
		const state = game([source]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, {})])).toBe(false);
	});

	it.each([false, true])('resolves restriction metadata (multiple: %s)', multiple => {
		const source = card('Yaki', 7);
		const state = game([card('Weebo', 2)], [source]);
		state.setSpellMetadata({ limit: 3 }, source.id);
		const params = multiple
			? { restrictions: [{ type: C.RESTRICTION_ENERGY_LESS_THAN, value: '$limit' }] }
			: { restriction: C.RESTRICTION_ENERGY_LESS_THAN, restrictionValue: '$limit' };
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, params)])).toBe(true);
	});

	it('resolves $player in multiple ownership restrictions before power metadata exists', () => {
		const source = card('Yaki', 7);
		const state = game([card('Weebo', 2)], [source]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, {
			restrictions: [{ type: C.RESTRICTION_OWN_CREATURE, value: '$player' }],
		})])).toBe(true);
	});

	it('uses the target of a leading property getter and keeps metadata unchanged', () => {
		const source = card('Weebo', 2);
		const state = game([source]);
		const actions: AnyEffectType[] = [{
			type: C.ACTION_GET_PROPERTY_VALUE, target: '$source', source: card('Arboll', 9),
			property: C.PROPERTY_ENERGY_COUNT, variable: 'limit',
		}, prompt(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, {
			restriction: C.RESTRICTION_ENERGY_LESS_THAN, restrictionValue: '$limit',
		})];
		expect(state.checkPrompts(source, actions)).toBe(false);
		expect(state.getSpellMetadata(source.id)).toEqual({});
	});

	it('allows relics when a zone prompt filters by relic type', () => {
		const source = card('Yaki', 7);
		const state = game([], [source]);
		state.getZone(C.ZONE_TYPE_HAND, PLAYER).add([card('Water of Life')]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, {
			zone: C.ZONE_TYPE_HAND, zoneOwner: PLAYER, numberOfCards: 1,
			restriction: C.RESTRICTION_TYPE, restrictionValue: C.TYPE_RELIC,
		})])).toBe(true);
	});

	it('resolves zone, owner and multiple restriction values from metadata', () => {
		const source = card('Yaki', 7);
		const state = game([], [source]);
		state.getZone(C.ZONE_TYPE_HAND, PLAYER).add([card('Weebo')]);
		state.setSpellMetadata({ zone: C.ZONE_TYPE_HAND, region: C.REGION_NAROOM }, source.id);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, {
			zone: '$zone', zoneOwner: '$player', numberOfCards: 1,
			restrictions: [{ type: C.RESTRICTION_REGION, value: '$region' }],
		})])).toBe(true);
	});

	it('allows a zero-card choice even when no card matches', () => {
		const source = card('Yaki', 7);
		const state = game([], [source]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, {
			zone: C.ZONE_TYPE_HAND, zoneOwner: PLAYER, numberOfCards: 0,
			restriction: C.RESTRICTION_TYPE, restrictionValue: C.TYPE_CREATURE,
		})])).toBe(true);
	});

	it('allows choosing fewer cards when the zone contains fewer than requested', () => {
		const source = card('Yaki', 7);
		const state = game([], [source]);
		state.getZone(C.ZONE_TYPE_HAND, PLAYER).add([card('Weebo')]);
		expect(state.checkPrompts(source, [prompt(C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, {
			zone: C.ZONE_TYPE_HAND, zoneOwner: PLAYER, numberOfCards: 2,
		})])).toBe(true);
	});

	it('allows an optional zone choice with no matching cards', () => {
		const source = card('Yaki', 7);
		expect(game().checkPrompts(source, [prompt(C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, {
			zone: C.ZONE_TYPE_HAND, zoneOwner: PLAYER, numberOfCards: 2,
			restriction: C.RESTRICTION_TYPE, restrictionValue: C.TYPE_CREATURE,
		})])).toBe(true);
	});

	it.each([[1, false], [3, false], [4, true], [5, true]])(
		'requires the Magi to afford a copied power plus two energy (energy: %i)', (energy, expected) => {
			const source = card('Mirror Pendant');
			const magi = card('Grega', energy as number);
			expect(game([source], [magi]).checkPrompts(source, [prompt(C.PROMPT_TYPE_POWER_ON_MAGI, { magi })], true, 0)).toBe(expected);
		},
	);

	it.each([C.PROMPT_TYPE_SINGLE_MAGI, C.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI] as const)(
		'rejects %s when there are no eligible targets', promptType => {
			const source = card('Water of Life');
			expect(game([source]).checkPrompts(source, [prompt(promptType)])).toBe(false);
		},
	);

	it('does not reject a filtered prompt whose value depends on an earlier choice', () => {
		const source = card('Yaki', 7);
		expect(game([card('Weebo', 2)], [source]).checkPrompts(source, [
			prompt(C.PROMPT_TYPE_SINGLE_CREATURE),
			prompt(C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, {
				restriction: C.RESTRICTION_ENERGY_LESS_THAN, restrictionValue: '$futureValue',
			}),
		])).toBe(true);
	});
});

describe('Prompt resolution validation', () => {
	const creature = card('Weebo', 2);
	const other = card('Arboll', 2, OPPONENT);
	const relic = card('Water of Life');
	const magi = card('Grega', 5);
	const choice = (target: CardInGame) => ({ target });
	const cases: [string, PromptType['promptType'], PromptParamsType, object][] = [
		['relic as a creature', C.PROMPT_TYPE_SINGLE_CREATURE, {}, choice(relic)],
		['creature as a Magi', C.PROMPT_TYPE_SINGLE_MAGI, {}, choice(creature)],
		['relic as a creature or Magi', C.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, {}, choice(relic)],
		['relic as an own creature', C.PROMPT_TYPE_OWN_SINGLE_CREATURE, {}, choice(relic)],
		['opponent creature as an own creature', C.PROMPT_TYPE_OWN_SINGLE_CREATURE, {}, choice(other)],
		['relic as another creature', C.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, { source: creature }, choice(relic)],
		['source as another creature', C.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, { source: creature }, choice(creature)],
		['creature as a relic', C.PROMPT_TYPE_RELIC, {}, choice(creature)],
		['unmatched filtered creature', C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED, { restrictions: [{ type: C.RESTRICTION_ENERGY_LESS_THAN, value: 2 }] }, choice(creature)],
		['Magi with a creature', C.PROMPT_TYPE_MAGI_WITHOUT_CREATURES, {}, choice(magi)],
		...[-1, 0, 4, 1.5, NaN, Infinity, '', '2abc'].map(value =>
			[`invalid number ${value}`, C.PROMPT_TYPE_NUMBER, { min: 1, max: 3 }, { number: value }] as typeof cases[number]),
		['missing number', C.PROMPT_TYPE_NUMBER, { min: 1, max: 3 }, {}],
		['duplicate zone cards', C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, { numberOfCards: 2, cards: [creature.serialize(), other.serialize()] }, { cards: [creature, creature] }],
		['foreign zone card', C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, { numberOfCards: 1, cards: [creature.serialize()] }, { cards: [other] }],
		['wrong rearranged cards', C.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, { cards: [creature.serialize()] }, { cards: [other] }],
		['wrong energy total', C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, { amount: 2 }, { energyOnCreatures: { [creature.id]: 1 } }],
		['negative distributed energy', C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, { amount: 2 }, { energyOnCreatures: { [creature.id]: -1, [other.id]: 3 } }],
		['unknown damage target', C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, { amount: 2 }, { damageOnCreatures: { missing: 2 } }],
		['fractional damage', C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, { amount: 2 }, { damageOnCreatures: { [creature.id]: 0.5, [other.id]: 1.5 } }],
		['opponent energy rearrangement', C.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, {}, { energyOnCreatures: { [other.id]: 2 } }],
		['unknown player', C.PROMPT_TYPE_PLAYER, {}, { targetPlayer: 99 }],
		['unknown alternative', C.PROMPT_TYPE_ALTERNATIVE, { alternatives: [{ name: 'Yes', value: 'yes' }] }, { alternative: 'no' }],
		['unavailable starting card', C.PROMPT_TYPE_CHOOSE_CARDS, { availableCards: ['Weebo'] }, { cards: ['Arboll'] }],
		['wrong payment source', C.PROMPT_TYPE_PAYMENT_SOURCE, { paymentType: C.TYPE_CREATURE, paymentAmount: 1, cards: [magi.serialize()] }, choice(other)],
		['wrong power source', C.PROMPT_TYPE_POWER_ON_MAGI, { magi: [] }, { source: magi, power: magi.card.data.powers![0] }],
	];
	it.each(cases)('keeps the prompt open for %s', (_, promptType, promptParams, response) => {
		const state = game([creature, other, relic], [magi]);
		state.setPrompt({ promptType, promptParams, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		state.setSavedActions([{ type: C.ACTION_CALCULATE, operator: C.CALCULATION_SET, operandOne: 1, variable: 'resumed', generatedBy: 'test' }]);
		expect(state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, ...response } as AnyEffectType)).toBe(false);
		expect(state.state.prompt).toBe(true);
		expect(state.state.savedActions).toHaveLength(1);
		expect(state.getSpellMetadata('test')).toEqual({});
	});

	it('accepts a valid numeric answer after an invalid one and resumes effects once', () => {
		const state = game();
		state.setPrompt({ promptType: C.PROMPT_TYPE_NUMBER, promptParams: { min: 1, max: 3 }, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		state.setSavedActions([{ type: C.ACTION_CALCULATE, operator: C.CALCULATION_SET, operandOne: 1, variable: 'resumed', generatedBy: 'test' }]);
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: '2abc' });
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: '2' });
		expect(state.state.prompt).toBe(false);
		expect(state.getSpellMetadata('test')).toEqual({ number: 2, resumed: 1 });
	});

	it.each([0, 1])('saves a valid payment under paymentSource (amount: %i)', paymentAmount => {
		const state = game([], [magi]);
		state.setPrompt({ promptType: C.PROMPT_TYPE_PAYMENT_SOURCE, promptParams: {
			paymentType: C.TYPE_CREATURE, paymentAmount, cards: [magi.serialize()],
		}, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, target: magi });
		expect(state.state.prompt).toBe(false);
		expect(state.getSpellMetadata('test').paymentSource).toBe(magi);
	});

	it('saves a card distribution under cardsInZones without falling through to another prompt', () => {
		const state = game([creature]);
		state.setPrompt({ promptType: C.PROMPT_TYPE_DISTRIBUTE_CARDS_IN_ZONES, promptParams: {
			cards: [creature.serialize()], targetZones: [C.ZONE_TYPE_HAND],
		}, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		const distribution = { [C.ZONE_TYPE_HAND]: [creature] };
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, cards: distribution } as unknown as AnyEffectType);
		expect(state.state.prompt).toBe(false);
		expect(state.getSpellMetadata('test')).toEqual({ cardsInZones: distribution });
	});

	it('stores the defined Magi power rather than effects supplied in the answer', () => {
		const state = game([], [magi]);
		const power = magi.card.data.powers![0];
		state.setPrompt({ promptType: C.PROMPT_TYPE_POWER_ON_MAGI, promptParams: { magi: [magi] }, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, source: magi, power: { ...power, effects: [] } });
		expect(state.state.prompt).toBe(false);
		expect(state.getSpellMetadata('test').chosenPower).toBe(power);
	});

	it('rolls back a rejected answer and a subsequent valid answer through Journal', () => {
		const state = game();
		state.setPrompt({ promptType: C.PROMPT_TYPE_NUMBER, promptParams: { min: 1, max: 3 }, promptPlayer: PLAYER, promptGeneratedBy: 'test' });
		state.setSavedActions([{ type: C.ACTION_CALCULATE, operator: C.CALCULATION_SET, operandOne: 1, variable: 'resumed', generatedBy: 'test' }]);
		const before = state.serializeFullState(PLAYER);
		const frame = state.beginSearchFrame();
		expect(state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: -1 })).toBe(false);
		state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: 2 });
		expect(state.state.prompt).toBe(false);
		state.rollback(frame);
		expect(state.serializeFullState(PLAYER)).toEqual(before);
		expect(state.state.prompt).toBe(true);
		expect(state.state.savedActions).toHaveLength(1);
	});

	it.each([C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE])(
		'resolves multiple restriction values when entering %s', promptType => {
			const state = game();
			state.getZone(C.ZONE_TYPE_HAND, PLAYER).add([creature, relic]);
			state.setSpellMetadata({ type: C.TYPE_CREATURE }, 'test');
			state.update({ type: C.ACTION_ENTER_PROMPT, promptType, generatedBy: 'test', player: PLAYER, promptParams: {
				zone: C.ZONE_TYPE_HAND, zoneOwner: PLAYER, numberOfCards: 1,
				restrictions: [{ type: C.RESTRICTION_TYPE, value: '$type' }],
			} } as AnyEffectType);
			expect(state.state.promptParams.cards?.map(card => card.id)).toEqual([creature.id]);
			state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, cards: [creature] });
			expect(state.state.prompt).toBe(false);
		},
	);

	it.each([C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES])(
		'preserves the ownership restriction when entering %s', promptType => {
			const state = game([creature, other]);
			state.update({ type: C.ACTION_ENTER_PROMPT, promptType, generatedBy: 'test', player: PLAYER, promptParams: {
				amount: 3, restriction: C.RESTRICTION_OWN_CREATURE, restrictionValue: PLAYER,
			} } as AnyEffectType);
			expect(state.state.promptParams.restrictions).toEqual([{ type: C.RESTRICTION_OWN_CREATURE, value: PLAYER }]);
			const field = promptType === C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES ? 'energyOnCreatures' : 'damageOnCreatures';
			expect(state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, [field]: { [other.id]: 3 } } as AnyEffectType)).toBe(false);
			state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, [field]: { [creature.id]: 3 } } as AnyEffectType);
			expect(state.state.prompt).toBe(false);
		},
	);
});
