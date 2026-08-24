// Tests that isolate the known Unmaker revert bugs.
// Each test: save state → setCheckpoint → sim.update(…) → revertToCheckpoint
// → assert serialized state equals the saved snapshot.
import { State } from '../index';
import { byName } from '../cards';
import Card from '../classes/Card';
import CardInGame from '../classes/CardInGame';
import Zone from '../classes/Zone';
import { Unmaker } from '../unmaker/unmaker';
import {
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_RESOLVE_PROMPT,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DECK,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_MAGI_PILE,
    ZONE_TYPE_DEFEATED_MAGI,
} from '../const';

const PLAYER = 1;
const OPPONENT = 2;
const STEP_PRS1 = 1;

/** Minimal zone set that satisfies State requirements. */
function makeZones(inPlay: CardInGame[] = [], hand: CardInGame[] = [], deck: CardInGame[] = []): Zone[] {
    return [
        new Zone('P1 hand',    ZONE_TYPE_HAND,           PLAYER),
        new Zone('P2 hand',    ZONE_TYPE_HAND,           OPPONENT),
        new Zone('P1 deck',    ZONE_TYPE_DECK,           PLAYER),
        new Zone('P2 deck',    ZONE_TYPE_DECK,           OPPONENT),
        new Zone('P1 discard', ZONE_TYPE_DISCARD,        PLAYER),
        new Zone('P2 discard', ZONE_TYPE_DISCARD,        OPPONENT),
        new Zone('P1 magi',    ZONE_TYPE_ACTIVE_MAGI,    PLAYER),
        new Zone('P2 magi',    ZONE_TYPE_ACTIVE_MAGI,    OPPONENT),
        new Zone('P1 pile',    ZONE_TYPE_MAGI_PILE,      PLAYER),
        new Zone('P2 pile',    ZONE_TYPE_MAGI_PILE,      OPPONENT),
        new Zone('P1 def',     ZONE_TYPE_DEFEATED_MAGI,  PLAYER),
        new Zone('P2 def',     ZONE_TYPE_DEFEATED_MAGI,  OPPONENT),
        new Zone('In play',    ZONE_TYPE_IN_PLAY,        null).add(inPlay),
    ];
}

function makeState(
    step = STEP_PRS1,
    inPlay: CardInGame[] = [],
    hand: CardInGame[] = [],
    deck: CardInGame[] = [],
    activeMagi?: CardInGame,
    opponentMagi?: CardInGame,
): State {
    const zones = makeZones(inPlay);
    // @ts-ignore
    const state = new State({ zones, step, activePlayer: PLAYER });
    state.setPlayers(PLAYER, OPPONENT);

    if (hand.length)  state.getZone(ZONE_TYPE_HAND, PLAYER).add(hand);
    if (deck.length)  state.getZone(ZONE_TYPE_DECK, PLAYER).add(deck);
    if (activeMagi)   state.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER).add([activeMagi]);
    if (opponentMagi) state.getZone(ZONE_TYPE_ACTIVE_MAGI, OPPONENT).add([opponentMagi]);

    state.enableDebug();
    return state;
}

function snapshot(state: State): string {
    return JSON.stringify(state.serializeData(PLAYER, false));
}

// ---------------------------------------------------------------------------
// Bug 1 – POWER: Arboll's Life Channel
//   Unmaker.generateUnAction line 658 throws null (reading 'id')
//   because the source creature (Arboll) is referenced after being discarded.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with prompt (Life Channel)', () => {
    it('reverts state correctly after Life Channel power is applied', () => {
        const arboll = new CardInGame(byName('Arboll') as Card, PLAYER).addEnergy(3);
        const grega  = new CardInGame(byName('Grega')  as Card, PLAYER).addEnergy(8);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [arboll], [], [], grega, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const power = (arboll.card.data.powers as any[]).find(p => p.name === 'Life Channel');
        state.update({ type: ACTION_POWER, source: arboll, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();

        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Bug 2 – CARDS_ORDER: Barak's Prophecy rearrange
//   Unmaker.generateUnAction line 560 throws null (reading 'length')
//   when recording the un-action for effects/rearrange_cards_of_zone.
// ---------------------------------------------------------------------------
describe('Unmaker bug - CARDS_ORDER (Barak Prophecy rearrange)', () => {
    it('reverts state correctly after CARDS_ORDER prompt resolution', () => {
        // Barak's power: look at top 4 cards of deck and rearrange them.
        const barak = new CardInGame(byName('Barak') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        // Four deck cards that Prophecy will expose.
        const deckCards = ['Fire Chogo', 'Lava Aq', 'Magma Hyren', 'Diobor'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [], [], deckCards, barak, sinder);

        // Apply the Prophecy power first (outside the checkpoint under test)
        // so the state is already in the rearrange-prompt.
        const prophecyPower = (barak.card.data.powers as any[]).find(p => p.name === 'Prophecy');
        state.update({ type: ACTION_POWER, source: barak, power: prophecyPower, player: PLAYER } as any);

        const before = snapshot(state);

        // Now test that CARDS_ORDER (resolving the rearrange) can be cleanly reverted.
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const topFourIds = state.getZone(ZONE_TYPE_DECK, PLAYER).cards.slice(0, 4).map((c: CardInGame) => c.id);
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            cards: [...topFourIds].reverse(),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();

        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Bug 3 – PLAY spell with effects/roll_die (Grow)
//   The game log is not reverted by the Unmaker.
//   PRNG state is already tracked correctly (die roll produces the same result).
// ---------------------------------------------------------------------------
describe('Unmaker bug - PLAY with roll_die (Grow)', () => {
    it('reverts the game log after Grow is played', () => {
        const grow = new CardInGame(byName('Grow') as Card, PLAYER);
        const poad = new CardInGame(byName('Poad') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const furok = new CardInGame(byName('Furok') as Card, PLAYER).addEnergy(3);

        const state = makeState(STEP_PRS1, [furok], [grow], [], poad, sinder);
        const logBefore = (state.serializeData(PLAYER, false) as any).log?.length ?? 0;

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const growCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        unmaker.revertToCheckpoint();

        const logAfter = (state.serializeData(PLAYER, false) as any).log?.length ?? 0;
        expect(logAfter).toBe(logBefore);
    });

    it('produces the same die roll result after revert (PRNG is tracked)', () => {
        const grow1 = new CardInGame(byName('Grow') as Card, PLAYER);
        const grow2 = new CardInGame(byName('Grow') as Card, PLAYER);
        const poad  = new CardInGame(byName('Poad') as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);
        const furok = new CardInGame(byName('Furok') as Card, PLAYER).addEnergy(3);

        const state = makeState(STEP_PRS1, [furok], [grow1, grow2], [], poad, sinder);
        state.initiatePRNG(42);
        const getDieRoll = () => {
            const log: any[] = (state.serializeData(PLAYER, false) as any).log ?? [];
            const entry = log.find((e: any) => e.type === 'log_entry/die_rolled');
            return entry?.result ?? null;
        };

        const unmaker = new Unmaker(state);

        unmaker.setCheckpoint();
        const growCard1a = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow1.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard1a, player: PLAYER }, forcePriority: false, player: PLAYER } as any);
        const firstRoll = getDieRoll();
        unmaker.revertToCheckpoint();

        unmaker.setCheckpoint();
        const growCard1b = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(grow1.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: growCard1b, player: PLAYER }, forcePriority: false, player: PLAYER } as any);
        const secondRoll = getDieRoll();
        unmaker.revertToCheckpoint();

        expect(secondRoll).toBe(firstRoll);
    });
});
