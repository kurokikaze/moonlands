import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, snapshot, expectSameState, PLAYER, OPPONENT } from './journalUtils.js';

const relics = ["Gorgle's Ring", 'Corf Pearl'];
const rolls = relics.flatMap(name => [1, 2, 3, 4, 5, 6].map(roll => [name, roll] as const));

function setup(name: string, roll: number, withCreature = false) {
  const relic = card(name, PLAYER);
  const own = card('Grega', PLAYER, 10);
  const opponent = card('Ora', OPPONENT, 10);
  const creature = card('Weebo', OPPONENT, 5);
  const state = makeState({ magi: own, opponentMagi: opponent, inPlay: [relic, ...(withCreature ? [creature] : [])] });
  state.initiatePRNG(1);
  state.setRollDebugValue(roll);
  const activate = () => state.update({ type: C.ACTION_POWER, source: relic, power: relic.card.data.powers![0], player: PLAYER });
  return { state, relic, own, opponent, creature, activate };
}

describe('conditional prompts after die rolls', () => {
  it.each(rolls)('%s on roll %i does not ask for a nonexistent creature', (name, roll) => {
    const { state, relic, own, opponent, activate } = setup(name, roll);
    const entered: string[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_ENTER_PROMPT) entered.push(action.promptType);
    });
    activate();
    if (name === "Gorgle's Ring" && roll === 6) {
      expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_MAGI);
      state.update({ type: C.ACTION_RESOLVE_PROMPT, target: opponent, player: PLAYER });
      expect(opponent.data.energy).toBe(6);
    } else {
      expect(entered).toEqual([]);
      expect(opponent.data.energy).toBe(10);
    }
    expect(state.state.prompt).toBe(false);
    expect(own.data.energy).toBe(name === 'Corf Pearl' && roll <= 3 ? 7 : 10);
    expect(relic.data.actionsUsed).toContain(relic.card.data.powers![0].name);
  });

  it.each(rolls)('%s on roll %i still resolves valid targets normally', (name, roll) => {
    const { state, own, opponent, creature, activate } = setup(name, roll, true);
    activate();
    const needsCreature = name === "Gorgle's Ring" ? roll === 4 || roll === 5 : roll >= 4;
    if (needsCreature) {
      expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_CREATURE);
      state.update({ type: C.ACTION_RESOLVE_PROMPT, target: creature, player: PLAYER });
      expect(creature.data.energy).toBe(name === 'Corf Pearl' && roll === 6 ? 8 : 3);
    } else if (name === "Gorgle's Ring" && roll === 6) {
      expect(state.state.promptType).toBe(C.PROMPT_TYPE_SINGLE_MAGI);
      state.update({ type: C.ACTION_RESOLVE_PROMPT, target: opponent, player: PLAYER });
      expect(opponent.data.energy).toBe(6);
    } else {
      expect(creature.data.energy).toBe(5);
    }
    expect(state.state.prompt).toBe(false);
    expect(own.data.energy).toBe(name === 'Corf Pearl' && roll <= 3 ? 7 : 10);
  });

  it.each(['thenEffects', 'elseEffects'] as const)('skips the whole impossible %s branch, preserves later effects and ignores stale targets', branch => {
    const { state, relic, own, opponent } = setup("Gorgle's Ring", 4);
    state.setSpellMetadata({ source: relic, target: opponent }, relic.id);
    state.update({
      type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_CONDITIONAL,
      player: PLAYER, generatedBy: relic.id, conditions: [],
      thenEffects: [{
        type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_CONDITIONAL,
        conditions: branch === 'thenEffects' ? [] : [{ objectOne: 1, propertyOne: null, comparator: '=', objectTwo: 0, propertyTwo: null }],
        [branch]: [{ type: C.ACTION_ENTER_PROMPT, promptType: C.PROMPT_TYPE_SINGLE_CREATURE },
          { type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI, target: '$target', amount: 4 }],
      }, { type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_ADD_ENERGY_TO_MAGI, target: own, amount: 1 }],
    } as any);
    expect(state.state.prompt).toBe(false);
    expect(opponent.data.energy).toBe(10);
    expect(own.data.energy).toBe(11);
  });

  it.each(relics)('%s can roll back and replay a skipped branch', name => {
    const { state, activate } = setup(name, 5);
    const before = snapshot(state);
    const frame = state.beginSearchFrame();
    activate();
    expect(state.state.prompt).toBe(false);
    state.rollback(frame);
    expectSameState(state, before);
    activate();
    expect(state.state.prompt).toBe(false);
  });

  it('validates a branch with no source using its player and metadata namespace', () => {
    const creature = card('Weebo', OPPONENT, 3);
    const state = makeState({
      magi: card('Grega', PLAYER, 10), opponentMagi: card('Ora', OPPONENT, 10), inPlay: [creature],
    });
    state.setSpellMetadata({ actor: OPPONENT }, 'branch');
    state.update({
      type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_CONDITIONAL,
      generatedBy: 'branch', player: '$actor', conditions: [], thenEffects: [
        { type: C.ACTION_ENTER_PROMPT, promptType: C.PROMPT_TYPE_OWN_SINGLE_CREATURE },
        { type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE, target: '$target', amount: 2 },
      ],
    } as any);
    expect(state.state.promptPlayer).toBe(OPPONENT);
    state.update({ type: C.ACTION_RESOLVE_PROMPT, target: creature, player: OPPONENT });
    expect(state.state.prompt).toBe(false);
    expect(creature.data.energy).toBe(5);
  });
});
