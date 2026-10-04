import { describe, expect, it, vi } from 'vitest';
import Card from '../src/classes/Card';
import CardInGame from '../src/classes/CardInGame';
import {
	ACTION_EFFECT, EFFECT_TYPE_ENERGIZE, EFFECT_TYPE_NONE, REGION_UNIVERSAL, TYPE_RELIC,
	ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY,
} from '../src/const';
import { PLAYER, OPPONENT, card, makeState } from './journalUtils';

const sourceCard = (oncePerTurn = false) => new CardInGame(new Card('Test replacer', TYPE_RELIC, REGION_UNIVERSAL, 0, {
	replacementEffects: [{
		name: 'Replacement', text: 'Replace energizing', oncePerTurn,
		find: { effectType: EFFECT_TYPE_ENERGIZE, conditions: [] },
		replaceWith: { effectType: EFFECT_TYPE_NONE },
	}],
}), PLAYER);
const action = { type: ACTION_EFFECT, effectType: EFFECT_TYPE_ENERGIZE, player: PLAYER, generatedBy: 'test' } as const;

describe('Replacement effect cache', () => {
	it('gathers once while checking once-per-turn usage, rollback and current control on each lookup', () => {
		const source = sourceCard(true);
		const effects = source.card.data.replacementEffects;
		const readEffects = vi.fn(() => effects);
		Object.defineProperty(source.card.data, 'replacementEffects', { get: readEffects });
		const state = makeState({ inPlay: [source] });
		const frame = state.beginSearchFrame();
		expect(state.replaceByReplacementEffect(action)[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE, player: PLAYER });
		expect(state.replaceByReplacementEffect(action)).toEqual([action]);
		expect(readEffects).toHaveBeenCalledTimes(1);
		state.rollback(frame);
		source.data.controller = OPPONENT;
		expect(state.replaceByReplacementEffect(action)[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE, player: OPPONENT });
		state.clearActionsUsed(source);
		expect(state.replaceByReplacementEffect(action)[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE });
		expect(readEffects).toHaveBeenCalledTimes(1);
	});

	it.each([ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI])('invalidates moves and nested rollbacks in %s', zoneType => {
		const source = sourceCard();
		const state = makeState({ hand: [source] });
		const zone = state.getZone(zoneType, zoneType === ZONE_TYPE_IN_PLAY ? null : PLAYER);
		const read = () => state.replaceByReplacementEffect(action);
		expect(read()).toEqual([action]);
		const outer = state.beginSearchFrame();
		const moved = state.moveCard(source, state.getZone(ZONE_TYPE_HAND, PLAYER), zone)!;
		expect(read()[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE, replacedBy: [moved.id] });
		const inner = state.beginSearchFrame();
		state.moveCard(moved, zone, state.getZone(ZONE_TYPE_DISCARD, PLAYER));
		expect(read()).toEqual([action]);
		state.rollback(inner);
		expect(read()[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE, replacedBy: [moved.id] });
		state.rollback(outer);
		expect(read()).toEqual([action]);
	});

	it('preserves the cache across ordinary moves, failed moves and rollbacks', () => {
		const source = sourceCard();
		const ordinary = card('Arbolit', PLAYER);
		const state = makeState({ inPlay: [source], hand: [ordinary] });
		state.replaceByReplacementEffect(action);
		const invalidate = vi.spyOn(state, 'clearReplacementEffectsCache');
		const frame = state.beginSearchFrame();
		state.moveCard(ordinary, state.getZone(ZONE_TYPE_HAND, PLAYER), state.getZone(ZONE_TYPE_IN_PLAY));
		state.rollback(frame);
		state.moveCard(source, state.getZone(ZONE_TYPE_HAND, PLAYER), state.getZone(ZONE_TYPE_IN_PLAY));
		expect(state.replaceByReplacementEffect(action)[0]).toMatchObject({ effectType: EFFECT_TYPE_NONE });
		expect(invalidate).not.toHaveBeenCalled();
	});

	it('preserves source precedence through bulk reorder, removal and rollback', () => {
		const first = sourceCard();
		const last = sourceCard();
		const state = makeState({ inPlay: [first, last] });
		const zone = state.getZone(ZONE_TYPE_IN_PLAY);
		const read = () => state.replaceByReplacementEffect(action)[0];
		expect(read()).toMatchObject({ replacedBy: [last.id] });
		const frame = state.beginSearchFrame();
		state.setZoneCards(zone, [last, first]);
		expect(read()).toMatchObject({ replacedBy: [first.id] });
		state.setZoneCards(zone, []);
		expect(read()).toEqual(action);
		state.rollback(frame);
		expect(read()).toMatchObject({ replacedBy: [last.id] });
	});
});
