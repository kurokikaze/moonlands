/* global expect */
// Shared helpers for the Journal (search frame) tests
import { State } from '../src/index';
import { byName } from '../src/cards';
import Card from '../src/classes/Card';
import CardInGame from '../src/classes/CardInGame';
import Zone from '../src/classes/Zone';
import {
	ACTION_RESOLVE_PROMPT,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_MAGI_PILE,
} from '../src/const';

export const PLAYER = 1;
export const OPPONENT = 2;
export const STEP_PRS1 = 1;

export const card = (name: string, owner: number, energy = 0) => new CardInGame(byName(name) as Card, owner).addEnergy(energy);

export type Setup = {
	step?: number,
	inPlay?: CardInGame[],
	hand?: CardInGame[],
	deck?: CardInGame[],
	opponentDeck?: CardInGame[],
	magi?: CardInGame,
	opponentMagi?: CardInGame,
}

export function makeState({ step = STEP_PRS1, inPlay = [], hand = [], deck = [], opponentDeck = [], magi, opponentMagi }: Setup): State {
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
export function snapshot(state: State) {
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

export function expectSameState(state: State, before: ReturnType<typeof snapshot>) {
	const after = snapshot(state);
	expect(after.json).toBe(before.json);
	expect(after.objects.map(cards => cards.length)).toEqual(before.objects.map(cards => cards.length));
	after.objects.forEach((cards, zoneIndex) => {
		cards.forEach((c, i) => expect(c).toBe(before.objects[zoneIndex][i]));
	});
}

export const resolveWithTarget = (state: State, target: CardInGame) => state.update({
	type: ACTION_RESOLVE_PROMPT,
	target,
	generatedBy: state.state.promptGeneratedBy,
	player: PLAYER,
} as any);

/** Number of un-actions currently recorded (0 when no search frame is open) */
export const journalLength = (state: State) => state.journal ? state.journal.length : 0;
