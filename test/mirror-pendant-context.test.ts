import { describe, expect, it } from 'vitest';
import * as C from '../src/const.js';
import { card, makeState } from './journalUtils.js';

describe('Mirror Pendant copied power context', () => {
  it('preserves the chosen X cost when executing a native power', () => {
    const diobor = card('Diobor', 1, 6);
    const magi = card('Grega', 1, 10);
    const game = makeState({ inPlay: [diobor], magi });
    const power = diobor.card.data.powers!.find(power => power.name === 'Energy Transfer')!;
    game.update({ type: C.ACTION_POWER, source: diobor, power, player: 1 });
    expect(game.state.promptType).toBe(C.PROMPT_TYPE_NUMBER);
    game.update({ type: C.ACTION_RESOLVE_PROMPT, number: 3, player: 1 });
    expect(game.state.prompt).toBe(false);
    expect(diobor.data.energy).toBe(3);
    expect(magi.data.energy).toBe(13);
  });

  it.each([1, 2].flatMap(player => ["O'Qua", 'Whall'].map(name => [player, name] as const)))(
    'uses player %i zones for %s even before its native power was used', (player, name) => {
      const opponent = player === 1 ? 2 : 1;
      const magi = card(name, player, 20);
      const pendant = card('Mirror Pendant', player);
      const sacrifice = card('Corf', player, 3);
      const chosen = card('Sea Barl', player);
      const decoy = card('Deep Hyren', opponent);
      const game = makeState({ inPlay: [pendant, sacrifice] });
      game.state.activePlayer = player;
      game.getZone(C.ZONE_TYPE_ACTIVE_MAGI, player).add([magi]);
      game.getZone(C.ZONE_TYPE_ACTIVE_MAGI, opponent).add([card('Grega', opponent, 10)]);
      const zone = name === "O'Qua" ? C.ZONE_TYPE_DECK : C.ZONE_TYPE_HAND;
      game.getZone(zone, player).add([chosen]);
      game.getZone(zone, opponent).add([decoy]);
      game.update({ type: C.ACTION_POWER, source: pendant, power: pendant.card.data.powers![0], player });
      expect(game.state.promptType).toBe(C.PROMPT_TYPE_POWER_ON_MAGI);
      game.update({ type: C.ACTION_RESOLVE_PROMPT, power: magi.card.data.powers![0], source: magi, player } as any);
      if (name === 'Whall') {
        expect(game.state.promptType).toBe(C.PROMPT_TYPE_OWN_SINGLE_CREATURE);
        game.update({ type: C.ACTION_RESOLVE_PROMPT, target: sacrifice, player });
      }
      expect(game.state.promptType).toBe(C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE);
      expect(game.state.promptParams.zoneOwner).toBe(player);
      expect(game.state.promptParams.cards?.map(candidate => candidate.id)).toEqual([chosen.id]);
      game.update({ type: C.ACTION_RESOLVE_PROMPT, cards: [chosen], player });
      expect(game.state.prompt).toBe(false);
      expect(game.getZone(C.ZONE_TYPE_IN_PLAY).cards.find(candidate => candidate.card.name === 'Sea Barl')?.data.energy).toBe(4);
      expect(game.getZone(zone, opponent).cards).toEqual([decoy]);
      expect(magi.data.energy).toBe(name === "O'Qua" ? 14 : 13);
      expect(magi.wasActionUsed(magi.card.data.powers![0].name)).toBe(false);
      expect(pendant.wasActionUsed('Auraflection')).toBe(true);
    },
  );
});
