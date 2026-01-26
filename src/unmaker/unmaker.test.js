/* global expect, describe, it */
import * as moonlands from '../index.ts';
import { byName, cards } from '../cards.ts';
import CardInGame from '../classes/CardInGame.ts';
import Card from '../classes/Card.ts';
import { Unmaker } from './unmaker.ts';

import {
	TYPE_CREATURE,

	ACTION_PLAY,
	ACTION_POWER,
	ACTION_PASS,
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_CONCEDE,
	ACTION_EXIT_PROMPTS,

	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_ADD_DELAYED_TRIGGER,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_DIE_ROLLED,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,

	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES_OF_TYPE,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_CREATURES_OF_TYPE,
	SELECTOR_CREATURES_NOT_OF_TYPE,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_MAGI,
	SELECTOR_CREATURES,
	SELECTOR_OWN_CARDS_IN_PLAY,
	SELECTOR_STATUS,
	SELECTOR_ID,
	SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,
	SELECTOR_NTH_CARD_OF_ZONE,
	SELECTOR_RANDOM_CARD_IN_HAND,

	REGION_NAROOM,
	REGION_CALD,
	REGION_OROTHE,
	REGION_UNDERNEATH,
	REGION_ARDERIAL,

	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,

	ACTION_PROPERTY,
	ACTION_ATTACK,

	PROPERTY_ENERGIZE,

	PROMPT_TYPE_CHOOSE_CARDS,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_PLAYER,
	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_ALTERNATIVE,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,

	RESTRICTION_REGION,
	RESTRICTION_TYPE,
	RESTRICTION_STATUS,
	RESTRICTION_ENERGY_EQUALS,
	RESTRICTION_OWN_CREATURE,

	CALCULATION_SET,

	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
	EFFECT_TYPE_ATTACK,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
	EFFECT_TYPE_NONE,
	EFFECT_TYPE_CONDITIONAL,
	EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE,
	EFFECT_TYPE_PROMPT_ENTERED,

	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_DEFEATED_MAGI,
	ZONE_TYPE_DECK,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_HAND,

	PROPERTY_ENERGY_LOSS_THRESHOLD,
	PROPERTY_STATUS,
	PROPERTY_ABLE_TO_ATTACK,

	EXPIRATION_ANY_TURNS,
	EXPIRATION_NEVER,

	STATUS_BURROWED,
} from '../const.ts';

import {
	STEP_ENERGIZE,
	STEP_PRS_FIRST,
	STEP_ATTACK,
	STEP_CREATURES,
	STEP_PRS_SECOND,
	STEP_DRAW,
	createZones,
} from '../../test/utils.js';

import Zone from '../classes/Zone.ts';
import { UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, UNMAKE_EFFECT_TYPE_DIE_ROLLED, UNMAKE_EFFECT_TYPE_START_TURN, UNMAKE_EFFECT_TYPE_START_STEP, UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE, UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI } from './types.ts';

