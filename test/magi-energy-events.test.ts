import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

describe('Magi energy discard notifications', () => {
  it.each(['direct', 'metadata'] as const)('reports each actual target and amount for a %s target list', mode => {
    const own = card('Motash', PLAYER, 7);
    const opponent = card('Whall', OPPONENT, 1);
    const state = makeState({ magi: own, opponentMagi: opponent });
    const events: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI) events.push(action);
    });
    state.setSpellMetadata({ targets: [own, opponent] }, 'discard');
    state.update({
      type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
      target: mode === 'direct' ? [own, opponent] : '$targets', amount: 3, generatedBy: 'discard',
    });
    expect([own.data.energy, opponent.data.energy]).toEqual([4, 0]);
    expect(events).toHaveLength(2);
    expect(events.map(event => [event.target.id, event.amount])).toEqual(expect.arrayContaining([[own.id, 3], [opponent.id, 1]]));
    expect(events.find(event => event.target.id === own.id)?.target).toBe(own);
    expect(events.find(event => event.target.id === opponent.id)?.target).toBe(opponent);
  });

  it('keeps Carnivorous Cave notifications in sync with both Magi', () => {
    const own = card('Motash', PLAYER, 16);
    const opponent = card('Whall', OPPONENT, 2);
    const cave = card('Carnivorous Cave', PLAYER);
    const state = makeState({ magi: own, opponentMagi: opponent, hand: [cave] });
    const events: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI) events.push(action);
    });
    state.update({ type: C.ACTION_PLAY, player: PLAYER, payload: { card: cave, player: PLAYER } });
    expect([own.data.energy, opponent.data.energy]).toEqual([12, 1]);
    expect(events).toHaveLength(2);
    expect(events.map(event => [event.target.id, event.amount])).toEqual(expect.arrayContaining([[own.id, 1], [opponent.id, 1]]));
    expect(state.getZone(C.ZONE_TYPE_DISCARD, PLAYER).cards.some(card => card.card.name === 'Carnivorous Cave')).toBe(true);
  });
});
