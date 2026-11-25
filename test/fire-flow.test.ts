import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

function setup(energy: number) {
  const magi = card('Ashgar', PLAYER, energy);
  const creature = card('Colossus', OPPONENT, 9);
  const spell = card('Fire Flow', PLAYER);
  const state = makeState({ magi, opponentMagi: card('Orwin', OPPONENT, 10), inPlay: [creature, card('Arbolit', PLAYER, 1)], hand: [spell] });
  state.update({ type: C.ACTION_PLAY, player: PLAYER, payload: { card: spell, player: PLAYER } });
  expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_CREATURE);
  state.update({ type: C.ACTION_RESOLVE_PROMPT, target: creature, player: PLAYER });
  return { state, magi, creature };
}

describe('Fire Flow energy transfer', () => {
  it.each([1, 2, 5, 10])('allows moving zero after paying for the spell from %i energy', energy => {
    const { state, magi, creature } = setup(energy);
    expect(state.state.promptType).toBe(C.PROMPT_TYPE_NUMBER);
    expect(state.state.promptParams).toEqual({ min: 0, max: Math.min(energy - 1, 4) });
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: 0 });
    expect(state.state.prompt).toBe(false);
    expect([magi.data.energy, creature.data.energy]).toEqual([energy - 1, 9]);
    state.update({ type: C.ACTION_PASS, player: PLAYER });
    expect(state.state.step).toBe(2);
  });

  it.each([2, 5, 10])('limits the transfer to available energy and four with %i starting energy', energy => {
    const { state, magi, creature } = setup(energy);
    const max = Math.min(energy - 1, 4);
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: max + 1 });
    expect(state.state.prompt).toBe(true);
    expect([magi.data.energy, creature.data.energy]).toEqual([energy - 1, 9]);
    state.update({ type: C.ACTION_RESOLVE_PROMPT, player: PLAYER, number: max });
    expect(state.state.prompt).toBe(false);
    expect([magi.data.energy, creature.data.energy]).toEqual([energy - 1 - max, 9 + max]);
  });
});
