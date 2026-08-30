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
    ACTION_EFFECT,
    EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
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

    // state.enableDebug();
    return state;
}

function snapshot(state: State): string {
    return JSON.stringify(state.serializeData(PLAYER, false), null, 2);
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

describe('Engine bug - PLAY Fog Bank attached to creature when no creatures in play', () => {
    it('does not crash when Fog Bank prompt is resolved with no own creatures', () => {
        const fogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const adis    = new CardInGame(byName('Adis') as Card, PLAYER).addEnergy(15);
        const sinder  = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        // No PLAYER creatures in play – '$target' will be null after prompt resolves.
        const state = makeState(STEP_PRS1, [], [fogBank], [], adis, sinder);

        const fogBankCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(fogBank.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: fogBankCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        // Resolving the own_creature prompt with null/empty selection should not crash.
        expect(() => {
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                cards: [],
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);
        }).not.toThrow();

        // Fog Bank should NOT be in play (play was aborted due to no valid target).
        const fogBankInPlay = state.getZone(ZONE_TYPE_IN_PLAY).cards.find((c: any) => c.card.name === 'Fog Bank');
        expect(fogBankInPlay).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// Arderial bug E – POWER resolve: Alaban's Undream (full resolution)
//   effects/return_creature_discarding_energy is not handled by the Unmaker.
//   After the creature prompt resolves, the Unmaker may crash accessing
//   Alaban's id after it has been discarded (null → 'id').
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER return_creature_discarding_energy resolved (Alaban Undream)', () => {
    it('reverts state correctly after Undream resolves', () => {
        const alaban  = new CardInGame(byName('Alaban') as Card, PLAYER).addEnergy(6);
        const lovian  = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(3);
        const adis   = new CardInGame(byName('Adis')   as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [alaban, lovian], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (alaban.card.data.powers as any[]).find(p => p.name === 'Undream');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: alaban, power, player: PLAYER } as any);

        // Resolve the creature prompt with Lovian as the return target.
        const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug F – PLAY spell: Updraft (return_creature_returning_energy)
//   effects/return_creature_returning_energy is not handled by the Unmaker.
//   Energy is moved from the creature back to the magi, and the creature
//   returns to hand; the Unmaker cannot record/revert this composite effect.
// ---------------------------------------------------------------------------
describe('Unmaker bug – PLAY spell return_creature_returning_energy (Updraft)', () => {
    it('reverts state correctly after Updraft returns a creature', () => {
        const updraft = new CardInGame(byName('Updraft') as Card, PLAYER);
        const lovian  = new CardInGame(byName('Lovian') as Card, PLAYER).addEnergy(3);
        const adis   = new CardInGame(byName('Adis')   as Card, PLAYER).addEnergy(10);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [lovian], [updraft], [], adis, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const updraftCard = state.getZone(ZONE_TYPE_HAND, PLAYER).byId(updraft.id)!;
        state.update({ type: ACTION_PLAY, payload: { card: updraftCard, player: PLAYER }, forcePriority: false, player: PLAYER } as any);

        // Resolve own_creature prompt: return Lovian to hand.
        const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(lovian.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug G – POWER: Cloud Sceptre's Mindwinds
//   effects/move_cards_between_zones and effects/draw_n_cards are not handled
//   by the Unmaker.  After resolving the "choose up to 5 hand cards to discard"
//   prompt, cards move between zones and new cards are drawn; these cannot be
//   recorded or reverted.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER move_cards_between_zones + draw_n_cards (Cloud Sceptre Mindwinds)', () => {
    it('reverts state correctly after Mindwinds discards and redraws', () => {
        const sceptre    = new CardInGame(byName('Cloud Sceptre') as Card, PLAYER);
        const adis       = new CardInGame(byName('Adis')          as Card, PLAYER).addEnergy(10);
        const sinder     = new CardInGame(byName('Sinder')        as Card, OPPONENT).addEnergy(6);
        const handCards  = ['Lovian', 'Orish', 'Thunder Hyren'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );
        const deckCards  = ['Xyx', 'Vellup', 'Ayebaw'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [sceptre], handCards, deckCards, adis, sinder);
        const before = snapshot(state);

        const power = (sceptre.card.data.powers as any[]).find(p => p.name === 'Mindwinds');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: sceptre, power, player: PLAYER } as any);

        // Resolve: choose 2 hand cards to discard.
        const hand = state.getZone(ZONE_TYPE_HAND, PLAYER).cards as CardInGame[];
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            zone: ZONE_TYPE_HAND,
            zoneOwner: PLAYER,
            cards: hand.slice(0, 2),
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Arderial bug H – POWER: Eye of the Storm Energy Boost (roll = 1)
//   When the die shows 1, effects/move_cards_between_zones moves the hand to
//   discard.  This effect is not handled by the Unmaker.
//   PRNG seed 7 produces roll = 1 for this power.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with move_cards_between_zones discard hand (Eye of the Storm roll=1)', () => {
    it('reverts state correctly after Energy Boost discards the hand', () => {
        const eye      = new CardInGame(byName('Eye of the Storm') as Card, PLAYER);
        const adis     = new CardInGame(byName('Adis')             as Card, PLAYER).addEnergy(10);
        const sinder   = new CardInGame(byName('Sinder')           as Card, OPPONENT).addEnergy(6);
        const handCards = ['Lovian', 'Orish', 'Thunder Hyren'].map(
            name => new CardInGame(byName(name) as Card, PLAYER),
        );

        const state = makeState(STEP_PRS1, [eye], handCards, [], adis, sinder);
        state.initiatePRNG(7); // seed 7 → die rolls 1 → discard hand path
        const before = snapshot(state);

        const power = (eye.card.data.powers as any[]).find(p => p.name === 'Energy Boost');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: eye, power, player: PLAYER } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// cards.js bug – Cyclone Vashp's Cyclone power
//   The third effect has target: 'ownCreature' (missing '$' prefix) instead of
//   target: '$ownCreature'.  When the engine dispatches DISCARD_CREATURE_FROM_PLAY
//   with this raw string as target, convertServerCommand does:
//     'length' in 'ownCreature'  →  TypeError (cannot use 'in' on primitive).
// ---------------------------------------------------------------------------
describe('cards.js bug – Cyclone Vashp Cyclone: DISCARD_CREATURE_FROM_PLAY with target $ownCreature', () => {
    it('reverts state correctly after Cyclone fully resolves', () => {
        const vashp   = new CardInGame(byName('Cyclone Vashp') as Card, PLAYER).addEnergy(5);
        const target  = new CardInGame(byName('Furok')         as Card, OPPONENT).addEnergy(4);
        const adis    = new CardInGame(byName('Adis')          as Card, PLAYER).addEnergy(10);
        const sinder  = new CardInGame(byName('Sinder')        as Card, OPPONENT).addEnergy(6);

        const state = makeState(STEP_PRS1, [vashp, target], [], [], adis, sinder);
        const before = snapshot(state);

        const power = (vashp.card.data.powers as any[]).find(p => p.name === 'Cyclone');
        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        state.update({ type: ACTION_POWER, source: vashp, power, player: PLAYER } as any);

        // Resolve first prompt: choose own creature (Vashp itself)
        const ownTarget = state.getZone(ZONE_TYPE_IN_PLAY).byId(vashp.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: ownTarget,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        // Resolve second prompt: choose opponent's creature
        const oppTarget = state.getZone(ZONE_TYPE_IN_PLAY).byId(target.id)!;
        state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: oppTarget,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any);

        unmaker.revertToCheckpoint();
        expect(snapshot(state)).toBe(before);
    });
});

// ---------------------------------------------------------------------------
// Unmaker regression – Firestorm checkpoint stability
//   Firestorm chains prompt + discard creature + region-based selects and
//   discard energy effects. Repeating this branch many times should not cause
//   pointer/unaction drift after each revert.
// ---------------------------------------------------------------------------
describe('Unmaker bug – Firestorm repeated branch does not leak unmake state', () => {
    it('keeps pointer and unaction counts stable across repeated power+prompt reverts', () => {
        const lavaAq  = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
        const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
        const weebo   = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
        const arboll  = new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2);
        const grega   = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
        const pruitt  = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

        const state = makeState(STEP_PRS1, [lavaAq, arbolit, weebo, arboll], [], [], grega, pruitt);
        const normalizePromptType = (data: any) => {
            if (data && data.promptType === '') {
                data.promptType = null;
            }
            return data;
        };
        const before = normalizePromptType(state.serializeData(PLAYER, false) as any);

        const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
        expect(firestorm).toBeTruthy();

        const unmaker = new Unmaker(state);

        for (let i = 0; i < 25; i++) {
            const checkpointPointer = unmaker.getPointer();
            const checkpointUnActions = unmaker.numberOfUnActions;

            unmaker.setCheckpoint();

            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);

            const branchExpansion = unmaker.numberOfUnActions - checkpointUnActions;
            expect(branchExpansion).toBeGreaterThan(6);

            unmaker.revertToCheckpoint();

            expect(unmaker.getPointer()).toBe(checkpointPointer);
            expect(unmaker.numberOfUnActions).toBe(checkpointUnActions);
            const after = normalizePromptType(state.serializeData(PLAYER, false) as any);
            expect(after).toEqual(before);
        }
    });

    it('does not leak unmake storage after revert as Firestorm hits more non-Cald cards', () => {
        const runScenario = (extraOppCreatures: number) => {
            const lavaAq  = new CardInGame(byName('Lava Aq') as Card, PLAYER).addEnergy(6);
            const arbolit = new CardInGame(byName('Arbolit') as Card, PLAYER).addEnergy(2);
            const weebo   = new CardInGame(byName('Weebo') as Card, OPPONENT).addEnergy(2);
            const baseInPlay: CardInGame[] = [lavaAq, arbolit, weebo];

            for (let i = 0; i < extraOppCreatures; i++) {
                baseInPlay.push(new CardInGame(byName('Arboll') as Card, OPPONENT).addEnergy(2));
            }

            const grega  = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(8);
            const pruitt = new CardInGame(byName('Pruitt') as Card, OPPONENT).addEnergy(8);

            const state = makeState(STEP_PRS1, baseInPlay, [], [], grega, pruitt);
            const firestorm = (lavaAq.card.data.powers as any[]).find(p => p.name === 'Firestorm');
            expect(firestorm).toBeTruthy();

            const unmaker = new Unmaker(state);
            const beforePointer = unmaker.getPointer();
            const beforeUnActions = unmaker.numberOfUnActions;
            const beforeObjects = (unmaker as any).objects.length;
            const beforeStrings = (unmaker as any).strings.length;

            unmaker.setCheckpoint();
            state.update({ type: ACTION_POWER, source: lavaAq, power: firestorm, player: PLAYER } as any);

            const target = state.getZone(ZONE_TYPE_IN_PLAY).byId(arbolit.id);
            expect(target).toBeTruthy();
            state.update({
                type: ACTION_RESOLVE_PROMPT,
                target,
                generatedBy: (state.state as any).promptGeneratedBy,
                player: PLAYER,
            } as any);

            const actionDelta = unmaker.numberOfUnActions - beforeUnActions;
            const pointerDelta = unmaker.getPointer() - beforePointer;

            unmaker.revertToCheckpoint();

            const postRevertPointerDelta = unmaker.getPointer() - beforePointer;
            const postRevertActionDelta = unmaker.numberOfUnActions - beforeUnActions;
            const postRevertObjectDelta = (unmaker as any).objects.length - beforeObjects;
            const postRevertStringDelta = (unmaker as any).strings.length - beforeStrings;

            expect(postRevertPointerDelta).toBe(0);
            expect(postRevertActionDelta).toBe(0);
            expect(postRevertObjectDelta).toBe(0);
            expect(postRevertStringDelta).toBe(0);

            return {
                actionDelta,
                pointerDelta,
                postRevertActionDelta,
                postRevertPointerDelta,
                postRevertObjectDelta,
                postRevertStringDelta,
            };
        };

        const smallBoard = runScenario(0);
        const largeBoard = runScenario(4);

        expect(largeBoard.actionDelta).toBeGreaterThan(smallBoard.actionDelta);
        expect(largeBoard.pointerDelta).toBeGreaterThanOrEqual(smallBoard.pointerDelta);
        expect(largeBoard.postRevertActionDelta).toBe(0);
        expect(largeBoard.postRevertPointerDelta).toBe(0);
        expect(largeBoard.postRevertObjectDelta).toBe(0);
        expect(largeBoard.postRevertStringDelta).toBe(0);
    });
});


// ---------------------------------------------------------------------------
// Engine regression signal – stale move target id
//   Reproduces the deterministic failure where a move action references a card
//   id that is not present in the declared source zone.
// ---------------------------------------------------------------------------
describe.only('Engine invariant - MOVE_CARD_BETWEEN_ZONES with stale source id', () => {
    it('throws MOVE_ZONE_MISSING_SOURCE and does not clone card into destination', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const handFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const staleFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);

        const state = makeState(STEP_PRS1, [], [handFogBank], [], grega, sinder);

        const handBefore = state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map((card: CardInGame) => card.id);
        const inPlayBefore = state.getZone(ZONE_TYPE_IN_PLAY).cards.map((card: CardInGame) => card.id);

        expect(() => state.update({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: staleFogBank,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_IN_PLAY,
            generatedBy: staleFogBank.id,
            bottom: false,
        } as any)).toThrow('[MOVE_ZONE_MISSING_SOURCE]');

        const handAfter = state.getZone(ZONE_TYPE_HAND, PLAYER).cards.map((card: CardInGame) => card.id);
        const inPlayAfter = state.getZone(ZONE_TYPE_IN_PLAY).cards.map((card: CardInGame) => card.id);

        expect(handAfter).toEqual(handBefore);
        expect(inPlayAfter).toEqual(inPlayBefore);
        expect(state.getZone(ZONE_TYPE_HAND, PLAYER).containsId(handFogBank.id)).toBe(true);
        expect(state.getZone(ZONE_TYPE_IN_PLAY).containsId(staleFogBank.id)).toBe(false);
    });

    it('keeps Unmaker checkpoint revert safe after stale move throw', () => {
        const grega = new CardInGame(byName('Grega') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const handFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const staleFogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);

        const state = makeState(STEP_PRS1, [], [handFogBank], [], grega, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const checkpointPointer = unmaker.getPointer();
        const checkpointUnActions = unmaker.numberOfUnActions;

        expect(() => state.update({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: staleFogBank,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_IN_PLAY,
            generatedBy: staleFogBank.id,
            bottom: false,
        } as any)).toThrow('[MOVE_ZONE_MISSING_SOURCE]');

        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
        expect(unmaker.getPointer()).toBe(checkpointPointer);
        expect(unmaker.numberOfUnActions).toBe(checkpointUnActions);
        expect(snapshot(state)).toBe(before);
    });

    it.only('Playing Fog Bank and then reverting to checkpoint breaks the state', () => {
        const ora = new CardInGame(byName('Ora') as Card, PLAYER).addEnergy(12);
        const sinder = new CardInGame(byName('Sinder') as Card, OPPONENT).addEnergy(8);

        const fogBank = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const vellup = new CardInGame(byName('Vellup') as Card, PLAYER).addEnergy(1);
        const fogBank2 = new CardInGame(byName('Fog Bank') as Card, PLAYER);
        const vellup2 = new CardInGame(byName('Vellup') as Card, PLAYER);
        vellup.data.energyLostThisTurn = 2;

        const state = makeState(STEP_PRS1, [vellup], [fogBank2, vellup2, fogBank], [], ora, sinder);
        const before = snapshot(state);

        const unmaker = new Unmaker(state);
        unmaker.setCheckpoint();

        const checkpointPointer = unmaker.getPointer();
        const checkpointUnActions = unmaker.numberOfUnActions;

        expect(() => state.update({
            type: ACTION_PLAY,
            payload: { card: fogBank, player: PLAYER },
        } as any)).not.toThrow();

        const before2 = snapshot(state);
        unmaker.setCheckpoint();

        expect(() => state.update({
            type: ACTION_RESOLVE_PROMPT,
            target: vellup,
            generatedBy: (state.state as any).promptGeneratedBy,
            player: PLAYER,
        } as any)).not.toThrow();

        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
        expect(snapshot(state)).toBe(before2);

        expect(() => unmaker.revertToCheckpoint()).not.toThrow();
        expect(unmaker.getPointer()).toBe(checkpointPointer);
        expect(unmaker.numberOfUnActions).toBe(checkpointUnActions);
        expect(snapshot(state)).toBe(before);
    });
});

