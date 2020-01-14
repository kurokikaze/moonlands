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

    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
} = require('../src/const');

const STEP_ENERGIZE = 0;
const STEP_PRS_FIRST = 1;
const STEP_ATTACK = 2;
const STEP_CREATURES = 3;
const STEP_PRS_SECOND = 4;
const STEP_DRAW = 5;

const createZones = (player1, player2, creatures = [], activeMagi = []) => [
    new Zone('Player 1 hand', ZONE_TYPE_HAND, player1),
    new Zone('Player 2 hand', ZONE_TYPE_HAND, player2),
    new Zone('Player 1 deck', ZONE_TYPE_DECK, player1),
    new Zone('Player 2 deck', ZONE_TYPE_DECK, player2),
    new Zone('Player 1 discard', ZONE_TYPE_DISCARD, player1),
    new Zone('Player 2 discard', ZONE_TYPE_DISCARD, player2),
    new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, player1).add(activeMagi),
    new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, player2),
    new Zone('Player 1 active magi', ZONE_TYPE_MAGI_PILE, player1),
    new Zone('Player 2 active magi', ZONE_TYPE_MAGI_PILE, player2),
    new Zone('In play', ZONE_TYPE_IN_PLAY, null).add(creatures),
];

describe('Alaban', () => {
    it('Undream', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(6);
        const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(2);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: alaban,
            power: alaban.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            target: caveHyren,
            generatedBy: alaban.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Alaban', 'Alaban is in play');
        expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).length).toEqual(1, 'One creature in hand');
        expect(gameState.getZone(ZONE_TYPE_HAND, ACTIVE_PLAYER).card.card.name).toEqual('Cave Hyren', 'Cave Hyren is in hand');
    });

    it('Undream (opponents creature)', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const alaban = new CardInGame(byName('Alaban'), ACTIVE_PLAYER).addEnergy(6);
        const caveHyren = new CardInGame(byName('Cave Hyren'), NON_ACTIVE_PLAYER).addEnergy(2);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, alaban]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: alaban,
            power: alaban.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            target: caveHyren,
            generatedBy: alaban.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One creature in play');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Alaban', 'Alaban is in play');
        expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).length).toEqual(1, 'One creature in opponents hand');
        expect(gameState.getZone(ZONE_TYPE_HAND, NON_ACTIVE_PLAYER).card.card.name).toEqual('Cave Hyren', 'Cave Hyren is in opponents hand');
    });
});

describe('Arbolit', () => {
    it('Healing Flame (own creature)', () => {
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
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: fireGrag,
            generatedBy: arbolit.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(fireGrag.id).data.energy).toEqual(7, 'Fire Grag now has 7 energy');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
    });

    it('Healing Flame (opponent creature)', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

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
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: pharan,
            generatedBy: arbolit.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toEqual(7, 'Pharan now has less than 7 energy');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arbolit', 'Card in Player 1 discard is Arbolit');
    });
});

describe('Arboll', () => {
    it('Life channel', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const arboll = new CardInGame(byName('Arboll'), ACTIVE_PLAYER).addEnergy(2);
        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(5);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [arboll], [grega]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });

        const powerAction = {
            type: ACTION_POWER,
            source: arboll,
            power: arboll.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_MAGI,
            target: grega,
            generatedBy: arboll.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(grega.data.energy).toEqual(9, 'Grega now has 9 energy');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'Arboll removed from play');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Arboll', 'Card in Player 1 discard is Arboll');
    });
});

describe('Balamant', () => {
    it('Hunt', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const balamant = new CardInGame(byName('Balamant'), ACTIVE_PLAYER).addEnergy(6);
        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);

        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [balamant], [grega]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: balamant,
            power: balamant.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_MAGI,
            target: grega,
            generatedBy: balamant.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(balamant.data.energy).toEqual(4, 'Balamant now has 4 energy left');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(6, 'Grega now has 6 energy');
    });
});

