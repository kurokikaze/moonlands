/* global expect, describe, it */
import {
	ACTION_ATTACK,
	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ZONE_TYPE_IN_PLAY,
} from '../src/const';
import { OPPONENT, PLAYER, card, expectSameState, makeState, resolveWithTarget, snapshot } from './journalUtils';

describe('Journal search frames', () => {
	it('does not keep a journal outside of search frames', () => {
		const state = makeState({ magi: card('Grega', PLAYER, 8), opponentMagi: card('Sinder', OPPONENT, 6) });
		expect(state.journal).toBeNull();

		const frame = state.beginSearchFrame();
		expect(state.journal).not.toBeNull();

		state.rollback(frame);
		expect(state.journal).toBeNull();
	});

	it('rolls back a power with a prompt (Arbolit Healing Flame)', () => {
		const arbolit = card('Arbolit', PLAYER, 5);
		const vellup = card('Vellup', PLAYER, 1);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({ inPlay: [arbolit, vellup], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		state.update({
			type: ACTION_POWER,
			source: arbolit,
			power: (arbolit.card.data.powers as any[]).find(p => p.name === 'Healing Flame'),
			player: PLAYER,
		} as any);
		resolveWithTarget(state, vellup);

		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});

	it('rolls back playing a card that attaches to a creature (Fog Bank), with nested frames', () => {
		const fogBank = card('Fog Bank', PLAYER);
		const vellup = card('Vellup', PLAYER, 3);
		const state = makeState({ inPlay: [vellup], hand: [fogBank], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const outer = state.beginSearchFrame();
		state.update({ type: ACTION_PLAY, payload: { card: fogBank, player: PLAYER }, player: PLAYER } as any);
		const beforeResolve = snapshot(state);

		const inner = state.beginSearchFrame();
		resolveWithTarget(state, vellup);
		expect(Object.keys(state.state.cardsAttached)).toHaveLength(1);

		state.rollback(inner);
		expectSameState(state, beforeResolve);

		state.rollback(outer);
		expectSameState(state, before);
		expect(state.state.cardsAttached).toEqual({});
	});

	it('rolls back an attack that discards a creature with an attached card', () => {
		const fogBank = card('Fog Bank', PLAYER);
		const vellup = card('Vellup', PLAYER, 3);
		const flameHyren = card('Flame Hyren', OPPONENT, 15);
		const state = makeState({ inPlay: [vellup, flameHyren], hand: [fogBank], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });

		state.update({ type: ACTION_PLAY, payload: { card: fogBank, player: PLAYER }, player: PLAYER } as any);
		resolveWithTarget(state, vellup);
		state.update({ type: ACTION_PASS, player: PLAYER } as any);
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		state.update({ type: ACTION_ATTACK, source: vellup, target: flameHyren, player: PLAYER } as any);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(vellup.id)).toBe(false);

		state.rollback(frame);
		expectSameState(state, before);
	});

	it('rolls back a whole turn change (passing through all steps)', () => {
		const deck = ['Arbolit', 'Lava Aq', 'Diobor', 'Fire Chogo'].map(name => card(name, PLAYER));
		const opponentDeck = ['Weebo', 'Arboll', 'Lovian', 'Orish'].map(name => card(name, OPPONENT));
		const attacker = card('Arbolit', PLAYER, 3);
		attacker.markAttackDone();
		attacker.setActionUsed('Healing Flame');
		const state = makeState({
			inPlay: [attacker, card('Weebo', OPPONENT, 2)],
			deck,
			opponentDeck,
			magi: card('Grega', PLAYER, 8),
			opponentMagi: card('Pruitt', OPPONENT, 8),
		});
		state.initiatePRNG(1234);
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		while (state.state.activePlayer === PLAYER) {
			state.update({ type: ACTION_PASS, player: PLAYER } as any);
		}
		const afterFirstRun = snapshot(state).json;
		expect(afterFirstRun).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);

		// PRNG is restored too, so replaying the branch gives the same result
		const replay = state.beginSearchFrame();
		while (state.state.activePlayer === PLAYER) {
			state.update({ type: ACTION_PASS, player: PLAYER } as any);
		}
		expect(snapshot(state).json).toBe(afterFirstRun);
		state.rollback(replay);
		expectSameState(state, before);
	});

	it('gives the same die roll after rollback (Grow)', () => {
		const grow = card('Grow', PLAYER);
		const state = makeState({ inPlay: [card('Furok', PLAYER, 3)], hand: [grow], magi: card('Poad', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		state.initiatePRNG(42);
		const before = snapshot(state);
		const play = () => state.update({ type: ACTION_PLAY, payload: { card: grow, player: PLAYER }, player: PLAYER } as any);
		const dieRoll = () => (state.state.log as any[]).find(entry => entry.type === 'log_entry/die_rolled')?.result;

		const first = state.beginSearchFrame();
		play();
		const firstRoll = dieRoll();
		expect(firstRoll).toBeDefined();
		state.rollback(first);
		expectSameState(state, before);

		const second = state.beginSearchFrame();
		play();
		expect(dieRoll()).toBe(firstRoll);
		state.rollback(second);
		expectSameState(state, before);
	});

	it('stays stable across repeated branches (Lava Aq Firestorm)', () => {
		const lavaAq = card('Lava Aq', PLAYER, 6);
		const arbolit = card('Arbolit', PLAYER, 2);
		const state = makeState({
			inPlay: [lavaAq, arbolit, card('Weebo', OPPONENT, 2), card('Arboll', OPPONENT, 2)],
			magi: card('Grega', PLAYER, 8),
			opponentMagi: card('Pruitt', OPPONENT, 8),
		});
		const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
		const before = snapshot(state);

		for (let i = 0; i < 10; i++) {
			const frame = state.beginSearchFrame();
			state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);
			resolveWithTarget(state, arbolit);
			expect(snapshot(state).json).not.toBe(before.json);
			state.rollback(frame);

			expectSameState(state, before);
			expect(state.journal).toBeNull();
		}
	});

	it('keeps changes with endSearchFrame and rolls them back with the outer frame', () => {
		const arbolit = card('Arbolit', PLAYER, 5);
		const vellup = card('Vellup', PLAYER, 1);
		const state = makeState({ inPlay: [arbolit, vellup], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const outer = state.beginSearchFrame();
		const inner = state.beginSearchFrame();
		state.update({
			type: ACTION_POWER,
			source: arbolit,
			power: (arbolit.card.data.powers as any[]).find(p => p.name === 'Healing Flame'),
			player: PLAYER,
		} as any);
		state.endSearchFrame(inner);
		const afterInner = snapshot(state).json;
		expect(afterInner).not.toBe(before.json);

		expect(() => state.rollback(inner)).toThrow();

		state.rollback(outer);
		expectSameState(state, before);
		expect(() => state.rollback(outer)).toThrow();
	});
});

describe('Journal preserves key order of restored records', () => {
	const setup = () => {
		const first = card('Vellup', PLAYER, 3);
		const second = card('Vellup', PLAYER, 3);
		const firstBank = card('Fog Bank', PLAYER);
		const secondBank = card('Fog Bank', PLAYER);
		const state = makeState({
			inPlay: [first, firstBank, second, secondBank, card('Flame Hyren', OPPONENT, 15)],
			magi: card('Ora', PLAYER, 12),
			opponentMagi: card('Sinder', OPPONENT, 8),
		});
		state.attachCard(firstBank.id, first.id);
		state.attachCard(secondBank.id, second.id);
		return { state, first, second, firstBank, secondBank };
	};

	it('restores attachments in their original order after removeAttachments', () => {
		const { state, first } = setup();
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		state.removeAttachments(first.id);
		state.rollback(frame);

		expect(Object.keys(state.state.cardsAttached)).toEqual(Object.keys(JSON.parse(before.json).full.cardsAttached));
		expectSameState(state, before);
		expect(JSON.stringify(state.state.attachedTo)).toBe(JSON.stringify(JSON.parse(before.json).attachedTo));
	});

	it('restores attachments in their original order after detachCard', () => {
		const { state, firstBank } = setup();
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		state.detachCard(firstBank.id);
		state.rollback(frame);

		expectSameState(state, before);
	});

	it('restores attachments in their original order after the attached creature is discarded in an attack', () => {
		const { state, first } = setup();
		const flameHyren = state.getZone(ZONE_TYPE_IN_PLAY).cards.find(c => c.card.name === 'Flame Hyren')!;
		state.update({ type: ACTION_PASS, player: PLAYER } as any);
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		state.update({ type: ACTION_ATTACK, source: first, target: flameHyren, player: PLAYER } as any);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(first.id)).toBe(false);
		state.rollback(frame);

		expectSameState(state, before);
	});

	it('restores spell metadata in its original order after clearSpellMetaDataField', () => {
		const { state } = setup();
		state.setSpellMetaDataField('a', 1, 'spellOne');
		state.setSpellMetaDataField('b', 2, 'spellOne');
		state.setSpellMetaDataField('c', 3, 'spellTwo');
		const before = JSON.stringify(state.state.spellMetaData);

		const frame = state.beginSearchFrame();
		state.clearSpellMetaDataField('a', 'spellOne');
		state.clearSpellMetaDataField('c', 'spellTwo');
		state.rollback(frame);

		expect(JSON.stringify(state.state.spellMetaData)).toBe(before);
	});
});
