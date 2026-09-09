/* global expect, describe, it */
import * as moonlands from '../../index.ts';
import { byName } from '../../cards.ts';
import CardInGame from '../../classes/CardInGame.ts';
import Zone from '../../classes/Zone.ts';
import { Unmaker } from '../unmaker.ts';
import {
	ACTION_EFFECT,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_PASS,
	EFFECT_TYPE_NONE,
	PROMPT_TYPE_ALTERNATIVE,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_PLAYER,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	RESTRICTION_OWN_CREATURE,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
} from '../../const.ts';
import { STEP_PRS_FIRST } from '../../../test/utils.js';

describe('Unmaker prompt action round trips', () => {
	const ACTIVE_PLAYER = 0;
	const NON_ACTIVE_PLAYER = 2;

	function createPromptState() {
		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(3);
		const kelthet = new CardInGame(byName('Kelthet'), ACTIVE_PLAYER).addEnergy(2);
		const gameState = new moonlands.State({
			zones: [
				new Zone('AP Active Magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
				new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
				new Zone('AP Hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([arbolit, kelthet]),
				new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([arbolit, kelthet]),
			],
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);
		return { gameState, grega, arbolit, kelthet };
	}

	const promptCases = [
		{
			name: 'number',
			promptType: PROMPT_TYPE_NUMBER,
			promptParams: { min: 1, max: 5 },
			resolution: () => ({ number: 3 }),
		},
		{
			name: 'alternative',
			promptType: PROMPT_TYPE_ALTERNATIVE,
			promptParams: { alternatives: [{ name: 'First', value: 'first' }, { name: 'Second', value: 'second' }] },
			resolution: () => ({ alternative: 'second' }),
		},
		{
			name: 'player',
			promptType: PROMPT_TYPE_PLAYER,
			promptParams: {},
			resolution: () => ({ targetPlayer: NON_ACTIVE_PLAYER }),
		},
		{
			name: 'filtered creature',
			promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			promptParams: { restrictions: [{ type: RESTRICTION_OWN_CREATURE, value: '' }] },
			resolution: ({ arbolit }) => ({ target: arbolit }),
		},
		{
			name: 'choose cards from zone',
			promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			promptParams: { zone: ZONE_TYPE_HAND, zoneOwner: ACTIVE_PLAYER, numberOfCards: 2 },
			resolution: ({ arbolit, kelthet }) => ({ cards: [arbolit, kelthet] }),
		},
	];

	promptCases.forEach(({ name, promptType, promptParams, resolution }) => {
		it(`enters and unmakes a ${name} prompt`, () => {
			const { gameState, grega } = createPromptState();
			const before = gameState.serializeFullState(ACTIVE_PLAYER);
			const unmaker = new Unmaker(gameState);

			unmaker.setCheckpoint();
			gameState.update({
				type: ACTION_ENTER_PROMPT,
				promptType,
				promptParams,
				player: ACTIVE_PLAYER,
				variable: 'promptResult',
				generatedBy: grega.id,
			});

			expect(gameState.state.prompt).toBe(true);
			expect(gameState.state.promptType).toBe(promptType);
			unmaker.revertToCheckpoint(gameState);
			expect(gameState.serializeFullState(ACTIVE_PLAYER)).toEqual(before);
		});

		it(`resolves and unmakes a ${name} prompt`, () => {
			const context = createPromptState();
			const { gameState, grega } = context;
			const unmaker = new Unmaker(gameState);

			gameState.update({
				type: ACTION_ENTER_PROMPT,
				promptType,
				promptParams,
				player: ACTIVE_PLAYER,
				variable: 'promptResult',
				generatedBy: grega.id,
			});
			const promptedState = gameState.serializeFullState(ACTIVE_PLAYER);

			unmaker.setCheckpoint();
			gameState.update({
				type: ACTION_RESOLVE_PROMPT,
				promptType,
				generatedBy: grega.id,
				player: ACTIVE_PLAYER,
				...resolution(context),
			});

			expect(gameState.state.prompt).toBe(false);
			expect(gameState.getSpellMetadata(grega.id).promptResult).toBeDefined();
			unmaker.revertToCheckpoint(gameState);
			expect(gameState.serializeFullState(ACTIVE_PLAYER)).toEqual(promptedState);
		});
	});

	it('restores queued actions after entering a prompt', () => {
		const { gameState, grega } = createPromptState();
		const promptAction = {
			type: ACTION_ENTER_PROMPT,
			promptType: PROMPT_TYPE_NUMBER,
			promptParams: { min: 1, max: 5 },
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		};
		const queuedAction = {
			type: ACTION_EFFECT,
			effectType: EFFECT_TYPE_NONE,
			generatedBy: grega.id,
		};
		gameState.state.actions = [promptAction, queuedAction];
		const actionsBefore = [...gameState.state.actions];
		const unmaker = new Unmaker(gameState);

		unmaker.setCheckpoint();
		gameState.update({ type: ACTION_PASS, player: ACTIVE_PLAYER });

		expect(gameState.state.prompt).toBe(true);
		expect(gameState.state.savedActions).toHaveLength(2);
		unmaker.revertToCheckpoint();

		expect(gameState.state.prompt).toBe(false);
		expect(gameState.state.actions).toEqual(actionsBefore);
		expect(gameState.state.savedActions).toEqual([]);
	});
});
