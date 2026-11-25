import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

describe('Creature energy discard notifications', () => {
  it.each(['direct', 'metadata'] as const)('reports individual targets and actual losses for a %s list', mode => {
    const first = card('Sea Barl', PLAYER, 4);
    const second = card('Coral Hyren', PLAYER, 1);
    const state = makeState({ inPlay: [first, second], magi: card('Whall', PLAYER, 10), opponentMagi: card('Motash', OPPONENT, 10) });
    const events: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE) events.push(action);
    });
    state.setSpellMetadata({ targets: [first, second] }, 'discard');
    state.update({
      type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
      target: mode === 'direct' ? [first, second] : '$targets', amount: 2, generatedBy: 'discard',
    });
    expect([first.data.energy, second.data.energy]).toEqual([2, 0]);
    expect(events).toHaveLength(2);
    expect(events.map(event => [event.target.id, event.amount])).toEqual(expect.arrayContaining([[first.id, 2], [second.id, 1]]));
    expect(events.find(event => event.target.id === first.id)?.target).toBe(first);
    expect(events.find(event => event.target.id === second.id)?.target).toBe(second);
    expect(state.getZone(C.ZONE_TYPE_IN_PLAY).containsId(second.id)).toBe(false);
  });

  it('reports one loss per creature after Paralit uses Life Channel', () => {
    const paralit = card('Paralit', PLAYER, 3);
    const creatures = [card('Sea Barl', PLAYER, 4), card('Coral Hyren', PLAYER, 5), card('Wellisk Pup', PLAYER, 3)];
    const magi = card('Whall', PLAYER, 10);
    const state = makeState({ inPlay: [paralit, ...creatures], magi, opponentMagi: card('Motash', OPPONENT, 10) });
    const events: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE) events.push(action);
    });
    state.update({ type: C.ACTION_POWER, source: paralit, power: paralit.card.data.powers![0], player: PLAYER });
    expect(state.state.prompt).toBe(false);
    expect(magi.data.energy).toBe(15);
    expect(creatures.map(creature => creature.data.energy)).toEqual([3, 4, 2]);
    expect(events).toHaveLength(3);
    expect(events.map(event => [event.target.id, event.amount])).toEqual(expect.arrayContaining(creatures.map(creature => [creature.id, 1])));
  });
});
