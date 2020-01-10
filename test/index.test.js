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

describe('Updating state with action', () => {
    it('Pass action', () => {
        const gameState = new moonlands.State();

        const passAction = {type: moonlands.ACTION_PASS};

        expect(gameState.getCurrentStep()).toEqual(0, 'Intial step is Energize');
        gameState.update(passAction);
        expect(gameState.getCurrentStep()).toEqual(1, 'Final step is PRS');
        gameState.update(passAction);
    });

    it('Pass till second player gets priority', () => {
        const gameState = new moonlands.State();
        const passAction = {type: moonlands.ACTION_PASS};

        expect(gameState.getCurrentStep()).toEqual(0, 'Initial step is Energize');
        gameState.update(passAction); // PRS
        gameState.update(passAction); // Attack
        gameState.update(passAction); // Creatures
        gameState.update(passAction); // PRS
        gameState.update(passAction); // Draw
        gameState.update(passAction); // Energize (player 1)
        expect(gameState.getCurrentStep()).toEqual(0, 'Initial step is Draw');
        expect(gameState.getActivePlayer()).toEqual(1, 'Active player is player 1');
    });

    it('Correct playing priority on each step', () => {
        const gameState = new moonlands.State();
        const passAction = {type: moonlands.ACTION_PASS};

        expect(gameState.getCurrentStep()).toEqual(0, 'Initial step is Energize');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.NO_PRIORITY, 'There is no priority at Energize');
        gameState.update(passAction); // PRS
        expect(gameState.getCurrentStep()).toEqual(1, 'Current step is PRS');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_PRS, 'There is PRS priority at PRS');
        gameState.update(passAction); // Attack
        expect(gameState.getCurrentStep()).toEqual(2, 'Current step is Attack');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_ATTACK, 'There is Attack priority at Attack');
        gameState.update(passAction); // Creatures
        expect(gameState.getCurrentStep()).toEqual(3, 'Current step is Creatures');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_CREATURES, 'There is Creatures priority at Creatures');
        gameState.update(passAction); // PRS
        expect(gameState.getCurrentStep()).toEqual(4, 'Current step is PRS');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.PRIORITY_PRS, 'There is Creatures priority at Creatures');
        gameState.update(passAction); // Draw
        expect(gameState.getCurrentStep()).toEqual(5, 'Current step is Draw');
        expect(gameState.getCurrentPriority()).toEqual(moonlands.NO_PRIORITY, 'There is no priority at Draw');
    });
});

describe('Casting things', () => {
    it('Creating and getting zones', () => {
        const grega = new CardInGame(byName('Grega', 0));
        grega.data.energy = 15;

        const arbolit = new CardInGame(byName('Arbolit', 0));

        const zones = [
            new Zone('Active player hand', ZONE_TYPE_HAND, 0).add([arbolit]),
            new Zone('Non-active player hand', ZONE_TYPE_HAND, 1),
            new Zone('Active player deck', ZONE_TYPE_DECK, 0),
            new Zone('Non-active player deck', ZONE_TYPE_DECK, 1),
            new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, 0).add([grega]),
            new Zone('In play', ZONE_TYPE_IN_PLAY, null),
        ];

        const gameState = new moonlands.State({
            zones,
            step: 3,
            getActivePlayer: 0,
        });

        expect(gameState.getZone(ZONE_TYPE_HAND, 0).length).toEqual(1);
        expect(gameState.getZone(ZONE_TYPE_HAND, 1).length).toEqual(0);
        expect(gameState.getZone(ZONE_TYPE_DECK, 0).length).toEqual(0);
        expect(gameState.getZone(ZONE_TYPE_DECK, 0).length).toEqual(0);
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, 0).length).toEqual(1);
    });

    it('Cast from hand', () => {
        const activePlayer = 0;
        const notActivePlayer = 1;

        const grega = new CardInGame(byName('Grega'), activePlayer);
        grega.addEnergy(15);
        const passAction = {type: moonlands.ACTION_PASS};

        const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

        const zones = [
            new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
            new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
            new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
            new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
            new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([grega]),
            new Zone('In play', ZONE_TYPE_IN_PLAY, null),
        ];

        const gameState = new moonlands.State({
            zones,
            step: 3,
            getActivePlayer: 0,
        });
        
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, "Grega's Energy is 15");

        gameState.update({type:moonlands.ACTION_PLAY, payload: {
            player: 0,
            card: arbolit,
        }});

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Arbolit', 'It is Arbolit');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(13, "Grega's energy is 13");
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(2, "Arbolit's energy is 2");
    });

    it('Cast from hand (region penalty)', () => {
        const activePlayer = 0;
        const notActivePlayer = 1;

        const yaki = new CardInGame(byName('Yaki'), activePlayer);
        yaki.addEnergy(15);
        const passAction = {type: moonlands.ACTION_PASS};

        const arbolit = new CardInGame(byName('Arbolit'), activePlayer);

        const zones = [
            new Zone('Active player hand', ZONE_TYPE_HAND, activePlayer).add([arbolit]),
            new Zone('Non-active player hand', ZONE_TYPE_HAND, notActivePlayer),
            new Zone('Active player deck', ZONE_TYPE_DECK, activePlayer),
            new Zone('Non-active player deck', ZONE_TYPE_DECK, notActivePlayer),
            new Zone('Active player current magi', ZONE_TYPE_ACTIVE_MAGI, activePlayer).add([yaki]),
            new Zone('In play', ZONE_TYPE_IN_PLAY, null),
        ];

        const gameState = new moonlands.State({
            zones,
            step: 3,
            getActivePlayer: 0,
        });
        
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'In play is empty before');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(15, "Yaki's Energy is 15");

        gameState.update({type:moonlands.ACTION_PLAY, payload: {
            player: 0,
            card: arbolit,
        }});

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'In play has one card');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].card.name).toEqual('Arbolit', 'It is Arbolit');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, activePlayer).card.data.energy).toEqual(12, "Yaki's energy is 12");
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).cards[0].data.energy).toEqual(2, "Arbolit's energy is 2");
    });
});