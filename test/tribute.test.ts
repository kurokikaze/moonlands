import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

describe('Timber Hyren Tribute', () => {
  it.each([0, 1, 3, 10])('allows choosing zero with %i energy on the Magi', energy => {
    const magi = card('Orwin', PLAYER, energy);
    const hyren = card('Timber Hyren', PLAYER, 2);
    const state = makeState({ magi, opponentMagi: card('Gar', OPPONENT, 3), inPlay: [hyren] });
    state.update({ type: C.ACTION_POWER, source: hyren, power: hyren.card.data.powers![0], player: PLAYER });
    expect(state.state.promptType).toBe(C.PROMPT_TYPE_NUMBER);
    expect(state.state.promptParams).toEqual({ min: 0, max: Math.min(energy, 5) });
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: 0 });
    expect(state.state.prompt).toBe(false);
    expect(magi.data.energy).toBe(energy);
    expect(hyren.data.energy).toBe(2);
    expect(hyren.data.actionsUsed).toContain('Tribute');
    state.update({ type: C.ACTION_PASS, player: PLAYER });
    expect(state.state.step).toBe(2);
  });

  it('rejects overpayment and still accepts a valid transfer', () => {
    const magi = card('Orwin', PLAYER, 3);
    const hyren = card('Timber Hyren', PLAYER, 2);
    const state = makeState({ magi, opponentMagi: card('Gar', OPPONENT, 3), inPlay: [hyren] });
    state.update({ type: C.ACTION_POWER, source: hyren, power: hyren.card.data.powers![0], player: PLAYER });
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: 4 });
    expect(state.state.prompt).toBe(true);
    expect([magi.data.energy, hyren.data.energy]).toEqual([3, 2]);
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: 3 });
    expect(state.state.prompt).toBe(false);
    expect([magi.data.energy, hyren.data.energy]).toEqual([0, 5]);
  });
});
