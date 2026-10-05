import { describe, expect, it, vi } from 'vitest';
import Card from '../src/classes/Card.js';
import CardInGame from '../src/classes/CardInGame.js';
import Zone from '../src/classes/Zone.js';
import type { SourceChange } from '../src/SourceChangeService.js';
import { SourceEffectIndex } from '../src/SourceEffectIndex.js';
import type { AnyEffectType, ContinuousEffectType, TriggerEffectType } from '../src/types/index.js';
import {
	ACTION_EFFECT, EFFECT_TYPE_NONE, EFFECT_TYPE_ENERGIZE, EXPIRATION_ANY_TURNS,
	REGION_UNIVERSAL, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_DECK,
} from '../src/const.js';
import { PLAYER, card, makeState } from './journalUtils.js';

const event: AnyEffectType = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_NONE, generatedBy: 'event' };
const trigger = (name: string): TriggerEffectType => ({ name, find: { effectType: EFFECT_TYPE_NONE, conditions: [] }, effects: [] });
function abilityCard(name: string): CardInGame {
	return new CardInGame(new Card(name, TYPE_RELIC, REGION_UNIVERSAL, 0, {
		triggerEffects: [trigger(name)],
		replacementEffects: [{ name, find: { effectType: EFFECT_TYPE_ENERGIZE, conditions: [] }, replaceWith: { type: ACTION_EFFECT, effectType: EFFECT_TYPE_NONE } }],
	}), PLAYER);
}
const effect = (id: string): ContinuousEffectType => ({ id, player: PLAYER, triggerEffects: [trigger(id)], expiration: { type: EXPIRATION_ANY_TURNS, turns: 2 } });