describe('Unmaking state action', () => {
    it('Damage action', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 2;

        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER);
        const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

        const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(14);
        const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER);

        const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
        const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
        const fireChogoOne = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
        const fireChogoTwo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);

        const zones = [
            new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER),
            new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([grega, sinder]),
            new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
            new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
            new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([
                quorOne,
                quorTwo,
                fireChogoOne,
                fireChogoTwo,
            ]),
            new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER).add([quorPup]),
            new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER),
            new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit]),
        ];

        const gameState = new moonlands.State({
            zones,
            step: STEP_DRAW,
            activePlayer: NON_ACTIVE_PLAYER,
        });
        gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

        gameState.state.turn = 1;

        const effect = {
            type: moonlands.ACTION_EFFECT,
            effectType: moonlands.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
            target: arbolit,
			amount: 5,
            generatedBy: quorOne.id,
        }

        const unmaker = new Unmaker(gameState)

        gameState.update(effect);

		const serializedState = gameState.serializeData(ACTIVE_PLAYER, false)

		expect(unmaker.unActions).toHaveLength(1)
		expect(unmaker.unActions[0].type).toBe(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE)
		expect(unmaker.unActions[0].creatures).toHaveLength(1)
		expect(unmaker.unActions[0].creatures[0].id).toBe(arbolit.id)
		expect(unmaker.unActions[0].creatures[0].energy).toBe(14)

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(9)

		unmaker.applyUnAction(gameState, unmaker.unActions[0]);

		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(14)
		expect(serializedState).toEqual(gameState.serializeData(ACTIVE_PLAYER, false))
	})

	it('Discard energy from magi action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const quorOne = new CardInGame(byName('Quor'), NON_ACTIVE_PLAYER);
		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER).add([quorOne]),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
			target: grega,
			amount: 3,
			generatedBy: quorOne.id,
		}

		const unmaker = new Unmaker(gameState)

		const serializedState = gameState.serializeData(ACTIVE_PLAYER, false)

		gameState.update(effect);

		expect(unmaker.unActions).toHaveLength(1)
		expect(unmaker.unActions[0].type).toBe(UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI)
		expect(unmaker.unActions[0].magi).toHaveLength(1)
		expect(unmaker.unActions[0].magi[0].id).toBe(grega.id)
		expect(unmaker.unActions[0].magi[0].energy).toBe(10)

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).byId(grega.id).data.energy).toBe(7)

		unmaker.applyUnAction(gameState, unmaker.unActions[0]);

		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).byId(grega.id).data.energy).toBe(10)

		expect(serializedState).toEqual(gameState.serializeData(ACTIVE_PLAYER, false))
	})

	it('Move card between zones action (in play to discard)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER).addEnergy(3);
		const quorPupTwo = new CardInGame(byName('Quor Pup'), NON_ACTIVE_PLAYER).addEnergy(3);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit, quorPup, quorPupTwo]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		// Verify initial state
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toBe(3)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)).toBeTruthy()
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toBe(0)

		// Verify spellMetaData doesn't have new_card before the action
		expect(gameState.getSpellMetadata(grega.id).new_card).toBeUndefined()
		expect(gameState.getSpellMetadata(arbolit.id).new_card).toBeUndefined()

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
			target: arbolit,
			sourceZone: ZONE_TYPE_IN_PLAY,
			destinationZone: ZONE_TYPE_DISCARD,
			bottom: false,
			generatedBy: grega.id,
		}

		const unmaker = new Unmaker(gameState)
		unmaker.setCheckpoint()

		const serializedState = gameState.serializeData(ACTIVE_PLAYER, false)

		gameState.update(effect);

		// Verify action was captured
		expect(unmaker.unActions).toHaveLength(1)
		expect(unmaker.unActions[0].type).toBe(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES)
		expect(unmaker.unActions[0].card.id).toBe(arbolit.id)
		expect(unmaker.unActions[0].sourceZone).toBe(ZONE_TYPE_IN_PLAY)
		expect(unmaker.unActions[0].destinationZone).toBe(ZONE_TYPE_DISCARD)
		expect(unmaker.unActions[0].position).toBe(0)

		// Verify card was moved
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toBe(2)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)).toBeFalsy()
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toBe(1)

		// Verify spellMetaData has new_card after the action
		expect(gameState.getSpellMetadata(grega.id).new_card).toBeTruthy()
		expect(gameState.getSpellMetadata(arbolit.id).new_card).toBeTruthy()

		// Apply un-action
		unmaker.revertToCheckpoint(gameState)
		// unmaker.applyUnAction(gameState, unmaker.unActions[0]);

		// Verify card was moved back
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toBe(3)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)).toBeTruthy()
		expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toBe(0)
		// Verify the card is back at its original position
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].id).toBe(arbolit.id)

		// Verify spellMetaData new_card was reverted after the un-action
		expect(gameState.getSpellMetadata(grega.id).new_card).toBeUndefined()
		expect(gameState.getSpellMetadata(arbolit.id).new_card).toBeUndefined()

		expect(serializedState).toEqual(gameState.serializeData(ACTIVE_PLAYER, false))
	})

	it('Move card between zones action (hand to deck, bottom)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const fireChogo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER).add([quorOne, fireChogo]),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([quorTwo]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		// Verify initial state
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toBe(2)
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).byId(quorOne.id)).toBeTruthy()
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toBe(1)

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
			target: quorOne,
			sourceZone: ZONE_TYPE_HAND,
			destinationZone: ZONE_TYPE_DECK,
			bottom: true,
			generatedBy: grega.id,
		}

		const unmaker = new Unmaker(gameState)

		gameState.update(effect);

		// Verify action was captured
		expect(unmaker.unActions).toHaveLength(1)
		expect(unmaker.unActions[0].type).toBe(UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES)
		expect(unmaker.unActions[0].card.id).toBe(quorOne.id)
		expect(unmaker.unActions[0].bottom).toBe(true)

		// Verify card was moved
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toBe(1)
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).byId(quorOne.id)).toBeFalsy()
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toBe(2)

		// Apply un-action
		unmaker.applyUnAction(gameState, unmaker.unActions[0]);

		// Verify card was moved back
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toBe(2)
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).byId(quorOne.id)).toBeTruthy()
		expect(gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER).length).toBe(1)
		// Verify the card is back at its original position (first in hand)
		expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).cards[0].id).toBe(quorOne.id)
	})

	it('Die rolled action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		const spellId = 'test-spell-id';

		// Verify spellMetaData doesn't have roll_result before the action
		expect(gameState.getSpellMetadata(spellId).roll_result).toBeUndefined()

		const unmaker = new Unmaker(gameState)

		// Use ROLL_DIE which transforms into DIE_ROLLED
		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ROLL_DIE,
			result: 4, // Pre-set the result to make it deterministic
			player: ACTIVE_PLAYER,
			generatedBy: spellId,
		}

		gameState.update(effect);

		// Verify DIE_ROLLED action was captured (ROLL_DIE transforms into DIE_ROLLED)
		const dieRolledUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_DIE_ROLLED)
		expect(dieRolledUnActions).toHaveLength(1)
		expect(dieRolledUnActions[0].spellId).toBe(spellId)
		expect(dieRolledUnActions[0].previousRollResult).toBeUndefined()

		// Verify roll_result was set
		expect(gameState.getSpellMetadata(spellId).roll_result).toBe(4)

		// Apply un-action
		unmaker.applyUnAction(gameState, dieRolledUnActions[0]);

		// Verify roll_result was reverted
		expect(gameState.getSpellMetadata(spellId).roll_result).toBeUndefined()
	})

	it('Die rolled action (with existing roll_result)', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.state.turn = 1;

		const spellId = 'test-spell-id';

		// Set an existing roll_result before the action
		gameState.setSpellMetaDataField('roll_result', 2, spellId);
		expect(gameState.getSpellMetadata(spellId).roll_result).toBe(2)

		const unmaker = new Unmaker(gameState)

		// Use ROLL_DIE which transforms into DIE_ROLLED
		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ROLL_DIE,
			result: 5, // Pre-set the result to make it deterministic
			player: ACTIVE_PLAYER,
			generatedBy: spellId,
		}

		gameState.update(effect);

		// Verify DIE_ROLLED action was captured with previous value
		const dieRolledUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_DIE_ROLLED)
		expect(dieRolledUnActions).toHaveLength(1)
		expect(dieRolledUnActions[0].spellId).toBe(spellId)
		expect(dieRolledUnActions[0].previousRollResult).toBe(2)

		// Verify roll_result was updated
		expect(gameState.getSpellMetadata(spellId).roll_result).toBe(5)

		// Apply un-action
		unmaker.applyUnAction(gameState, dieRolledUnActions[0]);

		// Verify roll_result was restored to previous value
		expect(gameState.getSpellMetadata(spellId).roll_result).toBe(2)
	})

	it('Start turn action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		// Create a creature with some flags set
		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		arbolit.data.controller = ACTIVE_PLAYER;
		arbolit.data.hasAttacked = true;
		arbolit.data.attacked = 1;
		arbolit.data.actionsUsed = ['SomePower'];
		arbolit.data.energyLostThisTurn = 2;

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);
		const tryn = new CardInGame(byName('Tryn'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([tryn]),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_DRAW,
			activePlayer: NON_ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		// Set initial turn state
		gameState.turn = 5; // turn is a direct property on State class
		gameState.state.step = STEP_DRAW;
		gameState.state.activePlayer = NON_ACTIVE_PLAYER;
		gameState.state.continuousEffects = [];

		// Also set some flags on the magi
		grega.data.actionsUsed = ['Flame Geyser'];

		// Capture initial state
		const initialTurn = gameState.turn;
		const initialStep = gameState.state.step;
		const initialActivePlayer = gameState.state.activePlayer;

		// Verify initial card flags
		expect(arbolit.data.hasAttacked).toBe(true)
		expect(arbolit.data.attacked).toBe(1)
		expect(arbolit.data.actionsUsed).toEqual(['SomePower'])
		expect(arbolit.data.energyLostThisTurn).toBe(2)
		expect(grega.data.actionsUsed).toEqual(['Flame Geyser'])

		const unmaker = new Unmaker(gameState)

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_START_TURN,
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Find the START_TURN un-action
		const startTurnUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_START_TURN)
		expect(startTurnUnActions).toHaveLength(1)
		expect(startTurnUnActions[0].previousTurn).toBe(initialTurn)
		expect(startTurnUnActions[0].previousStep).toBe(initialStep)
		expect(startTurnUnActions[0].previousActivePlayer).toBe(initialActivePlayer)

		// Verify card flags were captured
		expect(startTurnUnActions[0].cardFlags[arbolit.id]).toBeDefined()
		expect(startTurnUnActions[0].cardFlags[arbolit.id].hasAttacked).toBe(true)
		expect(startTurnUnActions[0].cardFlags[arbolit.id].attacked).toBe(1)
		expect(startTurnUnActions[0].cardFlags[arbolit.id].actionsUsed).toEqual(['SomePower'])
		expect(startTurnUnActions[0].cardFlags[grega.id]).toBeDefined()
		expect(startTurnUnActions[0].cardFlags[grega.id].actionsUsed).toEqual(['Flame Geyser'])

		// Verify state was changed
		expect(gameState.turn).toBe(6) // Incremented from 5
		// Note: step ends up at 1 because step 0 (Energize) is automatic and passes immediately
		expect(gameState.state.step).toBe(1)
		expect(gameState.state.activePlayer).toBe(ACTIVE_PLAYER)

		// Verify card flags were cleared by START_OF_TURN
		const arbolitInPlay = gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)
		expect(arbolitInPlay.data.hasAttacked).toBe(false)
		expect(arbolitInPlay.data.attacked).toBe(0)
		expect(arbolitInPlay.data.actionsUsed).toEqual([])
		expect(arbolitInPlay.data.energyLostThisTurn).toBe(0)

		const gregaActive = gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card
		expect(gregaActive.data.actionsUsed).toEqual([])

		// Apply un-action
		unmaker.applyUnAction(gameState, startTurnUnActions[0]);

		// Verify state was restored
		expect(gameState.turn).toBe(initialTurn)
		expect(gameState.state.step).toBe(initialStep)
		expect(gameState.state.activePlayer).toBe(initialActivePlayer)

		// Verify card flags were restored
		const arbolitRestored = gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id)
		expect(arbolitRestored.data.hasAttacked).toBe(true)
		expect(arbolitRestored.data.attacked).toBe(1)
		expect(arbolitRestored.data.actionsUsed).toEqual(['SomePower'])
		expect(arbolitRestored.data.energyLostThisTurn).toBe(2)

		const gregaRestored = gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card
		expect(gregaRestored.data.actionsUsed).toEqual(['Flame Geyser'])
	})

	it('Start step action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);
		const tryn = new CardInGame(byName('Tryn'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([tryn]),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		// Set initial state
		gameState.turn = 1;
		gameState.state.step = STEP_PRS_FIRST; // Step 1

		// Capture initial state
		const initialStep = gameState.state.step;

		const unmaker = new Unmaker(gameState)

		// Apply START_STEP to advance to step 2 (Attack)
		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_START_STEP,
			player: ACTIVE_PLAYER,
			step: STEP_ATTACK, // Step 2
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Find the START_STEP un-action
		const startStepUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_START_STEP)
		expect(startStepUnActions).toHaveLength(1)
		expect(startStepUnActions[0].previousStep).toBe(initialStep)

		// Verify step was changed
		expect(gameState.state.step).toBe(STEP_ATTACK)

		// Apply un-action
		unmaker.applyUnAction(gameState, startStepUnActions[0]);

		// Verify step was restored
		expect(gameState.state.step).toBe(initialStep)
	})

	it('Rearrange cards of zone action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		// Create cards for the deck
		const quorOne = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const quorTwo = new CardInGame(byName('Quor'), ACTIVE_PLAYER);
		const fireChogoOne = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);
		const fireChogoTwo = new CardInGame(byName('Fire Chogo'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			// Deck with cards in order: quorOne, quorTwo, fireChogoOne, fireChogoTwo
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER).add([quorOne, quorTwo, fireChogoOne, fireChogoTwo]),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		// Verify initial deck order
		const initialDeck = gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER);
		expect(initialDeck.cards[0].id).toBe(quorOne.id)
		expect(initialDeck.cards[1].id).toBe(quorTwo.id)
		expect(initialDeck.cards[2].id).toBe(fireChogoOne.id)
		expect(initialDeck.cards[3].id).toBe(fireChogoTwo.id)

		const unmaker = new Unmaker(gameState)

		// Rearrange the first 3 cards: fireChogoOne, quorOne, quorTwo
		const newOrder = [fireChogoOne.id, quorOne.id, quorTwo.id]

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
			zone: ZONE_TYPE_DECK,
			zoneOwner: ACTIVE_PLAYER,
			cards: newOrder,
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Verify un-action was captured
		const rearrangeUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE)
		expect(rearrangeUnActions).toHaveLength(1)
		expect(rearrangeUnActions[0].zone).toBe(ZONE_TYPE_DECK)
		expect(rearrangeUnActions[0].zoneOwner).toBe(ACTIVE_PLAYER)
		expect(rearrangeUnActions[0].previousOrder).toEqual([quorOne.id, quorTwo.id, fireChogoOne.id])

		// Verify deck was rearranged
		const rearrangedDeck = gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER);
		expect(rearrangedDeck.cards[0].id).toBe(fireChogoOne.id)
		expect(rearrangedDeck.cards[1].id).toBe(quorOne.id)
		expect(rearrangedDeck.cards[2].id).toBe(quorTwo.id)
		expect(rearrangedDeck.cards[3].id).toBe(fireChogoTwo.id) // Last card unchanged

		// Apply un-action
		unmaker.applyUnAction(gameState, rearrangeUnActions[0]);

		// Verify deck was restored to original order
		const restoredDeck = gameState.getZone(ZONE_TYPE_DECK, ACTIVE_PLAYER);
		expect(restoredDeck.cards[0].id).toBe(quorOne.id)
		expect(restoredDeck.cards[1].id).toBe(quorTwo.id)
		expect(restoredDeck.cards[2].id).toBe(fireChogoOne.id)
		expect(restoredDeck.cards[3].id).toBe(fireChogoTwo.id)
	})

	it('Create continuous effect action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		arbolit.data.controller = ACTIVE_PLAYER;

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		// Verify no continuous effects initially
		expect(gameState.state.continuousEffects).toHaveLength(0)

		const unmaker = new Unmaker(gameState)

		// Create a continuous effect that modifies creature energy
		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [{
				selector: SELECTOR_CREATURES,
				property: PROPERTY_ENERGY_LOSS_THRESHOLD,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: 2,
				},
			}],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 1,
			},
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Verify un-action was captured
		const createEffectUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT)
		expect(createEffectUnActions).toHaveLength(1)
		expect(createEffectUnActions[0].previousLength).toBe(0)

		// Verify continuous effect was created
		expect(gameState.state.continuousEffects).toHaveLength(1)
		expect(gameState.state.continuousEffects[0].player).toBe(ACTIVE_PLAYER)

		// Apply un-action
		unmaker.applyUnAction(gameState, createEffectUnActions[0]);

		// Verify continuous effect was removed
		expect(gameState.state.continuousEffects).toHaveLength(0)
	})

	it('Create multiple continuous effects and undo one', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		const unmaker = new Unmaker(gameState)

		// Create first continuous effect
		const effect1 = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [{
				selector: SELECTOR_CREATURES,
				property: PROPERTY_ENERGY_LOSS_THRESHOLD,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: 1,
				},
			}],
			expiration: {
				type: EXPIRATION_NEVER,
			},
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		}

		gameState.update(effect1);
		expect(gameState.state.continuousEffects).toHaveLength(1)

		// Create second continuous effect
		const effect2 = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
			staticAbilities: [{
				selector: SELECTOR_CREATURES,
				property: PROPERTY_ABLE_TO_ATTACK,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: false,
				},
			}],
			expiration: {
				type: EXPIRATION_ANY_TURNS,
				turns: 2,
			},
			player: ACTIVE_PLAYER,
			generatedBy: grega.id,
		}

		gameState.update(effect2);
		expect(gameState.state.continuousEffects).toHaveLength(2)

		// Verify un-actions were captured
		const createEffectUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT)
		expect(createEffectUnActions).toHaveLength(2)
		expect(createEffectUnActions[0].previousLength).toBe(0)
		expect(createEffectUnActions[1].previousLength).toBe(1)

		// Undo only the second effect
		unmaker.applyUnAction(gameState, createEffectUnActions[1]);

		// Verify only the first continuous effect remains
		expect(gameState.state.continuousEffects).toHaveLength(1)
		expect(gameState.state.continuousEffects[0].staticAbilities[0].property).toBe(PROPERTY_ENERGY_LOSS_THRESHOLD)
	})

	it('Add energy to creature action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		arbolit.data.controller = ACTIVE_PLAYER;

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		// Verify initial energy
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(5)

		const unmaker = new Unmaker(gameState)

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			target: arbolit,
			amount: 3,
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Verify un-action was captured
		const addEnergyUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE)
		expect(addEnergyUnActions).toHaveLength(1)
		expect(addEnergyUnActions[0].creatures).toHaveLength(1)
		expect(addEnergyUnActions[0].creatures[0].id).toBe(arbolit.id)
		expect(addEnergyUnActions[0].creatures[0].energy).toBe(5) // Previous energy before add

		// Verify energy was added
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(8)

		// Apply un-action
		unmaker.applyUnAction(gameState, addEnergyUnActions[0]);

		// Verify energy was restored
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(5)
	})

	it('Add energy to multiple creatures action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(5);
		arbolit.data.controller = ACTIVE_PLAYER;

		const quorPup = new CardInGame(byName('Quor Pup'), ACTIVE_PLAYER).addEnergy(2);
		quorPup.data.controller = ACTIVE_PLAYER;

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(10);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY).add([arbolit, quorPup]),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		// Verify initial energy
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(5)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(quorPup.id).data.energy).toBe(2)

		const unmaker = new Unmaker(gameState)

		const serializedState = gameState.serializeData(ACTIVE_PLAYER, false)

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
			target: [arbolit, quorPup],
			amount: 4,
			generatedBy: grega.id,
		}

		gameState.update(effect);

		// Verify un-action was captured with both creatures
		const addEnergyUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE)
		expect(addEnergyUnActions).toHaveLength(1)
		expect(addEnergyUnActions[0].creatures).toHaveLength(2)
		expect(addEnergyUnActions[0].creatures[0].energy).toBe(5)
		expect(addEnergyUnActions[0].creatures[1].energy).toBe(2)

		// Verify energy was added to both
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(9)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(quorPup.id).data.energy).toBe(6)

		// Apply un-action
		unmaker.applyUnAction(gameState, addEnergyUnActions[0]);

		// Verify energy was restored for both
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id).data.energy).toBe(5)
		expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(quorPup.id).data.energy).toBe(2)

		expect(serializedState).toEqual(gameState.serializeData(ACTIVE_PLAYER, false))
	})

	it('Add energy to magi action', () => {
		const ACTIVE_PLAYER = 0;
		const NON_ACTIVE_PLAYER = 2;

		const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);
		const sinder = new CardInGame(byName('Sinder'), ACTIVE_PLAYER);

		const yaki = new CardInGame(byName('Yaki'), NON_ACTIVE_PLAYER).addEnergy(8);
		const tryn = new CardInGame(byName('Tryn'), NON_ACTIVE_PLAYER);

		const zones = [
			new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).add([grega]),
			new Zone('Active player Magi pile', ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([sinder]),
			new Zone('Active player Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, ACTIVE_PLAYER),
			new Zone('Active player hand', ZONE_TYPE_HAND, ACTIVE_PLAYER),
			new Zone('Active player deck', ZONE_TYPE_DECK, ACTIVE_PLAYER),
			new Zone('Active player discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
			new Zone('NAP current magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([yaki]),
			new Zone('NAP Magi pile', ZONE_TYPE_MAGI_PILE, NON_ACTIVE_PLAYER).add([tryn]),
			new Zone('NAP Defeated Magi', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
			new Zone('NAP hand', ZONE_TYPE_HAND, NON_ACTIVE_PLAYER),
			new Zone('NAP deck', ZONE_TYPE_DECK, NON_ACTIVE_PLAYER),
			new Zone('NAP discard', ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER),
			new Zone('In play', ZONE_TYPE_IN_PLAY),
		];

		const gameState = new moonlands.State({
			zones,
			step: STEP_PRS_FIRST,
			activePlayer: ACTIVE_PLAYER,
		});
		gameState.setPlayers(ACTIVE_PLAYER, NON_ACTIVE_PLAYER);

		gameState.turn = 1;

		// Verify initial energy
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toBe(10)

		const unmaker = new Unmaker(gameState)

		const serializedState = gameState.serializeData(ACTIVE_PLAYER, false)

		const effect = {
			type: moonlands.ACTION_EFFECT,
			effectType: moonlands.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
			target: grega,
			amount: 5,
			generatedBy: yaki.id,
		}

		gameState.update(effect);

		// Verify un-action was captured
		const addEnergyUnActions = unmaker.unActions.filter(ua => ua.type === UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI)
		expect(addEnergyUnActions).toHaveLength(1)
		expect(addEnergyUnActions[0].magi).toHaveLength(1)
		expect(addEnergyUnActions[0].magi[0].id).toBe(grega.id)
		expect(addEnergyUnActions[0].magi[0].energy).toBe(10) // Previous energy before add

		// Verify energy was added
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toBe(15)

		// Apply un-action
		unmaker.applyUnAction(gameState, addEnergyUnActions[0]);

		// Verify energy was restored
		expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toBe(10)

		expect(serializedState).toEqual(gameState.serializeData(ACTIVE_PLAYER, false))
	})
})