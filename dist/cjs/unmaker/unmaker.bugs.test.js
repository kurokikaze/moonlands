"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Tests that isolate the known Unmaker revert bugs.
// Each test: save state → setCheckpoint → sim.update(…) → revertToCheckpoint
// → assert serialized state equals the saved snapshot.
const index_1 = require("../index");
const cards_1 = require("../cards");
const CardInGame_1 = __importDefault(require("../classes/CardInGame"));
const Zone_1 = __importDefault(require("../classes/Zone"));
const unmaker_1 = require("../unmaker/unmaker");
const const_1 = require("../const");
const PLAYER = 1;
const OPPONENT = 2;
const STEP_PRS1 = 1;
/** Minimal zone set that satisfies State requirements. */
function makeZones(inPlay = [], hand = [], deck = []) {
    return [
        new Zone_1.default('P1 hand', const_1.ZONE_TYPE_HAND, PLAYER),
        new Zone_1.default('P2 hand', const_1.ZONE_TYPE_HAND, OPPONENT),
        new Zone_1.default('P1 deck', const_1.ZONE_TYPE_DECK, PLAYER),
        new Zone_1.default('P2 deck', const_1.ZONE_TYPE_DECK, OPPONENT),
        new Zone_1.default('P1 discard', const_1.ZONE_TYPE_DISCARD, PLAYER),
        new Zone_1.default('P2 discard', const_1.ZONE_TYPE_DISCARD, OPPONENT),
        new Zone_1.default('P1 magi', const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER),
        new Zone_1.default('P2 magi', const_1.ZONE_TYPE_ACTIVE_MAGI, OPPONENT),
        new Zone_1.default('P1 pile', const_1.ZONE_TYPE_MAGI_PILE, PLAYER),
        new Zone_1.default('P2 pile', const_1.ZONE_TYPE_MAGI_PILE, OPPONENT),
        new Zone_1.default('P1 def', const_1.ZONE_TYPE_DEFEATED_MAGI, PLAYER),
        new Zone_1.default('P2 def', const_1.ZONE_TYPE_DEFEATED_MAGI, OPPONENT),
        new Zone_1.default('In play', const_1.ZONE_TYPE_IN_PLAY, null).add(inPlay),
    ];
}
function makeState(step = STEP_PRS1, inPlay = [], hand = [], deck = [], activeMagi, opponentMagi) {
    const zones = makeZones(inPlay);
    // @ts-ignore
    const state = new index_1.State({ zones, step, activePlayer: PLAYER });
    state.setPlayers(PLAYER, OPPONENT);
    if (hand.length)
        state.getZone(const_1.ZONE_TYPE_HAND, PLAYER).add(hand);
    if (deck.length)
        state.getZone(const_1.ZONE_TYPE_DECK, PLAYER).add(deck);
    if (activeMagi)
        state.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, PLAYER).add([activeMagi]);
    if (opponentMagi)
        state.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, OPPONENT).add([opponentMagi]);
    state.enableDebug();
    return state;
}
function snapshot(state) {
    return JSON.stringify(state.serializeData(PLAYER, false));
}
// ---------------------------------------------------------------------------
// Bug 1 – POWER: Arboll's Life Channel
//   Unmaker.generateUnAction line 658 throws null (reading 'id')
//   because the source creature (Arboll) is referenced after being discarded.
// ---------------------------------------------------------------------------
describe('Unmaker bug – POWER with prompt (Life Channel)', () => {
    it('reverts state correctly after Life Channel power is applied', () => {
        const arboll = new CardInGame_1.default((0, cards_1.byName)('Arboll'), PLAYER).addEnergy(3);
        const grega = new CardInGame_1.default((0, cards_1.byName)('Grega'), PLAYER).addEnergy(8);
        const sinder = new CardInGame_1.default((0, cards_1.byName)('Sinder'), OPPONENT).addEnergy(6);
        const state = makeState(STEP_PRS1, [arboll], [], [], grega, sinder);
        const before = snapshot(state);
        const unmaker = new unmaker_1.Unmaker(state);
        unmaker.setCheckpoint();
        const power = arboll.card.data.powers.find(p => p.name === 'Life Channel');
        state.update({ type: const_1.ACTION_POWER, source: arboll, power, player: PLAYER });
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
        const barak = new CardInGame_1.default((0, cards_1.byName)('Barak'), PLAYER).addEnergy(10);
        const sinder = new CardInGame_1.default((0, cards_1.byName)('Sinder'), OPPONENT).addEnergy(6);
        // Four deck cards that Prophecy will expose.
        const deckCards = ['Fire Chogo', 'Lava Aq', 'Magma Hyren', 'Diobor'].map(name => new CardInGame_1.default((0, cards_1.byName)(name), PLAYER));
        const state = makeState(STEP_PRS1, [], [], deckCards, barak, sinder);
        // Apply the Prophecy power first (outside the checkpoint under test)
        // so the state is already in the rearrange-prompt.
        const prophecyPower = barak.card.data.powers.find(p => p.name === 'Prophecy');
        state.update({ type: const_1.ACTION_POWER, source: barak, power: prophecyPower, player: PLAYER });
        const before = snapshot(state);
        // Now test that CARDS_ORDER (resolving the rearrange) can be cleanly reverted.
        const unmaker = new unmaker_1.Unmaker(state);
        unmaker.setCheckpoint();
        const topFourIds = state.getZone(const_1.ZONE_TYPE_DECK, PLAYER).cards.slice(0, 4).map((c) => c.id);
        state.update({
            type: const_1.ACTION_RESOLVE_PROMPT,
            cards: [...topFourIds].reverse(),
            generatedBy: state.state.promptGeneratedBy,
            player: PLAYER,
        });
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
        const grow = new CardInGame_1.default((0, cards_1.byName)('Grow'), PLAYER);
        const poad = new CardInGame_1.default((0, cards_1.byName)('Poad'), PLAYER).addEnergy(10);
        const sinder = new CardInGame_1.default((0, cards_1.byName)('Sinder'), OPPONENT).addEnergy(6);
        const furok = new CardInGame_1.default((0, cards_1.byName)('Furok'), PLAYER).addEnergy(3);
        const state = makeState(STEP_PRS1, [furok], [grow], [], poad, sinder);
        const logBefore = state.serializeData(PLAYER, false).log?.length ?? 0;
        const unmaker = new unmaker_1.Unmaker(state);
        unmaker.setCheckpoint();
        const growCard = state.getZone(const_1.ZONE_TYPE_HAND, PLAYER).byId(grow.id);
        state.update({ type: const_1.ACTION_PLAY, payload: { card: growCard, player: PLAYER }, forcePriority: false, player: PLAYER });
        unmaker.revertToCheckpoint();
        const logAfter = state.serializeData(PLAYER, false).log?.length ?? 0;
        expect(logAfter).toBe(logBefore);
    });
    it('produces the same die roll result after revert (PRNG is tracked)', () => {
        const grow1 = new CardInGame_1.default((0, cards_1.byName)('Grow'), PLAYER);
        const grow2 = new CardInGame_1.default((0, cards_1.byName)('Grow'), PLAYER);
        const poad = new CardInGame_1.default((0, cards_1.byName)('Poad'), PLAYER).addEnergy(10);
        const sinder = new CardInGame_1.default((0, cards_1.byName)('Sinder'), OPPONENT).addEnergy(6);
        const furok = new CardInGame_1.default((0, cards_1.byName)('Furok'), PLAYER).addEnergy(3);
        const state = makeState(STEP_PRS1, [furok], [grow1, grow2], [], poad, sinder);
        state.initiatePRNG(42);
        const getDieRoll = () => {
            const log = state.serializeData(PLAYER, false).log ?? [];
            const entry = log.find((e) => e.type === 'log_entry/die_rolled');
            return entry?.result ?? null;
        };
        const unmaker = new unmaker_1.Unmaker(state);
        unmaker.setCheckpoint();
        const growCard1a = state.getZone(const_1.ZONE_TYPE_HAND, PLAYER).byId(grow1.id);
        state.update({ type: const_1.ACTION_PLAY, payload: { card: growCard1a, player: PLAYER }, forcePriority: false, player: PLAYER });
        const firstRoll = getDieRoll();
        unmaker.revertToCheckpoint();
        unmaker.setCheckpoint();
        const growCard1b = state.getZone(const_1.ZONE_TYPE_HAND, PLAYER).byId(grow1.id);
        state.update({ type: const_1.ACTION_PLAY, payload: { card: growCard1b, player: PLAYER }, forcePriority: false, player: PLAYER });
        const secondRoll = getDieRoll();
        unmaker.revertToCheckpoint();
        expect(secondRoll).toBe(firstRoll);
    });
});
describe('Engine bug - PLAY Fog Bank attached to creature when no creatures in play', () => {
    it('does not crash when Fog Bank prompt is resolved with no own creatures', () => {
        const fogBank = new CardInGame_1.default((0, cards_1.byName)('Fog Bank'), PLAYER);
        const adis = new CardInGame_1.default((0, cards_1.byName)('Adis'), PLAYER).addEnergy(15);
        const sinder = new CardInGame_1.default((0, cards_1.byName)('Sinder'), OPPONENT).addEnergy(6);
        // No PLAYER creatures in play – '$target' will be null after prompt resolves.
        const state = makeState(STEP_PRS1, [], [fogBank], [], adis, sinder);
        const fogBankCard = state.getZone(const_1.ZONE_TYPE_HAND, PLAYER).byId(fogBank.id);
        state.update({ type: const_1.ACTION_PLAY, payload: { card: fogBankCard, player: PLAYER }, forcePriority: false, player: PLAYER });
        // Resolving the own_creature prompt with null/empty selection should not crash.
        expect(() => {
            state.update({
                type: const_1.ACTION_RESOLVE_PROMPT,
                cards: [],
                generatedBy: state.state.promptGeneratedBy,
                player: PLAYER,
            });
        }).not.toThrow();
        // Fog Bank should NOT be in play (play was aborted due to no valid target).
        const fogBankInPlay = state.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.find((c) => c.card.name === 'Fog Bank');
        expect(fogBankInPlay).toBeUndefined();
    });
});
//# sourceMappingURL=unmaker.bugs.test.js.map