describe('Cave Hyren', () => {
    it('Energy Transfer', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(5);
        const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(2);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [caveHyren, fireGrag]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: caveHyren,
            power: caveHyren.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const costChoiceAction = {
            type: ACTION_RESOLVE_PROMPT,
            number: 3,
            generatedBy: caveHyren.id,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: fireGrag,
            generatedBy: caveHyren.id,
        };

        gameState.update(powerAction);
        gameState.update(costChoiceAction);
        gameState.update(targetingAction);

        expect(caveHyren.data.energy).toEqual(2, 'Cave Hyren now has 2 energy');
        expect(fireGrag.data.energy).toEqual(5, 'Fire Grag restored to 5 energy');
    });
});

describe('Diobor', () => {
    it('Fireball', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(6);
        const weebo = new CardInGame(byName('Weebo'), NON_ACTIVE_PLAYER).addEnergy(3);

        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, diobor]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: diobor,
            power: diobor.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: weebo,
            generatedBy: diobor.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(weebo.id).data.energy).toEqual(1, 'Weebo now has 1 energy');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one card is now in play');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Weebo', 'Card in play is Weebo');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one card is now in player one discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).card.card.name).toEqual('Diobor', 'Card in player one discard is Diobor');
    });

    it('Energy Transfer', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const diobor = new CardInGame(byName('Diobor'), ACTIVE_PLAYER).addEnergy(6);
        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(10);

        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [diobor], [grega]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: diobor,
            power: diobor.card.data.powers[1],
            player: ACTIVE_PLAYER,
        };

        const costChoiceAction = {
            type: ACTION_RESOLVE_PROMPT,
            number: 3,
            generatedBy: diobor.id,
        };

        gameState.update(powerAction);
        gameState.update(costChoiceAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(diobor.id).data.energy).toEqual(3, 'Diobor now has 3 energy left');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(13, 'Grega now has 13 energy');
    });
});

describe('Drakan', () => {
    it('Thermal Blast', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const drakan = new CardInGame(byName('Drakan'), ACTIVE_PLAYER).addEnergy(6);
        const caveHyren = new CardInGame(byName('Cave Hyren'), ACTIVE_PLAYER).addEnergy(7);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [drakan, caveHyren]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: drakan,
            power: drakan.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: caveHyren,
            generatedBy: drakan.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(caveHyren.data.energy).toBeLessThan(7, 'Cave Hyren now has <7 energy');
        expect(caveHyren.data.energy).toBeGreaterThan(0, 'Cave Hyren now has >0 energy');
        expect(drakan.data.energy).toEqual(3, 'Drakan has now 3 energy');
    });
});

describe('Ayebaw', () => {
    it('can attack twice per turn', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;
        const ayebaw = new CardInGame(byName('Ayebaw'), ACTIVE_PLAYER);
        ayebaw.addEnergy(2);
        const grega = new CardInGame(byName('Grega'), NON_ACTIVE_PLAYER);
        grega.addEnergy(10);

        const gameState = new moonlands.State({
            zones: [
                new Zone('AP Discard', ZONE_TYPE_DISCARD, ACTIVE_PLAYER),
                new Zone('NAP Discard', ZONE_TYPE_DEFEATED_MAGI, NON_ACTIVE_PLAYER),
                new Zone('NAP Active Magi', ZONE_TYPE_ACTIVE_MAGI, NON_ACTIVE_PLAYER).add([grega]),
                new Zone('In play', ZONE_TYPE_IN_PLAY, null).add([ayebaw]),
            ],
            step: STEP_ATTACK,
            activePlayer: ACTIVE_PLAYER,
        });

        const attackAction = {
            type: moonlands.ACTION_ATTACK,
            source: ayebaw,
            target: grega,
        };

        gameState.update(attackAction);

        expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
        expect(grega.data.energy).toEqual(8, 'Grega has 8 energy left');

        gameState.update(attackAction);

        expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
        expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (second attack connected)');

        gameState.update(attackAction);

        expect(ayebaw.data.energy).toEqual(2, 'Ayebaw still has 2 energy');
        expect(grega.data.energy).toEqual(6, 'Grega has 6 energy left (third attack did not happen)');
    });
});

