import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import * as energy from '../src/actionMaps/effects/energy.js';
import * as zones from '../src/actionMaps/effects/zones.js';
import { applyDiscardCardsEffect } from '../src/actionMaps/effects/discard.js';
import { applyAddStartingEnergyToMagiEffect } from '../src/actionMaps/effects/turnAndStep.js';
import { card, makeState, PLAYER, OPPONENT } from './journalUtils.js';

// Check the producer boundary: each child effect must carry the particular card
// being processed, never the parent list or its metadata reference.
const producers = [
  ['energize', energy.applyEnergizeEffect, 'creature'],
  ['add energy to creature or Magi', energy.applyAddEnergyToCreatureOrMagiEffect, 'mixed'],
  ['discard energy from creature or Magi', energy.applyDiscardEnergyFromCreatureOrMagiEffect, 'mixed'],
  ['discard energy from creatures', energy.applyDiscardEnergyFromCreaturesEffect, 'creature'],
  ['creature energy discarded', energy.applyDiscardEnergyFromCreatureEffect, 'creature'],
  ['Magi energy discarded', energy.applyDiscardEnergyFromMagiEffect, 'magi'],
  ['starting Magi energy', applyAddStartingEnergyToMagiEffect, 'magi'],
  ['defeat Magi', zones.applyDefeatMagiEffect, 'magi'],
  ['discard creature or relic', zones.applyDiscardCreatureOrRelic, 'mixedRelic'],
  ['discard creature', zones.applyDiscardCreatureFromPlayEffect, 'creature'],
  ['discard relic', zones.applyDiscardRelicFromPlayEffect, 'relic'],
  ['discard cards from hand', applyDiscardCardsEffect, 'creature'],
  ['move cards between zones', zones.applyMoveCardsBetweenZonesEffect, 'creature'],
] as const;

describe.each(producers)('%s splits targets into individual effects', (_name, handler, kind) => {
  for (const mode of ['direct', 'metadata']) {
    it.each([0, 1, 2])(`${mode} target list of size %i`, count => {
      const names = kind === 'magi' ? ['Whall', 'Motash'] : kind === 'relic' ? ['Water of Life', 'Dream Balm']
        : kind === 'mixed' ? ['Sea Barl', 'Whall'] : kind === 'mixedRelic' ? ['Sea Barl', 'Water of Life'] : ['Sea Barl', 'Coral Hyren'];
      const targets = names.slice(0, count).map(name => card(name, PLAYER, 5));
      const state = makeState({ inPlay: targets, magi: card('Whall', PLAYER, 10), opponentMagi: card('Motash', OPPONENT, 10) });
      state.setSpellMetadata({ targets }, 'group');
      const effects: any[] = [];
      (handler as Function).call(state, {
        type: C.ACTION_EFFECT, target: mode === 'direct' ? targets : '$targets',
        source: card('Paralit', PLAYER, 3), amount: 1, generatedBy: 'group', player: PLAYER,
        sourceZone: C.ZONE_TYPE_IN_PLAY, destinationZone: C.ZONE_TYPE_DISCARD,
      }, (...actions: any[]) => effects.push(...actions), state.state);
      expect(effects).toHaveLength(count);
      // Zone movement notifications use sourceCard/destinationCard instead of target.
      expect(effects.map(effect => (effect.sourceCard ?? effect.target).id).sort()).toEqual(targets.map(target => target.id).sort());
      for (const effect of effects) {
        expect(Array.isArray(effect.target ?? effect.sourceCard)).toBe(false);
        expect(targets).toContain(effect.target ?? effect.sourceCard);
        if (effect.destinationCard) expect(Array.isArray(effect.destinationCard)).toBe(false);
      }
    });
  }
});

describe('Energy removal accepts the advertised target lists', () => {
  for (const effectType of [C.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE, C.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI]) {
    for (const mode of ['direct', 'metadata']) {
      it.each([0, 1, 2])(`${effectType}, ${mode}, %i targets`, count => {
        const magi = [card('Whall', PLAYER, 7), card('Motash', OPPONENT, 5)];
        const creatures = [card('Sea Barl', PLAYER, 4), card('Coral Hyren', PLAYER, 2)];
        const state = makeState({ inPlay: creatures, magi: magi[0], opponentMagi: magi[1] });
        const cards = effectType === C.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI ? magi : creatures;
        const before = cards.map(target => target.data.energy);
        state.setSpellMetadata({ targets: cards.slice(0, count) }, 'remove');
        state.update({ type: C.ACTION_EFFECT, effectType, target: mode === 'direct' ? cards.slice(0, count) : '$targets', amount: 2, generatedBy: 'remove' } as any);
        expect(cards.map(target => target.data.energy)).toEqual(before.map((amount, index) => index < count ? amount - 2 : amount));
        if (effectType === C.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE) {
          expect(state.getZone(C.ZONE_TYPE_IN_PLAY).containsId(creatures[1].id)).toBe(count < 2);
        }
      });
    }
  }
});
