import { describe, expect, it, vi } from 'vitest';
import Card from '../src/classes/Card';
import CardInGame from '../src/classes/CardInGame';
import {
	PROPERTY_ENERGIZE, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE,
} from '../src/const';
import { PLAYER, OPPONENT, card, makeState } from './journalUtils';

describe('Card static ability cache', () => {
	it('reuses gathered abilities across modified data cache clears and reads current control', () => {
		const template = card('Water of Life', PLAYER).card;
		const definition = new Card(template.name, template.type, template.region, template.cost, template.data);
		const readAbilities = vi.fn(() => template.data.staticAbilities);
		Object.defineProperty(definition.data, 'staticAbilities', { get: readAbilities });
		const source = new CardInGame(definition, PLAYER);
		const magi = card('Grega', PLAYER);
		const opponentMagi = card('Sinder', OPPONENT);
		const state = makeState({ inPlay: [source], magi, opponentMagi });
		readAbilities.mockClear();
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(magi.card.data.energize! + 1);
		expect(readAbilities).toHaveBeenCalledTimes(1);
		state.clearModifiedCardDataCache();
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(magi.card.data.energize! + 1);
		expect(readAbilities).toHaveBeenCalledTimes(1);
		source.data.controller = OPPONENT;
		state.clearModifiedCardDataCache();
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(magi.card.data.energize);
		expect(state.modifyByStaticAbilities(opponentMagi, PROPERTY_ENERGIZE)).toBe(opponentMagi.card.data.energize! + 1);
		expect(readAbilities).toHaveBeenCalledTimes(1);
	});

	it.each([ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI])('invalidates entry, exit and nested rollbacks for %s', zoneType => {
		const source = card('Water of Life', PLAYER);
		const magi = card('Grega', OPPONENT);
		const state = makeState({ hand: [source], opponentMagi: magi });
		const zone = state.getZone(zoneType, zoneType === ZONE_TYPE_IN_PLAY ? null : PLAYER);
		// The source's owner is retained when it moves.
		const ownMagi = card('Sinder', PLAYER);
		if (zoneType === ZONE_TYPE_IN_PLAY) state.setZoneCards(state.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER), [ownMagi]);
		const target = zoneType === ZONE_TYPE_IN_PLAY ? ownMagi : magi;
		const read = () => state.modifyByStaticAbilities(target, PROPERTY_ENERGIZE);
		const baseline = read();
		const outer = state.beginSearchFrame();
		const moved = state.moveCard(source, state.getZone(ZONE_TYPE_HAND, PLAYER), zone)!;
		if (zoneType === ZONE_TYPE_ACTIVE_MAGI) moved.data.controller = OPPONENT;
		expect(read()).toBe(baseline + 1);
		const inner = state.beginSearchFrame();
		state.moveCard(moved, zone, state.getZone(ZONE_TYPE_DISCARD, PLAYER));
		expect(read()).toBe(baseline);
		state.rollback(inner);
		expect(read()).toBe(baseline + 1);
		state.rollback(outer);
		expect(read()).toBe(baseline);
	});

	it('keeps the gathered cache for unrelated moves and rollbacks', () => {
		const source = card('Water of Life', PLAYER);
		const ordinary = card('Arbolit', PLAYER);
		const magi = card('Grega', PLAYER);
		const state = makeState({ inPlay: [source], hand: [ordinary], magi });
		state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE);
		const invalidate = vi.spyOn(state.selectorEngine, 'clearStaticAbilitiesCache');
		const frame = state.beginSearchFrame();
		state.moveCard(ordinary, state.getZone(ZONE_TYPE_HAND, PLAYER), state.getZone(ZONE_TYPE_IN_PLAY));
		state.rollback(frame);
		state.moveCard(source, state.getZone(ZONE_TYPE_HAND, PLAYER), state.getZone(ZONE_TYPE_IN_PLAY)); // Failed move
		expect(invalidate).not.toHaveBeenCalled();
		state.setZoneCards(state.getZone(ZONE_TYPE_HAND, PLAYER), [card('Water of Life', PLAYER)]);
		const hiddenSource = state.getZone(ZONE_TYPE_HAND, PLAYER).cards[0];
		state.moveCard(hiddenSource, state.getZone(ZONE_TYPE_HAND, PLAYER), state.getZone(ZONE_TYPE_MAGI_PILE, PLAYER));
		expect(invalidate).not.toHaveBeenCalled();
	});

	it('invalidates bulk zone replacements and their rollbacks', () => {
		const magi = card('Grega', PLAYER);
		const state = makeState({ magi });
		const zone = state.getZone(ZONE_TYPE_IN_PLAY);
		const baseline = state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE);
		const frame = state.beginSearchFrame();
		state.setZoneCards(zone, [card('Water of Life', PLAYER)]);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline + 1);
		state.rollback(frame);
		expect(state.modifyByStaticAbilities(magi, PROPERTY_ENERGIZE)).toBe(baseline);
	});
});