describe('Structural source subscriptions', () => {
	it('looks up type buckets without visiting sources or invalidating unrelated types', () => {
		const create = vi.fn((source: { type: string }) => [{ source, type: source.type }]);
		const getType = vi.fn((entry: { type: string }) => entry.type);
		const index = new SourceEffectIndex(create, getType);
		const first = { type: 'first' };
		index.setGroup('play', [first]);
		const firstBucket = index.getByEffectType('first');
		create.mockClear();
		getType.mockClear();
		index.getByEffectType('unknown');
		index.getAll();
		expect(create).not.toHaveBeenCalled();
		expect(getType).not.toHaveBeenCalled();
		index.setGroup('play', [first, { type: 'second' }]);
		expect(create).toHaveBeenCalledTimes(1);
		expect(index.getByEffectType('first')).toBe(firstBucket);
	});

	it('leaves arrays ordinary and requires refresh after direct setup edits', () => {
		const first = abilityCard('First');
		const second = abilityCard('Second');
		const input = [first];
		const state = makeState({});
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		play.cards = input;
		state.triggerEffectRegistry.getCandidates(event);
		input[0] = second;
		expect(play.cards).toBe(input);
		expect(play.cards[0]).toBe(second);
		expect(state.triggerEffectRegistry.getCandidates(event)[0].self).toBe(first);
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)[0].self).toBe(second);
		const other: CardInGame[] = [];
		play.cards.push.call(other, first);
		expect(other).toEqual([first]);
		expect(play.cards).toEqual([second]);
		Object.defineProperty(play.cards, '0', { value: first });
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)[0].self).toBe(first);
		Object.defineProperty(play.cards, 'length', { value: 0 });
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)).toEqual([]);
	});

	it('releases listeners on disposal', () => {
		const state = makeState({});
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		const listener = vi.fn();
		state.subscribeSourceChanges(listener);
		state.dispose();
		play.add([abilityCard('Later')]);
		expect(listener).not.toHaveBeenCalled();
		expect(() => state.subscribeSourceChanges(listener)).toThrow('disposed');
		state.dispose(); // Idempotent teardown.
	});

	it('publishes one completed movement batch, no failed movement, and supports unsubscribe', () => {
		const source = abilityCard('Source');
		const state = makeState({ hand: [source] });
		const hand = state.getZone(ZONE_TYPE_HAND, PLAYER);
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		const changes: SourceChange[] = [];
		const unsubscribe = state.subscribeSourceChanges(change => {
			changes.push(change);
			expect(hand.containsId(source.id)).toBe(false);
			expect(play.cards).toHaveLength(1);
		});
		const moved = state.moveCard(source, hand, play)!;
		expect(changes).toHaveLength(1);
		expect(changes[0]).toMatchObject({ kind: 'batch', changes: [{ kind: 'zone', zone: play }] });
		expect(state.moveCard(source, hand, play)).toBeNull();
		expect(changes).toHaveLength(1);
		unsubscribe();
		state.moveCard(moved, play, state.getZone(ZONE_TYPE_DISCARD, PLAYER));
		expect(changes).toHaveLength(1);
	});

	it('publishes continuous creation/removal and delayed creation/consumption', () => {
		const state = makeState({});
		const listener = vi.fn();
		state.subscribeSourceChanges(listener);
		const continuous = effect('continuous');
		state.addContinuousEffect(continuous);
		expect(listener).toHaveBeenLastCalledWith({ kind: 'continuous', previous: [], current: [continuous] });
		state.setContinuousEffects([]);
		expect(listener).toHaveBeenLastCalledWith({ kind: 'continuous', previous: [continuous], current: [] });
		const delayed = { ...trigger('Delayed'), name: 'Delayed', self: abilityCard('Source'), id: 'delayed' };
		state.addDelayedTrigger(delayed);
		expect(listener).toHaveBeenLastCalledWith({ kind: 'delayed', previous: [], current: [delayed] });
		state.removeDelayedTrigger(delayed.id);
		expect(listener).toHaveBeenLastCalledWith({ kind: 'delayed', previous: [delayed], current: [] });
	});

	it('keeps unrelated source chunks and definition reads stable across lookups and edits', () => {
		const first = abilityCard('First');
		const second = abilityCard('Second');
		const state = makeState({ inPlay: [first] });
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		const triggerDefinitions = first.card.data.triggerEffects;
		const replacementDefinitions = first.card.data.replacementEffects;
		const firstTriggers = vi.fn(() => triggerDefinitions);
		const firstReplacements = vi.fn(() => replacementDefinitions);
		Object.defineProperty(first.card.data, 'triggerEffects', { get: firstTriggers });
		Object.defineProperty(first.card.data, 'replacementEffects', { get: firstReplacements });
		const firstEntry = state.triggerEffectRegistry.getCandidates(event)[0];
		const firstReplacement = state.replacementEffectRegistry.getCandidates()[0];
		const initialReplacements = state.replacementEffectRegistry.getCandidates();
		const synchronize = vi.spyOn(state.triggerEffectRegistry, 'synchronize');
		for (let i = 0; i < 20; i++) {
			state.triggerEffectRegistry.getCandidates(event);
			state.replacementEffectRegistry.getCandidates();
		}
		const ordinary = card('Arbolit', PLAYER);
		state.setZoneCards(play, [...play.cards, ordinary]);
		expect(state.replacementEffectRegistry.getCandidates()).toBe(initialReplacements);
		state.setZoneCards(play, play.cards.filter(card => card !== ordinary));
		state.setZoneCards(play, [...play.cards, second]);
		expect(state.triggerEffectRegistry.getCandidates(event)[0]).toBe(firstEntry);
		expect(state.replacementEffectRegistry.getCandidates()[0]).toBe(firstReplacement);
		state.setZoneCards(play, [...play.cards].reverse());
		expect(state.triggerEffectRegistry.getCandidates(event)[1]).toBe(firstEntry);
		expect(state.replacementEffectRegistry.getCandidates()[1]).toBe(firstReplacement);
		state.setZoneCards(play, play.cards.filter(card => card !== second));
		expect(firstTriggers).toHaveBeenCalledTimes(1);
		expect(firstReplacements).toHaveBeenCalledTimes(1);
		expect(synchronize).not.toHaveBeenCalled();
	});

	it.each(['reverse', 'splice', 'assignment'] as const)('refreshes both registries after direct array %s', operation => {
		const first = abilityCard('First');
		const second = abilityCard('Second');
		const state = makeState({ inPlay: [first, second] });
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		state.triggerEffectRegistry.getCandidates(event);
		state.replacementEffectRegistry.getCandidates();
		if (operation === 'reverse') play.cards.reverse();
		else if (operation === 'splice') play.cards.splice(0, 2, second, first);
		else play.cards = [second, first];
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event).map(entry => entry.self)).toEqual([second, first]);
		expect(state.replacementEffectRegistry.getCandidates().map(entry => entry.self)).toEqual([second, first]);
		play.empty();
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)).toEqual([]);
		expect(state.replacementEffectRegistry.getCandidates()).toEqual([]);
	});

	it('handles same-zone moves and active Magi precedence without observing deck shuffles', () => {
		const first = abilityCard('First');
		const second = abilityCard('Second');
		const magi = abilityCard('Magi');
		const state = makeState({ inPlay: [first, second], magi });
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		state.triggerEffectRegistry.getCandidates(event);
		state.replacementEffectRegistry.getCandidates();
		const moved = state.moveCard(first, play, play, true)!;
		const read = () => state.triggerEffectRegistry.getCandidates(event).map(entry => entry.self);
		expect(read()).toEqual([second, moved, magi]);
		expect(state.replacementEffectRegistry.getCandidates().map(entry => entry.self)).toEqual([second, moved, magi]);
		state.initiatePRNG(12);
		const deck = state.getZone(ZONE_TYPE_DECK, PLAYER);
		deck.add([card('Arbolit', PLAYER), card('Eebit', PLAYER)]);
		deck.setPRNG(state.twister!);
		const listener = vi.fn();
		state.subscribeSourceChanges(listener);
		const frame = state.beginSearchFrame();
		state.shuffleZone(deck);
		state.rollback(frame);
		expect(listener).not.toHaveBeenCalled();
		expect(read()).toEqual([second, moved, magi]);
	});

	it('rejects active-zone shuffles before recording or changing source order', () => {
		const first = abilityCard('First');
		const second = abilityCard('Second');
		const state = makeState({ inPlay: [first, second] });
		const frame = state.beginSearchFrame();
		const length = state.journal!.length;
		expect(() => state.shuffleZone(state.getZone(ZONE_TYPE_IN_PLAY))).toThrow('cannot be shuffled');
		expect(() => state.shuffleZone(state.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER))).toThrow('cannot be shuffled');
		expect(state.journal!.length).toBe(length);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).cards).toEqual([first, second]);
		state.rollback(frame);
	});

	it('snapshots bulk-zone undo even when a subsequent bottom move mutates the old array', () => {
		const source = abilityCard('Source');
		const state = makeState({ hand: [source] });
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		const hand = state.getZone(ZONE_TYPE_HAND, PLAYER);
		const frame = state.beginSearchFrame();
		state.setZoneCards(play, play.cards);
		state.moveCard(source, hand, play, true);
		expect(state.triggerEffectRegistry.getCandidates(event)).toHaveLength(1);
		state.rollback(frame);
		expect(play.cards).toEqual([]);
		expect(hand.cards).toEqual([source]);
		expect(state.triggerEffectRegistry.getCandidates(event)).toEqual([]);
		expect(state.replacementEffectRegistry.getCandidates()).toEqual([]);
	});

	it('notifies inverse changes once per rollback without recording new undo entries', () => {
		const source = abilityCard('Source');
		const state = makeState({ hand: [source] });
		const outer = state.beginSearchFrame();
		state.addContinuousEffect(effect('outer'));
		const outerLength = state.journal!.length;
		const inner = state.beginSearchFrame();
		const play = state.getZone(ZONE_TYPE_IN_PLAY);
		state.moveCard(source, state.getZone(ZONE_TYPE_HAND, PLAYER), play);
		state.setContinuousEffects([]);
		state.triggerEffectRegistry.getCandidates(event);
		state.replacementEffectRegistry.getCandidates();
		const listener = vi.fn();
		state.subscribeSourceChanges(listener);
		state.rollback(inner);
		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener.mock.calls[0][0].kind).toBe('batch');
		expect(state.journal!.length).toBe(outerLength);
		expect(state.triggerEffectRegistry.getCandidates(event).map(entry => entry.id)).toEqual(['outer']);
		expect(state.replacementEffectRegistry.getCandidates()).toEqual([]);
		state.rollback(outer);
		expect(state.triggerEffectRegistry.getCandidates(event)).toEqual([]);
		expect(state.journal).toBeNull();
	});

	it('ignores detached arrays and zones, and binds replacement topology to the current zones', () => {
		const source = abilityCard('Source');
		const state = makeState({ inPlay: [source] });
		const oldZone = state.getZone(ZONE_TYPE_IN_PLAY);
		const oldCards = oldZone.cards;
		state.triggerEffectRegistry.getCandidates(event);
		state.replacementEffectRegistry.getCandidates();
		oldZone.cards = [];
		oldCards.push(abilityCard('Detached'));
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)).toEqual([]);
		const replacement = abilityCard('Replacement');
		state.state.zones = [new Zone('New play', ZONE_TYPE_IN_PLAY).add([replacement]), new Zone('New Magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER)];
		state.refreshEffectRegistries();
		expect(state.getZone(ZONE_TYPE_IN_PLAY)).not.toBe(oldZone);
		oldZone.add([source]);
		expect(state.triggerEffectRegistry.getCandidates(event).map(entry => entry.self)).toEqual([replacement]);
		expect(state.replacementEffectRegistry.getCandidates().map(entry => entry.self)).toEqual([replacement]);
	});

	it('refreshes edited ability definitions only at the explicit boundary', () => {
		const source = abilityCard('Source');
		const state = makeState({ inPlay: [source] });
		state.triggerEffectRegistry.getCandidates(event);
		state.replacementEffectRegistry.getCandidates();
		source.card.data.triggerEffects!.push(trigger('Added'));
		source.card.data.replacementEffects!.push({ name: 'Added', find: { effectType: EFFECT_TYPE_ENERGIZE, conditions: [] }, replaceWith: { type: ACTION_EFFECT, effectType: EFFECT_TYPE_NONE } });
		state.refreshEffectRegistries();
		expect(state.triggerEffectRegistry.getCandidates(event)).toHaveLength(2);
		expect(state.replacementEffectRegistry.getCandidates()).toHaveLength(2);
	});

	it('does not notify energy-only changes or leak subscriptions into clones', () => {
		const source = card('Eebit', PLAYER, 2);
		const state = makeState({ inPlay: [source] });
		const listener = vi.fn();
		state.subscribeSourceChanges(listener);
		const frame = state.beginSearchFrame();
		state.changeEnergy(source, 1);
		state.rollback(frame);
		expect(listener).not.toHaveBeenCalled();
		const clone = state.clone();
		clone.getZone(ZONE_TYPE_IN_PLAY).empty();
		expect(listener).not.toHaveBeenCalled();
		expect(state.getZone(ZONE_TYPE_IN_PLAY).cards[0]).toBe(source);
	});
});