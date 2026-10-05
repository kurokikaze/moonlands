import { describe, expect, it } from 'vitest';
import Card from '../src/classes/Card.js';
import CardInGame from '../src/classes/CardInGame.js';
import { applyStartTurnEffect } from '../src/actionMaps/effects/turnAndStep.js';
import { Unmaker } from '../src/unmaker/unmaker.js';
import type { AnyEffectType, TriggerEffectType } from '../src/types/index.js';
import {
	ACTION_CALCULATE, ACTION_EFFECT, ACTION_ENTER_PROMPT, CALCULATION_SET,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_NONE, EFFECT_TYPE_START_TURN, EXPIRATION_ANY_TURNS,
	EXPIRATION_NEVER, PROMPT_TYPE_SINGLE_CREATURE, PROPERTY_ENERGIZE,
	REGION_NAROOM, TYPE_CREATURE, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY,
} from '../src/const.js';
import { PLAYER, card, expectSameState, makeState, snapshot } from './journalUtils.js';

const action: AnyEffectType = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_NONE, generatedBy: 'event' };
const definition = (name: string): TriggerEffectType => ({ name, find: { effectType: EFFECT_TYPE_NONE, conditions: [] }, effects: [] });
const source = (name: string, trigger = definition(name)) =>
	new CardInGame(new Card(name, TYPE_CREATURE, REGION_NAROOM, 2, { triggerEffects: [trigger] }), PLAYER);

describe('TriggerEffectRegistry with Journal', () => {
	it('restores source identity and order through nested moves and bulk zone edits', () => {
		const first = source('First');
		const second = source('Second');
		const state = makeState({ hand: [first], inPlay: [second] });
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		const read = () => state.triggerEffectRegistry.getCandidates(action).map(entry => entry.self);
		expect(read()).toEqual([second]);
		const before = snapshot(state);
		const outer = state.beginSearchFrame();
		const moved = state.moveCard(first, state.getZone(ZONE_TYPE_HAND, PLAYER), play)!;
		expect(read()).toEqual([moved, second]);
		const inner = state.beginSearchFrame();
		state.setZoneCards(play, [second, moved]);
		expect(read()).toEqual([second, moved]);
		state.moveCard(moved, play, state.getZone(ZONE_TYPE_DISCARD, PLAYER));
		expect(read()).toEqual([second]);
		state.rollback(inner);
		expect(read()).toEqual([moved, second]);
		state.rollback(outer);
		expect(read()).toEqual([second]);
		expectSameState(state, before);
	});

	it.each([false, true])('restores consumed delayed triggers, including impossible prompts (%s)', impossible => {
		const state = makeState({});
		const delayed = { ...definition('Delayed'), name: 'Delayed', id: 'delayed', self: source('Source') };
		if (impossible) delayed.effects = [{ type: ACTION_ENTER_PROMPT, promptType: PROMPT_TYPE_SINGLE_CREATURE }];
		state.addDelayedTrigger(delayed);
		const before = snapshot(state);
		for (let replay = 0; replay < 2; replay++) {
			const frame = state.beginSearchFrame();
			state.update(action);
			expect(state.state.delayedTriggers).toEqual([]);
			expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
			state.rollback(frame);
			expect(state.state.delayedTriggers[0]).toBe(delayed);
			expect(state.triggerEffectRegistry.getCandidates(action)[0].trigger).toBe(delayed);
			expectSameState(state, before);
		}
	});

	it.each(['card', 'continuous'] as const)('rolls back optional %s triggers, prompt queues and metadata', kind => {
		const optional = { ...definition('Optional'), mayEffect: true };
		optional.effects = [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 3, variable: 'value' }];
		const triggerSource = source('Source', optional);
		const state = makeState({ inPlay: kind === 'card' ? [triggerSource] : [] });
		if (kind === 'continuous') state.addContinuousEffect({ id: 'continuous', player: PLAYER, self: triggerSource, triggerEffects: [optional], expiration: { type: EXPIRATION_NEVER, turns: 0 } });
		const before = snapshot(state);
		const frame = state.beginSearchFrame();
		state.update(action);
		expect(state.state.prompt).toBe(true);
		expect(state.state.mayEffectActions).not.toEqual([]);
		state.rollback(frame);
		expectSameState(state, before);
		expect(state.state.mayEffectActions).toEqual([]);
		expect(state.state.spellMetaData).toEqual({});
	});

	it('restores continuous creation, firing, expiration and property-based matching in nested frames', () => {
		const magi = card('Grega', PLAYER, 5);
		const state = makeState({ magi });
		state.initiatePRNG(321);
		const baseline = state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE);
		const conditional = definition('Conditional');
		conditional.find.conditions = [{ objectOne: 'self', propertyOne: PROPERTY_ENERGIZE, comparator: '>', objectTwo: baseline, propertyTwo: null }];
		conditional.effects = [{ type: ACTION_CALCULATE, operator: CALCULATION_SET, operandOne: 5, variable: 'value' }];
		const before = snapshot(state);
		expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
		const outer = state.beginSearchFrame();
		state.update({
			type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, player: PLAYER, source: magi,
			triggerEffects: [conditional], staticAbilities: card('Water of Life', PLAYER).card.data.staticAbilities,
			expiration: { type: EXPIRATION_ANY_TURNS, turns: 1 }, generatedBy: 'create',
		});
		const effect = state.state.continuousEffects[0];
		expect(effect.self).toBe(magi);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline + 1);
		expect([...state.triggerEffectRegistry.getMatchingTriggers(action)]).toHaveLength(1);
		state.update(action);
		expect(state.getSpellMetadata(effect.id).value).toBe(5);
		const beforeExpiration = snapshot(state);
		const inner = state.beginSearchFrame();
		applyStartTurnEffect.call(state, { type: ACTION_EFFECT, effectType: EFFECT_TYPE_START_TURN, player: PLAYER, generatedBy: 'turn' }, () => {}, state.state, state.nanoid);
		expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline);
		state.rollback(inner);
		expectSameState(state, beforeExpiration);
		expect(state.triggerEffectRegistry.getCandidates(action)[0].id).toBe(effect.id);
		expect([...state.triggerEffectRegistry.getMatchingTriggers(action)]).toHaveLength(1);
		state.rollback(outer);
		expectSameState(state, before);
		expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline);
		expect(state.getSpellMetadata(effect.id)).toEqual({});
		// Seeded effect IDs can be reused after rollback without inheriting source metadata.
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, player: PLAYER, triggerEffects: [definition('Source-less')], expiration: { type: EXPIRATION_NEVER, turns: 0 }, generatedBy: 'create' });
		expect(state.state.continuousEffects[0].id).toBe(effect.id);
		state.update(action);
		expect(state.getSpellMetadata(effect.id).source).toBeUndefined();
	});

	it('keeps committed inner changes reversible by the outer frame', () => {
		const state = makeState({});
		const outer = state.beginSearchFrame();
		const inner = state.beginSearchFrame();
		state.addContinuousEffect({ id: 'committed', player: PLAYER, triggerEffects: [definition('Committed')], expiration: { type: EXPIRATION_NEVER, turns: 0 } });
		state.endSearchFrame(inner);
		expect(state.triggerEffectRegistry.getCandidates(action)).toHaveLength(1);
		state.rollback(outer);
		expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
	});
});

