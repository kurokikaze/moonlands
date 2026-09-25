/* global expect, describe, it */
import { State } from '../src/index';
import { byName } from '../src/cards';
import Card from '../src/classes/Card';
import CardInGame from '../src/classes/CardInGame';
import Zone from '../src/classes/Zone';
import {
	ACTION_ATTACK,
	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_MAGI_PILE,
} from '../src/const';

const PLAYER = 1;
const OPPONENT = 2;
const STEP_PRS1 = 1;

const card = (name: string, owner: number, energy = 0) => new CardInGame(byName(name) as Card, owner).addEnergy(energy);

type Setup = {
	step?: number,
	inPlay?: CardInGame[],
	hand?: CardInGame[],
	deck?: CardInGame[],
	opponentDeck?: CardInGame[],
	magi?: CardInGame,
	opponentMagi?: CardInGame,
}

function makeState({ step = STEP_PRS1, inPlay = [], hand = [], deck = [], opponentDeck = [], magi, opponentMagi }: Setup): State {
	const zones = [
		new Zone('P1 hand', ZONE_TYPE_HAND, PLAYER).add(hand),
		new Zone('P2 hand', ZONE_TYPE_HAND, OPPONENT),
		new Zone('P1 deck', ZONE_TYPE_DECK, PLAYER).add(deck),
		new Zone('P2 deck', ZONE_TYPE_DECK, OPPONENT).add(opponentDeck),
		new Zone('P1 discard', ZONE_TYPE_DISCARD, PLAYER),
		new Zone('P2 discard', ZONE_TYPE_DISCARD, OPPONENT),
		new Zone('P1 magi', ZONE_TYPE_ACTIVE_MAGI, PLAYER).add(magi ? [magi] : []),
		new Zone('P2 magi', ZONE_TYPE_ACTIVE_MAGI, OPPONENT).add(opponentMagi ? [opponentMagi] : []),
		new Zone('P1 pile', ZONE_TYPE_MAGI_PILE, PLAYER),
		new Zone('P2 pile', ZONE_TYPE_MAGI_PILE, OPPONENT),
		new Zone('P1 def', ZONE_TYPE_DEFEATED_MAGI, PLAYER),
		new Zone('P2 def', ZONE_TYPE_DEFEATED_MAGI, OPPONENT),
		new Zone('In play', ZONE_TYPE_IN_PLAY, null).add(inPlay),
	];
	// @ts-ignore
	const state = new State({ zones, step, activePlayer: PLAYER });
	state.setPlayers(PLAYER, OPPONENT);
	return state;
}

/** Everything the engine keeps, including queues, card flags and object identity */
function snapshot(state: State) {
	const cardInfo = (c: CardInGame) => ({ id: c.id, name: c.card.name, owner: c.owner, flags: c.flags, data: c.data });
	return {
		json: JSON.stringify({
			full: state.serializeFullState(PLAYER),
			zones: state.state.zones.map(zone => zone.cards.map(cardInfo)),
			actions: state.state.actions,
			savedActions: state.state.savedActions,
			mayEffectActions: state.state.mayEffectActions,
			fallbackActions: state.state.fallbackActions,
			delayedTriggers: state.state.delayedTriggers,
			attachedTo: state.state.attachedTo,
			activePlayer: state.state.activePlayer,
			controllingPlayer: state.state.controllingPlayer,
			promptPlayer: state.state.promptPlayer,
			promptVariable: state.state.promptVariable,
			winner: state.winner,
			turn: state.turn,
		}),
		// Search code keeps references to cards, so the very same objects must come back
		objects: state.state.zones.map(zone => [...zone.cards]),
	};
}

function expectSameState(state: State, before: ReturnType<typeof snapshot>) {
	const after = snapshot(state);
	expect(after.json).toBe(before.json);
	after.objects.forEach((cards, zoneIndex) => {
		cards.forEach((c, i) => expect(c).toBe(before.objects[zoneIndex][i]));
	});
}

const resolveWithTarget = (state: State, target: CardInGame) => state.update({
	type: ACTION_RESOLVE_PROMPT,
	target,
	generatedBy: state.state.promptGeneratedBy,
	player: PLAYER,
} as any);

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
