/* global expect, describe, it */
// Journal versions of the Unmaker regression tests in src/unmaker/tests/bugs.test.ts.
// Each test: snapshot → beginSearchFrame → state.update(…) → rollback(frame)
// → assert the state equals the snapshot (including queues, card flags and card object identity).
import { State } from '../src/index';
import CardInGame from '../src/classes/CardInGame';
import {
	ACTION_ATTACK,
	ACTION_EFFECT,
	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_RESOLVE_PROMPT,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	ZONE_TYPE_DECK,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
} from '../src/const';
import { OPPONENT, PLAYER, card, expectSameState, journalLength, makeState, resolveWithTarget, snapshot } from './journalUtils';

const findPower = (source: CardInGame, name: string) => (source.card.data.powers as any[]).find(p => p.name === name);

const usePower = (state: State, source: CardInGame, name: string, extra: Record<string, any> = {}) => {
	const power = findPower(source, name);
	expect(power).toBeTruthy();
	state.update({ type: ACTION_POWER, source, power, player: PLAYER, ...extra } as any);
};

const play = (state: State, target: CardInGame) =>
	state.update({ type: ACTION_PLAY, payload: { card: target, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

describe('Journal – POWER with prompt (Life Channel)', () => {
	it('rolls back state correctly after Life Channel power is applied', () => {
		const arboll = card('Arboll', PLAYER, 3);
		const state = makeState({ inPlay: [arboll], magi: card('Grega', PLAYER, 8), opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		usePower(state, arboll, 'Life Channel');
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal - CARDS_ORDER (Barak Prophecy rearrange)', () => {
	it('rolls back state correctly after CARDS_ORDER prompt resolution', () => {
		const barak = card('Barak', PLAYER, 10);
		const deck = ['Fire Chogo', 'Lava Aq', 'Magma Hyren', 'Diobor'].map(name => card(name, PLAYER));
		const state = makeState({ deck, magi: barak, opponentMagi: card('Sinder', OPPONENT, 6) });

		// Prophecy is applied outside the frame, so the state is already in the rearrange prompt
		usePower(state, barak, 'Prophecy');
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		const topFourIds = state.getZone(ZONE_TYPE_DECK, PLAYER).cards.slice(0, 4).map(c => c.id);
		state.update({
			type: ACTION_RESOLVE_PROMPT,
			cards: [...topFourIds].reverse(),
			generatedBy: state.state.promptGeneratedBy,
			player: PLAYER,
		} as any);
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal - PLAY with roll_die (Grow)', () => {
	it('rolls back the game log after Grow is played', () => {
		const grow = card('Grow', PLAYER);
		const state = makeState({ inPlay: [card('Furok', PLAYER, 3)], hand: [grow], magi: card('Poad', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		const logBefore = state.state.log.length;
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		play(state, grow);
		expect(state.state.log.length).toBeGreaterThan(logBefore);
		state.rollback(frame);

		expect(state.state.log.length).toBe(logBefore);
		expectSameState(state, before);
	});

	it('produces the same die roll result after rollback (PRNG is restored)', () => {
		const grow1 = card('Grow', PLAYER);
		const grow2 = card('Grow', PLAYER);
		const state = makeState({ inPlay: [card('Furok', PLAYER, 3)], hand: [grow1, grow2], magi: card('Poad', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		state.initiatePRNG(42);
		const dieRoll = () => (state.state.log as any[]).find(entry => entry.type === 'log_entry/die_rolled')?.result ?? null;

		const first = state.beginSearchFrame();
		play(state, grow1);
		const firstRoll = dieRoll();
		state.rollback(first);

		const second = state.beginSearchFrame();
		play(state, grow1);
		const secondRoll = dieRoll();
		state.rollback(second);

		expect(firstRoll).not.toBeNull();
		expect(secondRoll).toBe(firstRoll);
	});
});

describe('Journal - PLAY Fog Bank attached to creature when no creatures in play', () => {
	it('does not crash when Fog Bank prompt is resolved with no own creatures, and rolls back', () => {
		const fogBank = card('Fog Bank', PLAYER);
		const state = makeState({ hand: [fogBank], magi: card('Adis', PLAYER, 15), opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		play(state, fogBank);
		expect(() => state.update({
			type: ACTION_RESOLVE_PROMPT,
			cards: [],
			generatedBy: state.state.promptGeneratedBy,
			player: PLAYER,
		} as any)).not.toThrow();

		// Fog Bank should NOT be in play (play was aborted due to no valid target)
		expect(state.getZone(ZONE_TYPE_IN_PLAY).cards.find(c => c.card.name === 'Fog Bank')).toBeUndefined();

		state.rollback(frame);
		expectSameState(state, before);
	});
});

describe('Journal – POWER return_creature_discarding_energy resolved (Alaban Undream)', () => {
	it('rolls back state correctly after Undream resolves', () => {
		const alaban = card('Alaban', PLAYER, 6);
		const lovian = card('Lovian', PLAYER, 3);
		const state = makeState({ inPlay: [alaban, lovian], magi: card('Adis', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		usePower(state, alaban, 'Undream');
		resolveWithTarget(state, state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(lovian.id)).toBe(false);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal – PLAY spell return_creature_returning_energy (Updraft)', () => {
	it('rolls back state correctly after Updraft returns a creature', () => {
		const updraft = card('Updraft', PLAYER);
		const lovian = card('Lovian', PLAYER, 3);
		const adis = card('Adis', PLAYER, 10);
		const state = makeState({ inPlay: [lovian], hand: [updraft], magi: adis, opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		play(state, updraft);
		resolveWithTarget(state, state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(lovian.id)).toBe(false);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal – POWER move_cards_between_zones + draw_n_cards (Cloud Sceptre Mindwinds)', () => {
	it('rolls back state correctly after Mindwinds discards and redraws', () => {
		const sceptre = card('Cloud Sceptre', PLAYER);
		const hand = ['Lovian', 'Orish', 'Thunder Hyren'].map(name => card(name, PLAYER));
		const deck = ['Xyx', 'Vellup', 'Ayebaw'].map(name => card(name, PLAYER));
		const state = makeState({ inPlay: [sceptre], hand, deck, magi: card('Adis', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		usePower(state, sceptre, 'Mindwinds');
		state.update({
			type: ACTION_RESOLVE_PROMPT,
			zone: ZONE_TYPE_HAND,
			zoneOwner: PLAYER,
			cards: state.getZone(ZONE_TYPE_HAND, PLAYER).cards.slice(0, 2),
			generatedBy: state.state.promptGeneratedBy,
			player: PLAYER,
		} as any);
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal – POWER with move_cards_between_zones discard hand (Eye of the Storm roll=1)', () => {
	it('rolls back state correctly after Energy Boost discards the hand', () => {
		const eye = card('Eye of the Storm', PLAYER);
		const hand = ['Lovian', 'Orish', 'Thunder Hyren'].map(name => card(name, PLAYER));
		const state = makeState({ inPlay: [eye], hand, magi: card('Adis', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		state.initiatePRNG(7); // seed 7 → die rolls 1 → discard hand path
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		usePower(state, eye, 'Energy Boost');
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal – Cyclone Vashp Cyclone: DISCARD_CREATURE_FROM_PLAY with target $ownCreature', () => {
	it('rolls back state correctly after Cyclone fully resolves', () => {
		const vashp = card('Cyclone Vashp', PLAYER, 5);
		const furok = card('Furok', OPPONENT, 4);
		const state = makeState({ inPlay: [vashp, furok], magi: card('Adis', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		usePower(state, vashp, 'Cyclone');
		resolveWithTarget(state, state.getZone(ZONE_TYPE_IN_PLAY).byId(vashp.id)!);
		resolveWithTarget(state, state.getZone(ZONE_TYPE_IN_PLAY).byId(furok.id)!);
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});
});

describe('Journal – Firestorm repeated branch does not leak journal entries', () => {
	it('keeps journal length stable across repeated power+prompt rollbacks', () => {
		const lavaAq = card('Lava Aq', PLAYER, 6);
		const arbolit = card('Arbolit', PLAYER, 2);
		const state = makeState({
			inPlay: [lavaAq, arbolit, card('Weebo', OPPONENT, 2), card('Arboll', OPPONENT, 2)],
			magi: card('Grega', PLAYER, 8),
			opponentMagi: card('Pruitt', OPPONENT, 8),
		});
		const before = snapshot(state);

		// An outer frame keeps the journal alive between branches, like a search root
		const root = state.beginSearchFrame();

		for (let i = 0; i < 25; i++) {
			const checkpointLength = journalLength(state);

			const frame = state.beginSearchFrame();
			usePower(state, lavaAq, 'Firestorm');
			const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
			expect(target).toBeTruthy();
			resolveWithTarget(state, target!);

			expect(journalLength(state) - checkpointLength).toBeGreaterThan(6);

			state.rollback(frame);

			expect(journalLength(state)).toBe(checkpointLength);
			expectSameState(state, before);
		}

		state.rollback(root);
		expect(state.journal).toBeNull();
	});

	it('does not leak journal entries after rollback as Firestorm hits more non-Cald cards', () => {
		const runScenario = (extraOppCreatures: number) => {
			const lavaAq = card('Lava Aq', PLAYER, 6);
			const arbolit = card('Arbolit', PLAYER, 2);
			const inPlay = [lavaAq, arbolit, card('Weebo', OPPONENT, 2)];
			for (let i = 0; i < extraOppCreatures; i++) {
				inPlay.push(card('Arboll', OPPONENT, 2));
			}
			const state = makeState({ inPlay, magi: card('Grega', PLAYER, 8), opponentMagi: card('Pruitt', OPPONENT, 8) });
			const before = snapshot(state);

			const frame = state.beginSearchFrame();
			usePower(state, lavaAq, 'Firestorm');
			resolveWithTarget(state, state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)!);
			const entriesRecorded = journalLength(state);

			state.rollback(frame);

			expect(state.journal).toBeNull();
			expect(journalLength(state)).toBe(0);
			expectSameState(state, before);

			return entriesRecorded;
		};

		const smallBoard = runScenario(0);
		const largeBoard = runScenario(4);

		expect(largeBoard).toBeGreaterThan(smallBoard);
	});
});

describe('Journal - MOVE_CARD_BETWEEN_ZONES with stale source id', () => {
	it('does not clone a card that is not in the source zone into destination', () => {
		const handFogBank = card('Fog Bank', PLAYER);
		const staleFogBank = card('Fog Bank', PLAYER);
		const state = makeState({ hand: [handFogBank], magi: card('Grega', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });

		const handBefore = state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map(c => c.id);
		const inPlayBefore = state.getZone(ZONE_TYPE_IN_PLAY).cards.map(c => c.id);

		// The Unmaker test expects a [MOVE_ZONE_MISSING_SOURCE] error here, which the engine
		// does not throw (it logs and skips the move). Either way, nothing must be moved.
		try {
			state.update({
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
				target: staleFogBank,
				sourceZone: ZONE_TYPE_HAND,
				destinationZone: ZONE_TYPE_IN_PLAY,
				generatedBy: staleFogBank.id,
				bottom: false,
			} as any);
		} catch (e) { /* engine may reject the stale move */ }

		expect(state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map(c => c.id)).toEqual(handBefore);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).cards.map(c => c.id)).toEqual(inPlayBefore);
		expect(state.getZone(ZONE_TYPE_HAND, PLAYER).containsId(handFogBank.id)).toBe(true);
		expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(staleFogBank.id)).toBe(false);
	});

	it('keeps rollback safe after a stale move', () => {
		const handFogBank = card('Fog Bank', PLAYER);
		const staleFogBank = card('Fog Bank', PLAYER);
		const state = makeState({ hand: [handFogBank], magi: card('Grega', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		try {
			state.update({
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
				target: staleFogBank,
				sourceZone: ZONE_TYPE_HAND,
				destinationZone: ZONE_TYPE_IN_PLAY,
				generatedBy: staleFogBank.id,
				bottom: false,
			} as any);
		} catch (e) { /* engine may reject the stale move */ }

		expect(() => state.rollback(frame)).not.toThrow();
		expect(journalLength(state)).toBe(0);
		expectSameState(state, before);
	});

	it('rolls back playing Fog Bank and resolving its prompt with nested frames', () => {
		const fogBank = card('Fog Bank', PLAYER);
		const vellup = card('Vellup', PLAYER, 1);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({
			inPlay: [vellup],
			hand: [card('Fog Bank', PLAYER), card('Vellup', PLAYER), fogBank],
			magi: card('Ora', PLAYER, 12),
			opponentMagi: card('Sinder', OPPONENT, 8),
		});
		const before = snapshot(state);

		const outer = state.beginSearchFrame();
		expect(() => state.update({ type: ACTION_PLAY, payload: { card: fogBank, player: PLAYER } } as any)).not.toThrow();

		const before2 = snapshot(state);
		const inner = state.beginSearchFrame();
		expect(() => resolveWithTarget(state, vellup)).not.toThrow();
		expect(snapshot(state).json).not.toBe(before2.json);

		expect(() => state.rollback(inner)).not.toThrow();
		expectSameState(state, before2);

		expect(() => state.rollback(outer)).not.toThrow();
		expect(journalLength(state)).toBe(0);
		expectSameState(state, before);
	});

	it('rolls back Arbolit Healing Flame with nested frames', () => {
		const arbolit = card('Arbolit', PLAYER, 5);
		const vellup = card('Vellup', PLAYER, 1);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({ inPlay: [arbolit, vellup, card('Vellup', PLAYER, 3)], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const outer = state.beginSearchFrame();
		expect(() => usePower(state, arbolit, 'Healing Flame')).not.toThrow();

		const before2 = snapshot(state);
		const inner = state.beginSearchFrame();
		expect(() => resolveWithTarget(state, arbolit)).not.toThrow();
		expect(snapshot(state).json).not.toBe(before2.json);

		expect(() => state.rollback(inner)).not.toThrow();
		expectSameState(state, before2);

		expect(() => state.rollback(outer)).not.toThrow();
		expect(journalLength(state)).toBe(0);
		expectSameState(state, before);
	});

	it('rolls back Fog Bank attachment with nested frames', () => {
		const fogBank = card('Fog Bank', PLAYER, 5);
		const vellup = card('Vellup', PLAYER, 3);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({ inPlay: [vellup], hand: [fogBank], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });
		const before = snapshot(state);

		const outer = state.beginSearchFrame();
		expect(() => play(state, fogBank)).not.toThrow();

		const before2 = snapshot(state);
		const inner = state.beginSearchFrame();
		expect(() => resolveWithTarget(state, vellup)).not.toThrow();
		expect(Object.keys(state.state.cardsAttached)).toHaveLength(1);

		expect(() => state.rollback(inner)).not.toThrow();
		expectSameState(state, before2);

		expect(() => state.rollback(outer)).not.toThrow();
		expect(journalLength(state)).toBe(0);
		expectSameState(state, before);
	});

	it('rolls back an attack by a creature with a card attached', () => {
		const fogBank = card('Fog Bank', PLAYER, 5);
		const flameHyren = card('Flame Hyren', OPPONENT, 15);
		const vellup = card('Vellup', PLAYER, 3);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({ inPlay: [vellup, flameHyren], hand: [fogBank], magi: card('Ora', PLAYER, 12), opponentMagi: card('Sinder', OPPONENT, 8) });

		const outer = state.beginSearchFrame();
		expect(() => play(state, fogBank)).not.toThrow();
		expect(() => resolveWithTarget(state, vellup)).not.toThrow();
		expect(() => state.update({ type: ACTION_PASS, player: PLAYER } as any)).not.toThrow();

		const inner = state.beginSearchFrame();
		const before = snapshot(state);
		expect(() => state.update({ type: ACTION_ATTACK, source: vellup, target: flameHyren, player: PLAYER } as any)).not.toThrow();
		expect(snapshot(state).json).not.toBe(before.json);

		state.rollback(inner);
		expectSameState(state, before);
		state.rollback(outer);
	});

	it('rolls back resolving Fireball after Healing Flame', () => {
		const arbolit = card('Arbolit', PLAYER, 3);
		const diobor = card('Diobor', PLAYER, 6);
		const vellup = card('Vellup', PLAYER, 3);
		vellup.data.energyLostThisTurn = 2;
		const state = makeState({
			inPlay: [vellup, card('Flame Hyren', OPPONENT, 15)],
			// Arbolit and Diobor are in hand, as in the Unmaker test
			hand: [arbolit, diobor],
			magi: card('Ora', PLAYER, 12),
			opponentMagi: card('Sinder', OPPONENT, 8),
		});

		const outer = state.beginSearchFrame();
		expect(() => usePower(state, arbolit, 'Healing Flame')).not.toThrow();
		expect(() => resolveWithTarget(state, arbolit)).not.toThrow();
		expect(() => usePower(state, diobor, 'Fireball')).not.toThrow();

		const inner = state.beginSearchFrame();
		const before = snapshot(state);
		expect(() => resolveWithTarget(state, diobor)).not.toThrow();
		expect(snapshot(state).json).not.toBe(before.json);

		state.rollback(inner);
		expectSameState(state, before);
		state.rollback(outer);
	});
});

describe('Journal – prompt internals must be restored after Shatterfire rollback', () => {
	const setup = () => {
		const raxis = card('Raxis', PLAYER, 5);
		const magmaArmor = card('Magma Armor', PLAYER);
		const crown = card("Arderial's Crown", OPPONENT);
		const state = makeState({ inPlay: [raxis, magmaArmor, crown], magi: card('Sinder', PLAYER, 12), opponentMagi: card('Adis', OPPONENT, 12) });
		const branch = () => {
			usePower(state, raxis, 'Shatterfire');
			state.update({
				type: ACTION_RESOLVE_PROMPT,
				target: state.getZone(ZONE_TYPE_IN_PLAY).byId(magmaArmor.id),
				generatedBy: state.state.promptGeneratedBy,
				player: state.state.promptPlayer,
			} as any);
		};
		return { state, branch };
	};

	it('restores savedActions and promptPlayer after rolling back a relic prompt branch', () => {
		const { state, branch } = setup();
		const before = {
			prompt: state.state.prompt,
			promptType: state.state.promptType,
			promptPlayer: state.state.promptPlayer,
			savedActionsLength: (state.state.savedActions ?? []).length,
		};
		const fullBefore = snapshot(state);

		const frame = state.beginSearchFrame();
		branch();
		expect(snapshot(state).json).not.toBe(fullBefore.json);
		state.rollback(frame);

		expect(state.state.prompt).toBe(before.prompt);
		expect(state.state.promptType).toBe(before.promptType);
		expect(state.state.promptPlayer).toBe(before.promptPlayer);
		expect((state.state.savedActions ?? []).length).toBe(before.savedActionsLength);
		expectSameState(state, fullBefore);
	});

	it('restores savedActions content to the pre-prompt baseline', () => {
		const { state, branch } = setup();
		const beforeSavedActions = JSON.parse(JSON.stringify(state.state.savedActions ?? []));

		const frame = state.beginSearchFrame();
		branch();
		state.rollback(frame);

		expect(JSON.parse(JSON.stringify(state.state.savedActions ?? []))).toEqual(beforeSavedActions);
	});
});

describe('Journal – POWER with PLAYER prompt (Epik Dream Feast)', () => {
	const setup = (opponentHand: string[] = []) => {
		const epik = card('Epik', PLAYER, 2);
		const state = makeState({ inPlay: [epik], magi: card('Adis', PLAYER, 10), opponentMagi: card('Sinder', OPPONENT, 6) });
		state.getZone(ZONE_TYPE_HAND, OPPONENT).add(opponentHand.map(name => card(name, OPPONENT)));
		const activate = () => usePower(state, epik, 'Dream Feast', { generatedBy: epik.id });
		const choosePlayer = () => state.update({ type: ACTION_RESOLVE_PROMPT, targetPlayer: OPPONENT, generatedBy: epik.id } as any);
		return { state, activate, choosePlayer };
	};

	it('rolls back state correctly after Dream Feast PLAYER prompt is resolved (opponent hand empty, power fully resolves)', () => {
		const { state, activate, choosePlayer } = setup();
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		activate();
		choosePlayer();
		expect(snapshot(state).json).not.toBe(before.json);
		state.rollback(frame);

		expectSameState(state, before);
	});

	it('rolls back state correctly when opponent hand has creatures (stops at CHOOSE_CARDS prompt after self-discard)', () => {
		const { state, activate, choosePlayer } = setup(['Leaf Hyren', 'Furok']);
		const before = snapshot(state);

		const frame = state.beginSearchFrame();
		activate();
		choosePlayer();

		// Engine should now be paused at the CHOOSE_CARDS prompt (Epik already discarded itself)
		expect(state.state.prompt).toBe(true);

		state.rollback(frame);
		expectSameState(state, before);
	});

	// Mirrors the search-tree flow: ACTION_POWER is applied under one frame,
	// then a NEW frame is opened just for the PLAYER prompt resolution.
	it('rolls back only the PLAYER resolution when POWER activation happened under a prior frame', () => {
		const { state, activate, choosePlayer } = setup(['Leaf Hyren', 'Furok']);
		const before = snapshot(state);

		const depth0 = state.beginSearchFrame();
		activate();
		const afterActivation = snapshot(state);

		const depth1 = state.beginSearchFrame();
		choosePlayer();
		expect(snapshot(state).json).not.toBe(afterActivation.json);
		state.rollback(depth1);
		expectSameState(state, afterActivation);

		state.rollback(depth0);
		expectSameState(state, before);
	});
});
