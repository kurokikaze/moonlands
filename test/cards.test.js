const moonlands = require('../src/index');
const {CardInGame, byName} = require('../src/cards');
const {
    Zone,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_MAGI_PILE,
    ZONE_TYPE_DEFEATED_MAGI,
    ZONE_TYPE_DECK,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_HAND,
} = require('../src/zone');
const {
    ACTION_POWER,
    ACTION_RESOLVE_PROMPT,

    STEP_ENERGIZE,
    STEP_PRS_FIRST,
    STEP_ATTACK,
    STEP_CREATURES,
    STEP_PRS_SECOND,
    STEP_DRAW,
} = require('../src/const');

const createZones = (player1, player2, creatures) => [
    new Zone('Player 1 hand', ZONE_TYPE_HAND, player1),
    new Zone('Player 2 hand', ZONE_TYPE_HAND, player2),
    new Zone('Player 1 deck', ZONE_TYPE_DECK, player1),
    new Zone('Player 2 deck', ZONE_TYPE_DECK, player2),
    new Zone('Player 1 discard', ZONE_TYPE_DISCARD, player1),
    new Zone('Player 2 discard', ZONE_TYPE_DISCARD, player2),
    new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, player1),
    new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, player2),
    new Zone('In play', ZONE_TYPE_IN_PLAY, null).add(creatures),
];

describe('Arbolit', () => {
    it('Healing another own creature', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(2);
        const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, fireGrag]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });

        const powerAction = {
            type: ACTION_POWER,
            source: arbolit,
            power: arbolit.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: moonlands.PROMPT_TYPE_SINGLE_CREATURE,
            target: fireGrag,
            generatedBy: arbolit.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(fireGrag.id).data.energy).toEqual(7, 'Fire Grag now has 7 energy');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
    });

    it('Healing opponent creature', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const arbolit = new CardInGame(byName('Arbolit'), ACTIVE_PLAYER).addEnergy(2);
        const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arbolit, pharan]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });

        const powerAction = {
            type: ACTION_POWER,
            source: arbolit,
            power: arbolit.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: moonlands.PROMPT_TYPE_SINGLE_CREATURE,
            target: pharan,
            generatedBy: arbolit.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(7, 'Pharan now has 7 energy');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
    });
});
