import { describe, expect, it } from 'vitest';
import { cards, byName } from '../src/cards.js';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

describe('Magi starting card names', () => {
  it('uses existing card names for every starting card', () => {
    const missing = cards.flatMap(magi => (magi.data.startingCards ?? [])
      .filter(name => !byName(name)).map(name => ({ magi: magi.name, card: name })));
    expect(missing).toEqual([]);
  });

  it('lets Gar choose Fire Ball and puts it in hand', () => {
    const gar = card('Gar', PLAYER);
    const fireBall = card('Fire Ball', PLAYER);
    const state = makeState({ step: 0, deck: [fireBall, ...Array.from({ length: 6 }, () => card('Arbolit', PLAYER))], opponentMagi: card('Grega', OPPONENT, 10) });
    state.getZone(C.ZONE_TYPE_MAGI_PILE, PLAYER).add([gar]);
    state.update({ type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_START_OF_TURN, player: PLAYER, generatedBy: 'start' });
    expect(state.state.promptType).toBe(C.PROMPT_TYPE_CHOOSE_CARDS);
    expect(state.state.promptParams).toMatchObject({ startingCards: ['Lava Balamant', 'Fire Ball', 'Magma Armor'], availableCards: ['Fire Ball'] });
    state.update({ type: C.ACTION_RESOLVE_PROMPT, cards: ['Fire Ball'], player: PLAYER, generatedBy: state.state.promptGeneratedBy } as any);
    expect(state.state.prompt).toBe(false);
    const hand = state.getZone(C.ZONE_TYPE_HAND, PLAYER);
    expect(hand.cards.some(card => card.card.name === 'Fire Ball')).toBe(true);
    expect(hand.cards).toHaveLength(5);
  });
});
