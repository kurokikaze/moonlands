import { describe, expect, it, vi } from 'vitest';
import { State, type StateShape } from '../src/index.js';
import { byName } from '../src/cards.js';
import Card from '../src/classes/Card.js';
import CardInGame from '../src/classes/CardInGame.js';
import Zone from '../src/classes/Zone.js';
import { TriggerEffectRegistry } from '../src/TriggerEffectRegistry.js';
import { Unmaker } from '../src/unmaker/unmaker.js';
import type { AnyEffectType, ContinuousEffectType, TriggerEffectType } from '../src/types/index.js';
import type { EnhancedDelayedTriggerType } from '../src/types/effect.js';
import {
	ACTION_CALCULATE, ACTION_EFFECT, ACTION_ENTER_PROMPT, ACTION_PASS,
	CALCULATION_SET, EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
	EFFECT_TYPE_END_OF_TURN, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, EFFECT_TYPE_NONE,
	EFFECT_TYPE_CONDITIONAL,
	EFFECT_TYPE_START_OF_TURN, EFFECT_TYPE_START_TURN, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER,
	PROMPT_TYPE_SINGLE_CREATURE, REGION_NAROOM, TYPE_CREATURE, TYPE_MAGI,
	ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY,
} from '../src/const.js';

const none: AnyEffectType = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_NONE, generatedBy: 'none' };
const end: AnyEffectType = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_END_OF_TURN, player: 10, generatedBy: 'end' };

function trigger(name: string, effectType = EFFECT_TYPE_NONE as TriggerEffectType['find']['effectType']): TriggerEffectType {
	return { name, find: { effectType, conditions: [] }, effects: [] };
}

function card(name: string, triggers: TriggerEffectType[] = [], player = 10, magi = false): CardInGame {
	return new CardInGame(new Card(name, magi ? TYPE_MAGI : TYPE_CREATURE, REGION_NAROOM, 2, { triggerEffects: triggers }), player);
}

function continuous(id: string, triggers: TriggerEffectType[], self?: CardInGame): ContinuousEffectType {
	return { id, player: 10, expiration: { type: EXPIRATION_NEVER, turns: 0 }, triggerEffects: triggers, self };
}

function game(): State {
	const state = new State({
		zones: [new Zone('In play', ZONE_TYPE_IN_PLAY), new Zone('Magi', ZONE_TYPE_ACTIVE_MAGI, 10), new Zone('Magi', ZONE_TYPE_ACTIVE_MAGI, 12), new Zone('Hand', ZONE_TYPE_HAND, 10), new Zone('Discard', ZONE_TYPE_DISCARD, 10)],
		activePlayer: 10,
	} as StateShape);
	state.setPlayers(10, 12);
	return state;
}

