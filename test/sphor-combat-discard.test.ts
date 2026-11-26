import { describe, expect, it, vi } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

describe('Sphor Scavenge during combat', () => {
  it.each(['Bwill', 'Sea Barl'])('does not queue another discard after Karma removes an equally strong attacking %s', name => {
    // Recorded match: Bwill vs Bwill and Sea Barl vs Bwill, both at one energy.
    const attacker = card(name, PLAYER, 1);
    const defender = card('Bwill', OPPONENT, 1);
    const ownSphor = card('Sphor', PLAYER, 2);
    const enemySphor = card('Sphor', OPPONENT, 2);
    const state = makeState({ step: 2, inPlay: [attacker, defender, ownSphor, enemySphor], magi: card('Whall', PLAYER, 10), opponentMagi: card('Whall', OPPONENT, 10) });
    const queued = vi.spyOn(state, 'transformIntoActions');
    const discarded: string[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY) discarded.push((action.target as any).id);
    });
    state.update({ type: C.ACTION_ATTACK, source: attacker, target: defender, player: PLAYER });
    const discardRequests = queued.mock.calls.flat().filter(action => action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY);
    expect(discardRequests).toHaveLength(2);
    expect(discarded.sort()).toEqual([attacker.id, defender.id].sort());
    expect([ownSphor.data.energy, enemySphor.data.energy]).toEqual([3, 3]);
    expect(state.getZone(C.ZONE_TYPE_DISCARD, PLAYER).cards.map(card => card.card.name)).toEqual([name]);
    expect(state.getZone(C.ZONE_TYPE_DISCARD, OPPONENT).cards.map(card => card.card.name)).toEqual(['Bwill']);
  });

  it.each(['Kelthet', 'Corf'])('gains one energy when Bwill attacks a larger %s', name => {
    const bwill = card('Bwill', PLAYER, 1);
    const sphor = card('Sphor', PLAYER, 2);
    const defender = card(name, OPPONENT, 6);
    const state = makeState({ step: 2, inPlay: [bwill, sphor, defender], magi: card('Whall', PLAYER, 10), opponentMagi: card('Grega', OPPONENT, 10) });
    const actions: any[] = [];
    state.setOnAction(action => actions.push({ type: action.type, effectType: action.effectType, target: action.target?.id, source: action.source?.id, amount: action.amount }));
    state.update({ type: C.ACTION_ATTACK, source: bwill, target: defender, player: PLAYER });
    expect(actions.filter(action => action.effectType === C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && action.target === bwill.id)).toHaveLength(1);
    expect(sphor.data.energy).toBe(3);
    expect(defender.data.energy).toBe(5);
    expect(state.getZone(C.ZONE_TYPE_DISCARD, PLAYER).cards.map(card => card.card.name)).toEqual(['Bwill']);
  });

  it.each(['direct', 'metadata'])('ignores a queued duplicate discard using a %s target', mode => {
    const bwill = card('Bwill', PLAYER, 1);
    const sphor = card('Sphor', PLAYER, 2);
    const state = makeState({ step: 2, inPlay: [bwill, sphor], magi: card('Whall', PLAYER, 10), opponentMagi: card('Grega', OPPONENT, 10) });
    const discarded: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY) discarded.push(action);
    });
    state.setSpellMetadata({ victim: bwill }, 'test');
    const discard = { type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, target: mode === 'direct' ? bwill : '$victim', generatedBy: 'test' } as any;
    state.addActions(discard, discard);
    state.update({ type: C.ACTION_NONE });
    expect(discarded).toHaveLength(1);
    expect(sphor.data.energy).toBe(3);
  });

  it.each(['direct', 'metadata'])('removes stale cards from a mixed %s target list before triggering abilities', mode => {
    const bwill = card('Bwill', PLAYER, 1);
    const sphor = card('Sphor', PLAYER, 2);
    const opponent = card('Corf', OPPONENT, 5);
    const state = makeState({ inPlay: [bwill, sphor, opponent], magi: card('Whall', PLAYER, 10), opponentMagi: card('Grega', OPPONENT, 10) });
    state.update({ type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, target: bwill, generatedBy: 'first' });
    const events: any[] = [];
    state.setOnAction(action => {
      if (action.type === C.ACTION_EFFECT && action.effectType === C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY) events.push(action);
    });
    state.setSpellMetadata({ victims: [bwill, opponent] }, 'second');
    state.update({ type: C.ACTION_EFFECT, effectType: C.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, target: mode === 'direct' ? [bwill, opponent] : '$victims', generatedBy: 'second' } as any);
    expect(events).toHaveLength(1);
    expect(events[0].target).toEqual([opponent]);
    expect(sphor.data.energy).toBe(3);
    expect(state.getZone(C.ZONE_TYPE_DISCARD, OPPONENT).cards.map(card => card.card.name)).toEqual(['Corf']);
  });
});