describe('Registry compatibility with legacy Unmaker caches', () => {
	it('restores consumed delayed triggers at checkpoints', () => {
		const state = makeState({});
		const delayed = { ...definition('Delayed'), name: 'Delayed', id: 'delayed', self: source('Source') };
		state.addDelayedTrigger(delayed);
		const unmaker = new Unmaker(state);
		unmaker.setCheckpoint();
		state.update(action);
		expect(state.triggerEffectRegistry.getCandidates(action)).toEqual([]);
		unmaker.revertToCheckpoint();
		expect(state.triggerEffectRegistry.getCandidates(action)[0].trigger).toBe(delayed);
	});

	it('clears continuous static caches so restored trigger conditions see baseline properties', () => {
		const magi = card('Grega', PLAYER);
		const state = makeState({ magi });
		const baseline = state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE);
		const conditional = definition('Conditional');
		conditional.find.conditions = [{ objectOne: 'self', propertyOne: PROPERTY_ENERGIZE, comparator: '=', objectTwo: baseline, propertyTwo: null }];
		state.addDelayedTrigger({ ...conditional, name: 'Delayed', id: 'delayed', self: magi });
		const unmaker = new Unmaker(state);
		unmaker.setCheckpoint();
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, staticAbilities: card('Water of Life', PLAYER).card.data.staticAbilities, player: PLAYER, expiration: { type: EXPIRATION_NEVER, turns: 0 }, generatedBy: 'create' });
		expect([...state.triggerEffectRegistry.getMatchingTriggers(action)]).toHaveLength(0);
		unmaker.revertToCheckpoint();
		expect([...state.triggerEffectRegistry.getMatchingTriggers(action)]).toHaveLength(1);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline);
	});

	it('restores gathered static abilities after a source movement rollback', () => {
		const abilitySource = card('Water of Life', PLAYER);
		const magi = card('Grega', PLAYER);
		const state = makeState({ inPlay: [abilitySource], magi });
		const before = state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE);
		const unmaker = new Unmaker(state);
		unmaker.setCheckpoint();
		state.update({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, target: abilitySource, bottom: false, sourceZone: ZONE_TYPE_IN_PLAY, destinationZone: ZONE_TYPE_DISCARD, generatedBy: 'move' });
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(before - 1);
		unmaker.revertToCheckpoint();
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(before);
	});
});