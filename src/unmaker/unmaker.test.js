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
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,

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

		console.log(JSON.stringify(unmaker.unActions, null, 2))
    })
})