describe('TriggerEffectRegistry', () => {
	it('runs source-independent conditional branches for the continuous owner', () => {
		const state = game();
		const definition = trigger('conditional');
		definition.effects = [{
			type: ACTION_EFFECT, effectType: EFFECT_TYPE_CONDITIONAL, generatedBy: 'template', conditions: [],
			thenEffects: [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 9, variable: 'value' }],
		}];
		// Keep templates in the effect namespace rather than overriding generatedBy.
		delete (definition.effects[0] as Partial<AnyEffectType>).generatedBy;
		state.state.continuousEffects.push(continuous('conditional', [definition]));
		state.update(none);
		expect(state.getSpellMetadata('conditional').value).toBe(9);
	});

	it('keeps continuous ownership in conditional branches after source control changes', () => {
		const state = game();
		const source = card('Source', [], 12);
		const definition = trigger('conditional');
		definition.effects = [{
			type: ACTION_EFFECT, effectType: EFFECT_TYPE_CONDITIONAL, generatedBy: 'template', conditions: [],
			thenEffects: [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 9, variable: 'value' }],
		}];
		delete (definition.effects[0] as Partial<AnyEffectType>).generatedBy;
		const seen: AnyEffectType[] = [];
		state.setOnAction(action => seen.push(action), true);
		state.state.continuousEffects.push(continuous('conditional', [definition], source));
		state.update(none);
		expect(seen.find(action => action.type === ACTION_CALCULATE)?.player).toBe(10);
	});

	it('restores continuous source metadata when reverting fired triggers', () => {
		const state = game();
		state.initiatePRNG(123);
		const source = card('Source');
		const unmaker = new Unmaker(state);
		unmaker.setCheckpoint();
		const create: AnyEffectType = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, source, player: 10, triggerEffects: [trigger('continuous')], expiration: { type: EXPIRATION_NEVER, turns: 0 }, generatedBy: 'create' };
		state.update(create);
		const id = state.state.continuousEffects[0].id;
		state.update(none);
		expect(state.getSpellMetadata(id).source).toBe(source);
		unmaker.revertToCheckpoint();
		expect(state.getSpellMetadata(id)).toEqual({});
		state.update({ ...create, source: undefined });
		expect(state.state.continuousEffects[0].id).toBe(id);
		state.update(none);
		expect(state.getSpellMetadata(id).source).toBeUndefined();
		state.state.continuousEffects[0].self = source;
		unmaker.setCheckpoint();
		state.update(none);
		expect(state.getSpellMetadata(id).source).toBe(source);
		unmaker.revertToCheckpoint();
		expect(state.getSpellMetadata(id).source).toBeUndefined();
	});

	it('indexes only matching effect types, preserving card, Magi, delayed and continuous order', () => {
		const first = card('First', [trigger('first'), trigger('other', EFFECT_TYPE_END_OF_TURN), trigger('second')]);
		const magi = card('Magi', [trigger('magi')], 10, true);
		const delayed: EnhancedDelayedTriggerType[] = [{ ...trigger('delayed'), name: 'delayed', self: first, id: 'delayed' }];
		const effects = [continuous('continuous', [trigger('continuous')])];
		const zones = [new Zone('Play', ZONE_TYPE_IN_PLAY).add([first]), new Zone('Magi', ZONE_TYPE_ACTIVE_MAGI, 10).add([magi])];
		const matchAction = vi.fn(() => true);
		const registry = new TriggerEffectRegistry({ getZones: () => zones, getPlayers: () => [10, 12], getDelayedTriggers: () => delayed, getContinuousEffects: () => effects, matchAction });
		expect([...registry.getMatchingTriggers(none)].map(entry => entry.trigger.name)).toEqual(['first', 'second', 'magi', 'delayed', 'continuous']);
		expect(matchAction).toHaveBeenCalledTimes(5);
		expect(registry.getCandidates({ type: ACTION_PASS, player: 10 })).toEqual([]);
		expect(registry.getCandidates(none)[0]).toBe(registry.getCandidates(none)[0]);
	});

	it('refreshes direct zone edits and observes player changes', () => {
		const state = game();
		const zone = state.getZone(ZONE_TYPE_IN_PLAY);
		const first = card('First', [trigger('first')]);
		const second = card('Second', [trigger('second')]);
		const registry = state.triggerEffectRegistry;
		expect(registry.getCandidates(none)).toEqual([]);
		zone.add([first, second]);
		state.refreshEffectRegistries();
		expect(registry.getCandidates(none).map(entry => entry.self)).toEqual([first, second]);
		zone.cards.reverse();
		state.refreshEffectRegistries();
		expect(registry.getCandidates(none).map(entry => entry.self)).toEqual([second, first]);
		zone.cards[0] = card('Replacement', [trigger('replacement')]);
		state.refreshEffectRegistries();
		expect(registry.getCandidates(none).map(entry => entry.trigger.name)).toEqual(['replacement', 'first']);
		zone.empty();
		state.state.zones = [new Zone('Other Magi', ZONE_TYPE_ACTIVE_MAGI, 20).add([card('Other', [trigger('other')], 20, true)])];
		state.setPlayers(20, 22);
		expect(registry.getCandidates(none).map(entry => entry.trigger.name)).toEqual(['other']);
	});

	it('refreshes externally edited trigger arrays and effect types explicitly', () => {
		const state = game();
		const definition = trigger('first');
		const source = card('Source', [definition]);
		state.getZone(ZONE_TYPE_IN_PLAY).add([source]);
		expect(state.triggerEffectRegistry.getCandidates(none)).toHaveLength(1);
		definition.find.effectType = EFFECT_TYPE_END_OF_TURN;
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(none)).toHaveLength(0);
		expect(state.triggerEffectRegistry.getCandidates(end)).toHaveLength(1);
		source.card.data.triggerEffects!.push(trigger('second'));
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(none)).toHaveLength(1);
	});

	it('matches lazily over a fixed candidate snapshot', () => {
		const definitions = [trigger('first'), trigger('second')];
		const source = card('Source', definitions);
		const zone = new Zone('Play', ZONE_TYPE_IN_PLAY).add([source]);
		let allowSecond = false;
		const registry = new TriggerEffectRegistry({
			getZones: () => [zone], getPlayers: () => [10, 12], getDelayedTriggers: () => [], getContinuousEffects: () => [],
			matchAction: (_action, find) => find === definitions[0].find || allowSecond,
		});
		const iterator = registry.getMatchingTriggers(none);
		expect(iterator.next().value.trigger.name).toBe('first');
		zone.empty();
		allowSecond = true;
		expect(iterator.next().value.trigger.name).toBe('second');
		expect(registry.getCandidates(none)).toEqual([]);
	});

	it('preserves trigger queue group reversal and consumes delayed triggers only', () => {
		const state = game();
		const first = trigger('first');
		first.effects = [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 1, variable: 'value' }];
		const second = { ...first, name: 'second', effects: [{ ...first.effects[0], operandOne: 2 }] } as TriggerEffectType;
		const source = card('Source', [first, second]);
		state.getZone(ZONE_TYPE_IN_PLAY).add([source]);
		state.state.delayedTriggers.push({ ...trigger('delayed'), name: 'delayed', id: 'shared-id', self: source });
		state.state.continuousEffects.push(continuous('shared-id', [trigger('continuous')]));
		state.triggerAbilities(none);
		expect(state.state.actions.filter(action => action.type === ACTION_CALCULATE).map(action => action.operandOne)).toEqual([2, 1]);
		expect(state.state.delayedTriggers).toEqual([]);
		expect(state.state.continuousEffects).toHaveLength(1);
		expect(state.triggerEffectRegistry.getCandidates(none).map(entry => entry.kind)).toEqual(['card', 'card', 'continuous']);
	});

	it('consumes a delayed trigger even when its prompt is impossible', () => {
		const state = game();
		state.state.delayedTriggers.push({ ...trigger('delayed'), name: 'delayed', self: card('Source'), id: 'delayed', effects: [{ type: ACTION_ENTER_PROMPT, promptType: PROMPT_TYPE_SINGLE_CREATURE }] });
		state.triggerAbilities(none);
		expect(state.state.delayedTriggers).toEqual([]);
		expect(state.state.actions).toEqual([]);
	});

	it('uses the destination incarnation on entry and removes it after departure', () => {
		const state = game();
		const source = card('Source', [trigger('source')]);
		state.getZone(ZONE_TYPE_HAND, 10).add([source]);
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, target: source, bottom: false, sourceZone: ZONE_TYPE_HAND, destinationZone: ZONE_TYPE_IN_PLAY, generatedBy: 'entry' });
		const inPlay = state.getZone(ZONE_TYPE_IN_PLAY).cards[0];
		expect(inPlay.id).not.toBe(source.id);
		expect(state.triggerEffectRegistry.getCandidates(none)[0].self).toBe(inPlay);
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, target: inPlay, bottom: false, sourceZone: ZONE_TYPE_IN_PLAY, destinationZone: ZONE_TYPE_DISCARD, generatedBy: 'departure' });
		expect(state.triggerEffectRegistry.getCandidates(none)).toEqual([]);
	});

	it('dispatches persistent continuous triggers without a source in the effect metadata namespace', () => {
		const state = game();
		const definition = trigger('continuous');
		definition.effects = [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 7, variable: 'value' }];
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, player: 10, expiration: { type: EXPIRATION_NEVER, turns: 0 }, triggerEffects: [definition], generatedBy: 'create' });
		const effect = state.state.continuousEffects[0];
		state.update(none);
		expect(state.getSpellMetadata(effect.id).value).toBe(7);
		expect(state.getSpellMetadata('create').value).toBeUndefined();
		state.update(none);
		expect(state.state.continuousEffects).toHaveLength(1);
		expect(state.state.delayedTriggers).toEqual([]);
	});

	it('captures source metadata and retains it after the source leaves play', () => {
		const state = game();
		const source = card('Source');
		state.getZone(ZONE_TYPE_IN_PLAY).add([source]);
		const definition = trigger('continuous');
		// Trigger templates support %-values at runtime; concrete effect types do not.
		definition.effects = [{ type: ACTION_EFFECT, effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, target: '%self', amount: 2 } as unknown as AnyEffectType];
		state.setSpellMetaDataField('source', source, 'create');
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, player: 10, expiration: { type: EXPIRATION_NEVER, turns: 0 }, triggerEffects: [definition], generatedBy: 'create' });
		state.getZone(ZONE_TYPE_IN_PLAY).empty();
		state.triggerAbilities(none);
		expect(state.state.actions[0]).toMatchObject({ target: source, triggerSource: source });
		expect(state.getSpellMetadata(state.state.continuousEffects[0].id).source).toBe(source);
		expect(state.state.continuousEffects[0].self).toBe(source);
	});

	it('expires continuous triggers before the subsequent start-of-turn action', () => {
		const state = game();
		state.getZone(ZONE_TYPE_ACTIVE_MAGI, 10).add([new CardInGame(byName('Yaki')!, 10)]);
		const definition = trigger('expired', EFFECT_TYPE_START_OF_TURN);
		definition.effects = [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 1, variable: 'value' }];
		state.state.continuousEffects.push({ ...continuous('expired', [definition]), expiration: { type: EXPIRATION_ANY_TURNS, turns: 1 } });
		expect(state.triggerEffectRegistry.getCandidates({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_START_OF_TURN, player: 10, generatedBy: 'turn' })).toHaveLength(1);
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_START_TURN, player: 10, generatedBy: 'turn' });
		expect(state.state.continuousEffects).toEqual([]);
		expect(state.getSpellMetadata('expired').value).toBeUndefined();
	});

	it('uses cloned cards rather than sharing registrations with the original', () => {
		const state = game();
		const source = new CardInGame(byName('Eebit')!, 10);
		const action = { type: ACTION_EFFECT, effectType: source.card.data.triggerEffects![0].find.effectType } as AnyEffectType;
		state.getZone(ZONE_TYPE_IN_PLAY).add([source]);
		state.state.continuousEffects.push(continuous('continuous', [trigger('continuous', source.card.data.triggerEffects![0].find.effectType)], source));
		state.triggerEffectRegistry.getCandidates(action);
		const cloned = state.clone();
		const entries = cloned.triggerEffectRegistry.getCandidates(action);
		expect(entries[0].self).not.toBe(source);
		expect(entries[0].self).toBe(cloned.getZone(ZONE_TYPE_IN_PLAY).cards[0]);
		expect(entries[1].self).toBe(entries[0].self);
		cloned.setZoneCards(cloned.getZone(ZONE_TYPE_IN_PLAY), []);
		expect(state.triggerEffectRegistry.getCandidates(action)).toHaveLength(2);
		expect(cloned.triggerEffectRegistry.getCandidates(action)).toHaveLength(1);
	});

	it('reconciles continuous creation and zone movement after checkpoint rollback', () => {
		const state = game();
		const source = card('Source', [trigger('source')]);
		state.getZone(ZONE_TYPE_IN_PLAY).add([source]);
		const unmaker = new Unmaker(state);
		unmaker.setCheckpoint();
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, player: 10, triggerEffects: [trigger('continuous')], expiration: { type: EXPIRATION_NEVER, turns: 0 }, generatedBy: 'create' });
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, target: source, bottom: false, sourceZone: ZONE_TYPE_IN_PLAY, destinationZone: ZONE_TYPE_DISCARD, generatedBy: 'move' });
		expect(state.triggerEffectRegistry.getCandidates(none).map(entry => entry.kind)).toEqual(['continuous']);
		unmaker.revertToCheckpoint();
		expect(state.triggerEffectRegistry.getCandidates(none).map(entry => entry.kind)).toEqual(['card']);
		expect(state.triggerEffectRegistry.getCandidates(none)[0].self).toBe(source);
	});
});