describe('Giant Parathin', () => {
    it('Interchange', () => {
        const ACTIVE_PLAYER = 5;
        const NON_ACTIVE_PLAYER = 15;

        const giantParathin = new CardInGame(byName('Giant Parathin'), ACTIVE_PLAYER).addEnergy(10);
        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
        const yaki = new CardInGame(byName('Yaki'), ACTIVE_PLAYER);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [giantParathin], [grega]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).add([yaki]);

        const powerAction = {
            type: ACTION_POWER,
            source: giantParathin,
            power: giantParathin.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'One card in play');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Grega', 'Grega is active Magi');
        expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
        expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Yaki', 'Yaki is in pile');

        gameState.update(powerAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(0, 'No cards in play');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).length).toEqual(1, 'One magi is active');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.card.name).toEqual('Yaki', 'Yaki is active Magi');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI, ACTIVE_PLAYER).card.data.energy).toEqual(14, 'Yaki has 14 energy');
        expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).length).toEqual(1, 'One magi in pile');
        expect(gameState.getZone(ZONE_TYPE_MAGI_PILE, ACTIVE_PLAYER).card.card.name).toEqual('Grega', 'Grega is in pile');
    });
});

describe('Great Carillion', () => {
    it('Stomp', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const greatCarillion = new CardInGame(byName('Great Carillion'), ACTIVE_PLAYER).addEnergy(8);
        const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(2);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [greatCarillion, pharan]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });

        const powerAction = {
            type: ACTION_POWER,
            source: greatCarillion,
            power: greatCarillion.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: pharan,
            generatedBy: greatCarillion.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).length).toEqual(1, 'Only one creature in play');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).card.card.name).toEqual('Great Carillion', 'It is Great Carillion');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).length).toEqual(1, 'One card in Player 2 discard');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, NON_ACTIVE_PLAYER).card.card.name).toEqual('Pharan', 'It is Pharan');
    });
});

describe('Grega', () => {
    it('Thermal blast', () => {
        const ACTIVE_PLAYER = 422;
        const NON_ACTIVE_PLAYER = 1310;

        const grega = new CardInGame(byName('Grega'), ACTIVE_PLAYER).addEnergy(4);
        const pharan = new CardInGame(byName('Pharan'), NON_ACTIVE_PLAYER).addEnergy(7);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [pharan], [grega]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });

        const powerAction = {
            type: ACTION_POWER,
            source: grega,
            power: grega.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: pharan,
            generatedBy: grega.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeLessThan(7, 'Pharan now has less than 7 energy');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(pharan.id).data.energy).toBeGreaterThan(0, 'Fire Grag now more than 0 energy');
        expect(gameState.getZone(ZONE_TYPE_DISCARD, ACTIVE_PLAYER).length).toEqual(0, 'No cards in Player 1 discard');
        expect(gameState.getZone(ZONE_TYPE_ACTIVE_MAGI).card.data.energy).toEqual(2, 'Grega now has 2 energy');
    });
});

describe('Weebo', () => {
    it('Vitalize', () => {
        const ACTIVE_PLAYER = 0;
        const NON_ACTIVE_PLAYER = 1;

        const weebo = new CardInGame(byName('Weebo'), ACTIVE_PLAYER).addEnergy(3);
        const fireGrag = new CardInGame(byName('Fire Grag'), ACTIVE_PLAYER).addEnergy(4);
        const zones = createZones(ACTIVE_PLAYER, NON_ACTIVE_PLAYER, [weebo, fireGrag]);

        const gameState = new moonlands.State({
            zones,
            step: STEP_PRS_SECOND,
            activePlayer: ACTIVE_PLAYER,
        });        

        const powerAction = {
            type: ACTION_POWER,
            source: weebo,
            power: weebo.card.data.powers[0],
            player: ACTIVE_PLAYER,
        };

        const targetingAction = {
            type: ACTION_RESOLVE_PROMPT,
            promptType: PROMPT_TYPE_SINGLE_CREATURE,
            target: fireGrag,
            generatedBy: weebo.id,
        };

        gameState.update(powerAction);
        gameState.update(targetingAction);

        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(weebo.id).data.energy).toEqual(1, 'Weebo now has 1 energy');
        expect(gameState.getZone(ZONE_TYPE_IN_PLAY).byId(fireGrag.id).data.energy).toEqual(6, 'Fire Grag restored to 6 energy');
    });
});
