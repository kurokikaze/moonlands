import { nanoid } from "nanoid";
import CardInGame, { ConvertedCard } from "../classes/CardInGame";
import {
  ACTION_CALCULATE,
  ACTION_EFFECT,
  ACTION_ENTER_PROMPT,
  ACTION_GET_PROPERTY_VALUE,
  ACTION_PASS,
  ACTION_PLAYER_WINS,
  ACTION_SELECT,
  CALCULATION_SET,
  EFFECT_TYPE_ADD_DELAYED_TRIGGER,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
  EFFECT_TYPE_AFTER_DAMAGE,
  EFFECT_TYPE_ATTACH_CARD_TO_CARD,
  EFFECT_TYPE_ATTACK,
  EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
  EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
  EFFECT_TYPE_BEFORE_DAMAGE,
  EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
  EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
  EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
  EFFECT_TYPE_CONDITIONAL,
  EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,
  EFFECT_TYPE_CREATURE_ATTACKS,
  EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
  EFFECT_TYPE_CREATURE_IS_DEFEATED,
  EFFECT_TYPE_DAMAGE_STEP,
  EFFECT_TYPE_DEAL_DAMAGE,
  EFFECT_TYPE_DEFEAT_MAGI,
  EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
  EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
  EFFECT_TYPE_DIE_ROLLED,
  EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
  EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
  EFFECT_TYPE_DISCARD_RESHUFFLED,
  EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
  EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
  EFFECT_TYPE_DRAW_N_CARDS,
  EFFECT_TYPE_DRAW_REST_OF_CARDS,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
  EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
  EFFECT_TYPE_FIND_STARTING_CARDS,
  EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
  EFFECT_TYPE_MAGI_FLIPPED,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
  EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
  EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
  EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
  EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE,
  EFFECT_TYPE_PLAY_CREATURE,
  EFFECT_TYPE_PLAY_RELIC,
  EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
  EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
  EFFECT_TYPE_ROLL_DIE,
  EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_START_STEP,
  EFFECT_TYPE_START_TURN,
  EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES,
  NO_PRIORITY,
  PRIORITY_ATTACK,
  PRIORITY_CREATURES,
  PRIORITY_PRS,
  PROMPT_TYPE_CHOOSE_CARDS,
  PROPERTY_CONTROLLER,
  PROPERTY_ENERGIZE,
  PROPERTY_ENERGY_COUNT,
  PROPERTY_ENERGY_LOSS_THRESHOLD,
  PROPERTY_ID,
  PROPERTY_MAGI_STARTING_ENERGY,
  PROPERTY_POWER_COST,
  SELECTOR_CREATURES_OF_PLAYER,
  SELECTOR_ID,
  SELECTOR_OWN_CARDS_IN_PLAY,
  SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_OWN_CREATURES,
  SELECTOR_OWN_MAGI,
  TYPE_CREATURE,
  TYPE_MAGI,
  TYPE_RELIC,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DEFEATED_MAGI,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_MAGI_PILE,
  EFFECT_TYPE_PROMPT_ENTERED,
  PROMPT_TYPE_ALTERNATIVE,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
  PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
  PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
  PROMPT_TYPE_MAY_ABILITY,
  PROMPT_TYPE_NUMBER,
  PROMPT_TYPE_PAYMENT_SOURCE,
  PROMPT_TYPE_POWER_ON_MAGI,
  PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
  PROMPT_TYPE_SINGLE_CREATURE_FILTERED
} from "../const";
import { AnyEffectType, ContinuousEffectType, EnrichedAction, RestrictionObjectType, ZoneType } from "../types";
import { oneOrSeveral, updateContinuousEffects } from "./actionMapUtils";
import { ActionTransformer, ProtoEffectType, ActionHandlerMap, ProtoChooseCardsPrompt, StepType } from "./actionMapTypes";
import { AttackerDamageDealtEffect, AttackerDealsDamageEffect, BeforeDamageEffect } from "../types/attack";
import { DiscardCreatureFromPlayEffect, DiscardEnergyFromCreatureEffect, MoveCardBetwenZonesEffect } from "../types/effect";

import { PromptParamsType } from "..";

const convertCard = (cardInGame: CardInGame): ConvertedCard => ({
  id: cardInGame.id,
  owner: cardInGame.owner,
  card: cardInGame.card.name,
  data: cardInGame.data,
});

const steps: StepType[] = [
  {
    name: 'Energize',
    priority: NO_PRIORITY,
    automatic: true,
    effects: [
      {
        type: ACTION_SELECT,
        selector: SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
        variable: 'energize',
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_ENERGIZE,
        target: '$energize',
      },
    ],
  },
  {
    name: 'Powers/Relics/Spells',
    priority: PRIORITY_PRS,
    automatic: false,
  },
  {
    name: 'Attack',
    priority: PRIORITY_ATTACK,
    automatic: false,
  },
  {
    name: 'Play Dream Creatures',
    priority: PRIORITY_CREATURES,
    automatic: false,
  },
  {
    name: 'Powers/Relics/Spells',
    priority: PRIORITY_PRS,
    automatic: false,
  },
  {
    name: 'Draw',
    priority: NO_PRIORITY,
    automatic: true,
    effects: [
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
        numberOfCards: 2,
      },
    ],
  },
];

const applyStartTurnEffect: ActionTransformer<typeof EFFECT_TYPE_START_TURN> = function (action, transform) {
  if (this.turn === null) {
    this.turn = 0;
  } else {
    this.turn += 1;
  }
  transform(
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_START_STEP,
      player: action.player,
      step: 0,
      generatedBy: action.generatedBy,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_START_OF_TURN,
      player: action.player,
      generatedBy: action.generatedBy,
    }
  );

  this.state = {
    ...this.state,
    continuousEffects: this.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean) as ContinuousEffectType[],
    activePlayer: action.player,
    step: 0, // this will be rewritten to 0 by EFFECT_TYPE_START_STEP, but no big deal
  };
}

const applyDrawCardsInDrawStep: ActionTransformer<typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP> = function (action, transform) {
  const numberOfCards = action.numberOfCards;
  const draws = (new Array(numberOfCards)).fill({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DRAW,
    stepEffect: true,
    player: action.player,
    generatedBy: action.generatedBy,
  })
  transform(
    ...draws,
  );
}

const applyStartOfTurnEffect: ActionTransformer<typeof EFFECT_TYPE_START_OF_TURN> = function (action, transform) {
  if (
    this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
    this.getZone(ZONE_TYPE_MAGI_PILE, action.player).length > 0
  ) {
    const topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, action.player).cards[0];
    const availableCards = this.getAvailableCards(action.player, topMagi);

    const firstMagi = this.getZone(ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;

    const actionsToTake: ProtoEffectType[] = [
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MAGI_FLIPPED,
        target: topMagi,
      },
      {
        type: ACTION_SELECT,
        selector: SELECTOR_OWN_MAGI,
        variable: 'ownMagi',
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
        target: '$ownMagi',
      },
      {
        type: ACTION_ENTER_PROMPT,
        promptType: PROMPT_TYPE_CHOOSE_CARDS,
        promptParams: {
          startingCards: topMagi.card.data.startingCards || [],
          availableCards,
        },
        variable: 'startingCards',
      } as ProtoChooseCardsPrompt,
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_FIND_STARTING_CARDS,
        cards: '$startingCards',
      }
    ];

    if (firstMagi) {
      actionsToTake.push({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DRAW_REST_OF_CARDS,
        drawnCards: '$foundCards',
      });
    }

    const actions: AnyEffectType[] = actionsToTake.map(preAction => ({
      ...preAction,
      player: action.player,
      generatedBy: action.generatedBy,
    } as AnyEffectType));

    transform(...actions);
  }

  // Reset creatures' actions and attacks
  const creatures = this.getZone(ZONE_TYPE_IN_PLAY).cards
    .filter(card => card.card.type === TYPE_CREATURE && card.data.controller === action.player);
  if (creatures.length > 0) {
    creatures.forEach(creature => {
      creature.clearAttackMarkers();
      creature.clearActionsUsed();
    });
  }

  // Reset relics' actions
  const relics = this.getZone(ZONE_TYPE_IN_PLAY).cards
    .filter(card => card.card.type === TYPE_RELIC && card.data.controller === action.player);
  if (relics.length > 0) {
    relics.forEach(relic => relic.clearActionsUsed());
  }

  // if magi is active, reset its actions used too
  if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
    this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.player)?.card?.clearActionsUsed();
  }
}

const applyStartStepEffect: ActionTransformer<typeof EFFECT_TYPE_START_STEP> = function (action) {
  // Player who goes first do not energize on first turn
  const isFirstEnergize = this.turn === 0 &&
    action.player === this.state.goesFirst &&
    action.step === 0;

  if (steps[action.step].effects && !isFirstEnergize) {
    const transformedActions: AnyEffectType[] = steps[action.step]?.effects?.map(effect =>
    ({
      ...effect,
      player: action.player,
      generatedBy: action.generatedBy,
    } as AnyEffectType),
    ) || [];
    this.addActions(...transformedActions);
  }

  if (steps[action.step].automatic) {
    this.addActions({
      type: ACTION_PASS,
      player: action.player,
    });
  }

  if (action.step === 1 && this.timerEnabled) {
    this.startTurnTimer()
  }

  this.state = {
    ...this.state,
    step: action.step,
  };
}

const applyAddDelayedTriggerEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER> = function (action, _transform, _state, seeded_nanoid) {
  const metaData = this.getSpellMetadata(action.generatedBy);
  // "new_card" fallback is for "defeated" triggers
  if ('source' in metaData || 'new_card' in metaData) {
    const self = metaData.source as CardInGame || metaData.new_card as CardInGame;
    this.state = {
      ...this.state,
      delayedTriggers: [
        ...this.state.delayedTriggers,
        {
          id: seeded_nanoid(),
          self,
          ...action.delayedTrigger,
        }
      ],
    };
  }
}

const applyFindStartingCardsEffect: ActionTransformer<typeof EFFECT_TYPE_FIND_STARTING_CARDS> = function (action, transform) {
  const cardsToFind: string[] = this.getMetaValue(action.cards, action.generatedBy);

  let foundCards: string[] = [];
  if (cardsToFind.length) {
    const deck = this.getZone(ZONE_TYPE_DECK, action.player);
    const discard = this.getZone(ZONE_TYPE_DISCARD, action.player);

    cardsToFind.forEach(cardName => {
      if (discard.cards.some(({ card }) => card.name == cardName)) {
        const card = discard.cards.find(({ card }) => card.name == cardName);

        if (!card) {
          return true;
        }

        foundCards.push(cardName);

        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
          target: card,
          sourceZone: ZONE_TYPE_DISCARD,
          destinationZone: ZONE_TYPE_HAND,
          generatedBy: action.generatedBy,
          bottom: false,
        });
      } else if (deck.cards.some(({ card }) => card.name == cardName)) {
        const card = deck.cards.find(({ card }) => card.name == cardName);

        if (!card) {
          return true;
        }

        foundCards.push(cardName);

        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
          target: card,
          sourceZone: ZONE_TYPE_DECK,
          destinationZone: ZONE_TYPE_HAND,
          generatedBy: action.generatedBy,
          bottom: false,
        });
      }
    });
  }

  this.setSpellMetaDataField('foundCards', foundCards, action.generatedBy);
}

const applyDrawRestOfCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_REST_OF_CARDS> = function (action, transform) {
  const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
  const number = 5 - foundCards.length;

  if (number > 0) { // who knows
    for (let i = 0; i < number; i++) {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DRAW,
        player: action.player,
        generatedBy: action.generatedBy,
      });
    }
  }
}

const applyMagiFlippedEffect: ActionTransformer<typeof EFFECT_TYPE_MAGI_FLIPPED> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_MAGI_PILE,
    destinationZone: ZONE_TYPE_ACTIVE_MAGI,
    bottom: false,
    target: action.target,
    generatedBy: action.generatedBy,
  });
}

const applyDiscardCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND> = function (action, transform) {
  const targets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(targets, target =>
    target && transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
      target,
      generatedBy: action.generatedBy,
      player: action.player,
    })
  );
}

const applyDiscardCardEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARD_FROM_HAND> = function (action, transform) {
  const target = this.getMetaValue(action.target, action.generatedBy);

  if (target) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      sourceZone: ZONE_TYPE_HAND,
      destinationZone: ZONE_TYPE_DISCARD,
      bottom: false,
      target,
      generatedBy: action.generatedBy,
    })
  }
}

const applyReturnCreatureDiscardingEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY> =
  function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_IN_PLAY,
        destinationZone: ZONE_TYPE_HAND,
        bottom: false,
        target: card,
        generatedBy: action.generatedBy,
      });
    }
  }

const applyReturnCreatureReturningEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY> = function (action, transform) {
  const card = this.getMetaValue<CardInGame>(action.target, action.generatedBy);
  if (this.isCardAffectedByEffect(card, action)) {
    const ownersMagi = this.useSelector(SELECTOR_OWN_MAGI, card.owner)[0];
    transform(
      {
        type: ACTION_GET_PROPERTY_VALUE,
        property: PROPERTY_ENERGY_COUNT,
        target: card,
        variable: 'creatureEnergyToRefund',
        generatedBy: action.generatedBy,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
        target: ownersMagi,
        amount: '$creatureEnergyToRefund',
        generatedBy: action.generatedBy,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: ZONE_TYPE_IN_PLAY,
        destinationZone: ZONE_TYPE_HAND,
        bottom: false,
        target: card,
        generatedBy: action.generatedBy,
      }
    );
  }
}

const applyDrawNCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_N_CARDS> = function (action, transform) {
  const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
  for (let i = 0; i < numberOfCards; i++) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DRAW,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

const applyDrawEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW> = function (action, transform) {
  const player = this.getMetaValue(action.player, action.generatedBy);

  const deck = this.getZone(ZONE_TYPE_DECK, player);
  const discard = this.getZone(ZONE_TYPE_DISCARD, player);

  if (deck.length > 0) {
    const card = deck.cards[0];

    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      target: card,
      sourceZone: ZONE_TYPE_DECK,
      destinationZone: ZONE_TYPE_HAND,
      bottom: false,
      player: player,
      generatedBy: action.generatedBy,
    });
  } else if (discard.length > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_RESHUFFLE_DISCARD,
      player: player,
      generatedBy: action.generatedBy,
    },
      action);
  }
}

const applyReshuffleDiscardEffect: ActionTransformer<typeof EFFECT_TYPE_RESHUFFLE_DISCARD> = function (action, transform, _state, seeded_nanoid) {
  const player = this.getMetaValue(action.player, action.generatedBy);
  const deck = this.getZone(ZONE_TYPE_DECK, player);
  const discard = this.getZone(ZONE_TYPE_DISCARD, player);

  const newCards = discard.cards.map(card => new CardInGame(card.card, card.owner, seeded_nanoid));
  deck.add(newCards);
  deck.shuffle();
  discard.empty();
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DISCARD_RESHUFFLED,
    cards: newCards.map(({ id }) => id),
    player: player,
    generatedBy: action.generatedBy,
  });
}

const applyAttackEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACK> = function (action, transform) {
  const source = this.getMetaValue(action.source, action.generatedBy);
  const target = this.getMetaValue(action.target, action.generatedBy);
  const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);

  let attackSequence: AnyEffectType[] = [
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_ATTACKS,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_BEFORE_DAMAGE,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DAMAGE_STEP,
      source: source,
      sourceAtStart: source.copy(),
      target: target,
      packHuntAttack: false,
      targetAtStart: target.copy(),
      generatedBy: source.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_AFTER_DAMAGE,
      source: source,
      target: target,
      generatedBy: source.id,
    },
  ];

  if (additionalAttackers) {
    const preparedEffects: AnyEffectType[] = additionalAttackers.map((card: CardInGame): AnyEffectType[] => [
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_CREATURE_ATTACKS,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_BEFORE_DAMAGE,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DAMAGE_STEP,
        source: card,
        sourceAtStart: card.copy(),
        packHuntAttack: true,
        target: target,
        targetAtStart: target.copy(),
        generatedBy: source.id,
      },
      {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_AFTER_DAMAGE,
        source: card,
        packHuntAttack: true,
        target: target,
        generatedBy: source.id,
      },
    ]).flat();

    for (let effect of preparedEffects) {
      attackSequence.push(effect);
    }
  }

  transform(...attackSequence);
}

const applyBeforeDamageEffect: ActionTransformer<typeof EFFECT_TYPE_BEFORE_DAMAGE> = function (action: BeforeDamageEffect) {
  action.source.markAttackDone();
  action.target.markAttackReceived();
}

const applyDamageStepEffect: ActionTransformer<typeof EFFECT_TYPE_DAMAGE_STEP> = function (action, transform) {
  // Here we finalize damage amount from both creatures' energy
  const attackSource = action.source;
  const attackTarget = action.target;

  const damageByAttacker = attackSource.data.energy;
  const damageByDefender = (attackTarget.card.type === TYPE_CREATURE) ?
    attackTarget.data.energy :
    0
    ;

  const attackerDamageActions: [AttackerDealsDamageEffect, AttackerDamageDealtEffect] = [{	// from source to target
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
    source: attackSource,
    sourceAtStart: action.sourceAtStart,
    target: attackTarget,
    targetAtStart: action.targetAtStart,
    sourceBeforeDamage: attackSource.copy(),
    targetBeforeDamage: attackTarget.copy(),
    amount: damageByAttacker,
    generatedBy: attackSource.id,
  },
  {	// from source to target
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
    source: attackSource,
    sourceAtStart: action.sourceAtStart,
    target: attackTarget,
    targetAtStart: action.targetAtStart,
    sourceBeforeDamage: attackSource.copy(),
    targetBeforeDamage: attackTarget.copy(),
    amount: '$damageDealt',
    generatedBy: attackSource.id,
  }
  ];

  const damageActions: AnyEffectType[] = (attackTarget.card.type === TYPE_CREATURE && !action.packHuntAttack) ? [
    ...attackerDamageActions, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
      source: attackTarget,
      sourceAtStart: action.targetAtStart,
      target: attackSource,
      amount: damageByDefender,
      targetAtStart: action.sourceAtStart,
      sourceBeforeDamage: attackTarget.copy(),
      targetBeforeDamage: attackSource.copy(),
      generatedBy: attackSource.id,
    },
    {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
      source: attackTarget,
      sourceAtStart: action.targetAtStart,
      target: attackSource,
      amount: '$damageDealt',
      targetAtStart: action.sourceAtStart,
      sourceBeforeDamage: attackTarget.copy(),
      targetBeforeDamage: attackSource.copy(),
      generatedBy: attackSource.id,
    }] : attackerDamageActions;

  transform(...damageActions);
}

const applyAttackerDealsDamageEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACKER_DEALS_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DEAL_DAMAGE,
    source: action.source,
    sourceAtStart: action.sourceAtStart,
    target: action.target,
    targetAtStart: action.targetAtStart,
    amount: action.amount,
    attack: true,
    generatedBy: action.generatedBy,
  });
}

const applyDefenderDealsDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DEAL_DAMAGE,
    source: action.source,
    sourceAtStart: action.sourceAtStart,
    target: action.target,
    targetAtStart: action.targetAtStart,
    amount: action.amount,
    attack: true,
    generatedBy: action.generatedBy,
  });
}

const applyDealDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DEAL_DAMAGE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
    target: action.target,
    source: action.source,
    amount: action.amount,
    attack: true,
    variable: 'damageDealt',
    generatedBy: action.generatedBy,
  });
}

const applyAfterDamageEffect: ActionTransformer<typeof EFFECT_TYPE_AFTER_DAMAGE> = function (action, transform) {
  if (action.source.data.energy === 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
      source: action.target,
      target: action.source,
      attack: true,
      asAttacker: false,
      generatedBy: action.generatedBy,
    }, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
      target: action.source,
      attack: true,
      generatedBy: action.generatedBy,
    });
  }
  if (action.target.data.energy === 0 && action.target.card.type === TYPE_CREATURE) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
      source: action.source,
      target: action.target,
      attack: true,
      asAttacker: true,
      generatedBy: action.generatedBy,
    }, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
      target: action.target,
      attack: true,
      generatedBy: action.generatedBy,
    });
  }
}

const applyCreatureDefeatsCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE> = function (action, transform) {
  if (action.target.data.energy === 0) {
    action.source.markDefeatedCreature();
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
      source: action.source,
      target: action.target,
      attack: true,
      player: action.player || 0,
      generatedBy: action.generatedBy,
    });
  }
}

const applyRollDieEffect: ActionTransformer<typeof EFFECT_TYPE_ROLL_DIE> = function (action, transform) {
  // @ts-ignore
  const randomValue = this.twister ? this.twister.random() : Math.random();
  const result = action.result ||
    (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);

  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DIE_ROLLED,
    result,
    player: action.player,
    generatedBy: action.generatedBy,
  });
}

const applyDieRolledEffect: ActionTransformer<typeof EFFECT_TYPE_DIE_ROLLED> = function (action) {
  this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
}

const applyExecutePowerEffects: ActionTransformer<typeof EFFECT_TYPE_EXECUTE_POWER_EFFECTS> = function (action) {
  const power = this.getMetaValue(action.power, action.generatedBy);
  const sourceRaw = this.getMetaValue(action.source, action.generatedBy);
  // Some selectors will give us arrays anyway
  const source = sourceRaw instanceof Array ? sourceRaw[0] : sourceRaw;

  const sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);
  const powerCost = this.modifyByStaticAbilities(source, PROPERTY_POWER_COST, power.name || '');

  const enrichAction = <T>(effect: T): T & EnrichedAction => ({
    source,
    player: sourceController,
    ...effect,
    power: true,
    generatedBy:
      source.id,
  });

  if ('effects' in power && power.effects) {
    const effects = power.effects;
    const preparedActions: AnyEffectType[] = effects.map(enrichAction);

    const allPromptsAreDoable = this.checkPrompts(source, preparedActions, true);

    if (allPromptsAreDoable) {
      if (!('setUsage' in action) || action.setUsage == true) {
        source.setActionUsed(power.name);
      }

      this.transformIntoActions(...preparedActions);
    }
  }
}

const applyEnergizeEffect: ActionTransformer<typeof EFFECT_TYPE_ENERGIZE> = function (action, transform) {
  const targets = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(targets, (target: CardInGame) => {
    const amount: number = this.modifyByStaticAbilities(target, PROPERTY_ENERGIZE);
    const type = target.card.type;
    transform({
      type: ACTION_EFFECT,
      effectType: (type == TYPE_CREATURE) ? EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
      target,
      source: undefined,
      amount,
      generatedBy: action.generatedBy,
    });
  });
}

const applyPayingEnergyForRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
      target: payingTarget,
      amount: payingAmount,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

const applyPayingEnergyForSpellEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
      target: payingTarget,
      amount: payingAmount,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

const applyPayingEnergyForCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.from, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    if (payingTarget instanceof CardInGame) {
      if (this.modifyByStaticAbilities(payingTarget, PROPERTY_CONTROLLER) == action.player) {
        const correctEffectType = payingTarget.card.type === TYPE_MAGI ? EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI : EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
        transform({
          type: ACTION_EFFECT,
          effectType: correctEffectType,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
      } else {
        throw new Error('Trying to pay for the creature from non-controlled Orathan');
      }
    }
  }
}

const applyPlayRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_RELIC> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    bottom: false,
    target: action.card,
    player: action.player,
    generatedBy: action.generatedBy,
  }, {
    type: ACTION_GET_PROPERTY_VALUE,
    property: PROPERTY_ID,
    target: '$new_card',
    variable: 'relic_created',
    generatedBy: action.generatedBy,
  });
}

const applyPlayCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_CREATURE> = function (action, transform) {
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    bottom: false,
    target: action.card,
    player: action.player,
    generatedBy: action.generatedBy,
  }, {
    type: ACTION_CALCULATE,
    operator: CALCULATION_SET,
    operandOne: '$new_card',
    variable: 'creature_created',
    generatedBy: action.generatedBy,
  });
}

// Should rework into continuous effect with duration
const applyForbidAttackToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE> = function (action, transform) {
  const targets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(targets, target => target.forbidAttacks());
}

const applyConditionalEffect: ActionTransformer<typeof EFFECT_TYPE_CONDITIONAL> = function (action, transform) {
  const metaData: { source?: CardInGame, new_card?: CardInGame } = this.getSpellMetadata(action.generatedBy);
  // "new_card" fallback is for "defeated" triggers
  const self = action.triggerSource || metaData.source || metaData.new_card;

  if (!self) {
    return
  }

  //   checkCondition(action, self, condition)
  const results = action.conditions.map(condition =>
    this.checkCondition(action, self, condition),
  );

  const enrichAction = <T>(effect: T): T & EnrichedAction => ({
    source: self,
    player: self.data.controller,
    ...effect,
    generatedBy: action.generatedBy,
  });

  if (results.every(result => result === true)) {
    if (action.thenEffects) {
      const preparedEffects = action.thenEffects
        .map(enrichAction);
      transform(...preparedEffects);
    }
  } else {
    if (action.elseEffects) {
      const preparedEffects = action.elseEffects
        .map(enrichAction);
      transform(...preparedEffects);
    }
  }
}

const applyMoveCardsBetweenZonesEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES> = function (action, transform, _state, seeded_nanoid) {
  if (!action.sourceZone || !action.destinationZone) {
    console.error('Source zone or destination zone invalid');
    throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
  }
  const zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy) || [];

  if (!zoneChangingTargets) {
    console.dir(zoneChangingTargets);
    console.dir(this.getSpellMetadata(action.generatedBy));
  }
  if (zoneChangingTargets.length) {
    // We assume all cards changing zones are in one zone initially
    const zoneOwner = zoneChangingTargets[0].owner;

    const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
    const sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
    const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
    const destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
    const newCards: CardInGame[] = [];

    oneOrSeveral(zoneChangingTargets, zoneChangingCard => {
      const newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
      if (action.bottom) {
        destinationZone.add([newObject]);
      } else {
        destinationZone.addToTop([newObject]);
      }
      sourceZone.removeById(zoneChangingCard.id);

      newCards.push(newObject);
      // Let the old cards keep track of the movement too
      this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
        sourceCard: zoneChangingCard,
        sourceZone: sourceZoneType,
        destinationCard: newObject,
        destinationZone: destinationZoneType,
        generatedBy: action.generatedBy,
      });
    });
    this.setSpellMetaDataField('new_cards', newCards, action.generatedBy);
  }
}

const applyMoveCardBetweenZonesEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES> = function (action, transform, _state, seeded_nanoid) {
  if (!action.sourceZone || !action.destinationZone) {
    console.error('Source zone or destination zone invalid');
    throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
  }
  const zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
  const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
  if (zoneChangingCard) {
    const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
    const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
    const destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
    const sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
    const newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
    if (action.bottom) {
      destinationZone.add([newObject]);
    } else {
      destinationZone.addToTop([newObject]);
    }

    sourceZone.removeById(zoneChangingCard.id);

    if (sourceZoneType == ZONE_TYPE_IN_PLAY && destinationZoneType !== ZONE_TYPE_IN_PLAY) {
      if (zoneChangingCard.id in this.state.cardsAttached) {
        // Queue the removal of the attached cards
        for (const attachmentId of this.state.cardsAttached[zoneChangingCard.id]) {
          const attachedCard = this.getZone(ZONE_TYPE_IN_PLAY).byId(attachmentId)

          if (attachedCard) {
            transform({
              type: ACTION_EFFECT,
              effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
              target: attachedCard,
              sourceZone: ZONE_TYPE_IN_PLAY,
              destinationZone: ZONE_TYPE_DISCARD,
              generatedBy: action.generatedBy,
              bottom: false,
            })
          } else {
            console.log(`Cannot find the card ${attachmentId} in play`)
          }
        }
        // This cleans up the attachments
        this.removeAttachments(zoneChangingCard.id)
      }
    }

    this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
    this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);

    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
      sourceCard: zoneChangingCard,
      sourceZone: sourceZoneType,
      destinationCard: newObject,
      attack: action.attack,
      destinationZone: destinationZoneType,
      generatedBy: action.generatedBy,
    });
  }
}

const applyStartingEnergyOnCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE> = function (action, transform) {
  const target = this.getMetaValue(action.target, action.generatedBy);
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    target,
    source: undefined,
    amount: this.getMetaValue(action.amount, action.generatedBy),
    generatedBy: action.generatedBy,
  });
}

const applyMoveEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_ENERGY> = function (action, transform) {
  const moveMultiSource: CardInGame | CardInGame[] = this.getMetaValue(action.source, action.generatedBy);
  const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
  const moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
  const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
  const amountToMove: number = this.getMetaValue(action.amount, action.generatedBy);

  if (moveSource.data.energy >= amountToMove) {
    moveSource.removeEnergy(amountToMove);
    moveTarget.addEnergy(amountToMove);
    if (moveSource.data.energy === 0) {
      switch (moveSource.card.type) {
        case TYPE_CREATURE: {
          // Creature goes to discard
          transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_DISCARD,
            bottom: false,
            target: moveSource,
            player: action.player,
            generatedBy: action.generatedBy,
          });
          break;
        }
      }
    }
  }
}

const applyAddEnergyToCreatureOrMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI> = function (action, transform) {
  const addMiltiTarget: CardInGame | CardInGame[] = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(addMiltiTarget, (target: CardInGame) => {
    switch (target.card.type) {
      case TYPE_CREATURE:
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
          amount: action.amount,
          target,
          source: undefined,
          generatedBy: action.generatedBy,
        });
        break;
      case TYPE_MAGI:
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
          amount: action.amount,
          target,
          generatedBy: action.generatedBy,
        });
        break;
    }
  });
}

export const applyDiscardEnergyFromCreatureOrMagiEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI> = function (action, transform) {
  const discardMultiTarget = this.getMetaValue(action.target, action.generatedBy);

  const source = action.source
  if (!source) {
    return;
  }
  oneOrSeveral(discardMultiTarget, target => {
    switch (target.card.type) {
      case TYPE_CREATURE: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
          amount: action.amount,
          attack: action.attack || false,
          spell: action.spell || false,
          relic: action.relic || false,
          source: action.source,
          variable: action.variable || false,
          target,
          generatedBy: action.generatedBy,
        } as DiscardEnergyFromCreatureEffect);
        break;
      }
      case TYPE_MAGI: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
          source,
          amount: action.amount,
          attack: action.attack || false,
          spell: action.spell || false,
          relic: action.relic || false,
          ...(action.variable ? { variable: action.variable } : {}),
          target,
          generatedBy: action.generatedBy,
        });
        break;
      }
    }
  });
}

const applyDiscardEnergyFromMagiEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI> = function (action, transform) {
  oneOrSeveral(
    this.getMetaValue(action.target, action.generatedBy),
    target => {
      const energyToRemove = Math.min(this.getMetaValue(action.amount, action.generatedBy), target.data.energy);
      target.removeEnergy(energyToRemove);
      if (energyToRemove > 0) {
        transform({
          ...action,
          effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
          amount: energyToRemove,
        });
      }
    },
  );
}

const applyDefeatMagiEffect: ActionTransformer<typeof EFFECT_TYPE_DEFEAT_MAGI> = function (action, transform) {
  const magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(magiMiltiTarget, target => {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
      target,
      source: null,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  });
}

const applyMagiIsDefeatedEffect: ActionTransformer<typeof EFFECT_TYPE_MAGI_IS_DEFEATED> = function (action, transform) {
  const { target, generatedBy } = action;
  const stillHasMagi = this.getZone(ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;

  if (stillHasMagi) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      target: target,
      sourceZone: ZONE_TYPE_ACTIVE_MAGI,
      destinationZone: ZONE_TYPE_DEFEATED_MAGI,
      bottom: false,
      generatedBy,
    }, {
      type: ACTION_SELECT,
      selector: SELECTOR_OWN_CARDS_IN_PLAY,
      player: target.owner,
      variable: 'cardsInPlay',
      generatedBy,
    }, {
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
      dueToMagiDefeat: true,
      target: '$cardsInPlay',
      player: target.owner,
      generatedBy,
    });
  } else {
    const winner = this.getOpponent(target.owner);

    transform({
      type: ACTION_PLAYER_WINS,
      player: winner,
    });
  }
}

const applyDiscardEnergyFromCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES> = function (action, transform) {
  // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
  // No cards use this effect now, but some may later
  // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
  const multiTarget: CardInGame | CardInGame[] = this.getMetaValue(action.target, action.generatedBy);
  var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);

  oneOrSeveral(
    multiTarget,
    target => {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
        target,
        amount,
        power: action.power,
        spell: action.spell,
        source: action.source,
        attack: action.attack,
        player: action.player,
        generatedBy: action.generatedBy,
      });
    },
  );
}

const applyDiscardEnergyFromCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE> = function (action, transform) {
  const multiTarget: CardInGame | CardInGame[] = this.getMetaValue(action.target, action.generatedBy);
  var totalEnergyLost = 0;
  oneOrSeveral(
    multiTarget,
    target => {
      if (this.isCardAffectedByEffect(target, action)) {
        var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
        const energyLossThreshold = this.modifyByStaticAbilities(target, PROPERTY_ENERGY_LOSS_THRESHOLD);
        const energyLostAlready = target.data.energyLostThisTurn;

        if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
          const energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
          energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
        }
        const energyLost = Math.min(energyToLose, target.data.energy);
        target.removeEnergy(energyLost);
        totalEnergyLost += energyLost;

        if (target.data.energy == 0 && !action.attack) {
          transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
            source: action.source,
            target,
            attack: action.attack,
            player: action.player,
            generatedBy: action.generatedBy,
          } as DiscardCreatureFromPlayEffect);
        }
        // The events transformed later take precedence over the events transformed earlier
        // That's why we transform the energy discarded event here before potentially transforming a discard creature event
        if (energyToLose > 0) {
          transform({
            ...action,
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
            amount: energyLost,
          });
        }
      }
    },
  );
  if (action.variable) {
    this.setSpellMetaDataField(action.variable, totalEnergyLost, action.generatedBy);
  }
}

const applyRemoveEnergyFromCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE> = function (action, transform) {
  const target: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
  if (target.card.type === TYPE_CREATURE) {
    target.removeEnergy(energyToLose);

    if (target.data.energy === 0) {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        target,
        attack: false,
        sourceZone: ZONE_TYPE_IN_PLAY,
        destinationZone: ZONE_TYPE_DISCARD,
        bottom: false,
        generatedBy: action.generatedBy,
      });
    }
  } else {
    console.error('Wrong card type')
  }
}

const applyRemoveEnergyFromMagiEffect: ActionTransformer<typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI> = function (action) {
  const target: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
  if (target.card.type === TYPE_MAGI) {
    target.removeEnergy(energyToLose);
  }
}

const applyRestoreCreatureToStartingEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY> = function (action, transform) {
  const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
  const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
  if (restoreAmount > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
      source: action.source || undefined,
      power: action.power || false,
      spell: action.spell || false,
      target: restoreTarget,
      amount: restoreAmount,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

const applyPayingEnergyForPowerEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER> = function (action, transform) {
  const payingTarget: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));

  if (payingAmount > 0) {
    switch (payingTarget.card.type) {
      case TYPE_CREATURE: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
        break;
      }
      case TYPE_MAGI: {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
          target: payingTarget,
          amount: payingAmount,
          player: action.player,
          generatedBy: action.generatedBy,
        });
        break;
      }
    }
  }
}

const applyAddEnergyToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE> = function (action) {
  const addTargets = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(addTargets, addTarget => {
    if (this.isCardAffectedByEffect(addTarget, action)) {
      addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10));
    }
  });
}

const applyAddStartingEnergyToMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI> = function (action, transform) {
  const magiTargets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(magiTargets, magiTarget => {
    const startingEnergy = this.modifyByStaticAbilities(magiTarget, PROPERTY_MAGI_STARTING_ENERGY);

    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
      target: magiTarget,
      amount: startingEnergy,
      generatedBy: action.generatedBy,
    });
  });
}

const applyAddEnergyToMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI> = function (action) {
  const magiTarget = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
}

const applyDiscardCreatureOrRelic: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC> = function (action, transform) {
  const discardTargets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(discardTargets, target => {
    const targetType = target.card.type;
    if (targetType === TYPE_CREATURE) {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
        attack: false,
        target,
        generatedBy: action.generatedBy,
        player: action.player || 0,
      } as DiscardCreatureFromPlayEffect);
    } else if (targetType === TYPE_RELIC) {
      transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
        target,
        ...(action.dueToMagiDefeat ? { dueToMagiDefeat: true } : {}),
        generatedBy: action.generatedBy,
        player: action.player || 0,
      });
    }
  });
}

const applyDiscardRelicFromPlayEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY> = function (action, transform) {
  const relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(relicDiscardTarget, relic => {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      target: relic,
      sourceZone: ZONE_TYPE_IN_PLAY,
      destinationZone: ZONE_TYPE_DISCARD,
      bottom: false,
      generatedBy: action.generatedBy,
    });
  });
}

const applyDiscardCreatureFromPlayEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY> = function (action, transform) {
  const creatureDiscardTarget: CardInGame | CardInGame[] = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(creatureDiscardTarget, creature => {
    if (this.isCardAffectedByEffect(creature, action)) {
      const effect: MoveCardBetwenZonesEffect = {
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        target: creature,
        attack: action.attack,
        sourceZone: ZONE_TYPE_IN_PLAY,
        destinationZone: ZONE_TYPE_DISCARD,
        bottom: false,
        generatedBy: action.generatedBy,
      };
      transform(effect);
    }
  });
}

const applyCreateContinuousEffect: ActionTransformer<typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT> = function (action, _transform, _state, seeded_nanoid) {
  const id = seeded_nanoid();

  const staticAbilities = (action.staticAbilities || []).map(ability => {
    switch (ability.selector) {
      case SELECTOR_ID: {
        const selectorParameterMetaValue = this.getMetaValue(ability.selectorParameter, action.generatedBy);

        const selectorParameter = (selectorParameterMetaValue instanceof CardInGame) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
        return {
          ...ability,
          selectorParameter,
        };
      }
      case SELECTOR_CREATURES_OF_PLAYER: {
        const selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
        return {
          ...ability,
          selectorParameter,
        };
      }
      default: {
        return ability;
      }
    }
  }).map(ability => {
    const operandOne = this.getMetaValue(ability.modifier?.operandOne, action.generatedBy);
    return {
      ...ability,
      modifier: {
        operator: ability.modifier.operator,
        operandOne,
      },
    };
  });

  const continuousEffect: ContinuousEffectType = {
    triggerEffects: action.triggerEffects || [],
    staticAbilities,
    expiration: action.expiration,
    player: action.player || 0,
    id,
  };

  this.state = {
    ...this.state,
    continuousEffects: [
      ...this.state.continuousEffects,
      continuousEffect,
    ],
  };
}

const applyRearrangeEnergyOnCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES> = function (action, transform) {
  const energyArrangement: Record<string, number> = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
  const ownCreatures = this.useSelector(SELECTOR_OWN_CREATURES, action.player || 0);
  const totalEnergyOnCreatures: number = (ownCreatures instanceof Array) ? ownCreatures.map(card => card.data.energy).reduce((a, b) => a + b, 0) : 0;
  const newEnergyTotal: number = Object.values(energyArrangement).reduce((a, b) => a + b, 0);

  // Energy stasis check
  const valid = this.getZone(ZONE_TYPE_IN_PLAY).cards.every(card => {
    if (!card.card.data.energyStasis) return true;

    if (card.id in energyArrangement) {
      const newEnergy = energyArrangement[card.id];
      return newEnergy === card.data.energy;
    }
    return true;
  });
  if (valid) {
    if (newEnergyTotal === totalEnergyOnCreatures) {
      this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
        if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
          const newEnergy = energyArrangement[card.id];
          card.setEnergy(newEnergy);
          if (card.data.energy === 0) {
            transform({
              type: ACTION_EFFECT,
              effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
              target: card,
              sourceZone: ZONE_TYPE_IN_PLAY,
              destinationZone: ZONE_TYPE_DISCARD,
              bottom: false,
              attack: false,
              generatedBy: action.generatedBy,
            });
          }
        }
      });
    } else if (this.debug) {
      console.error(`Cannot rearrange energy because new total ${newEnergyTotal} is not equal to old total ${totalEnergyOnCreatures}`);
    }
  } else if (this.debug) {
    console.error('One or more creatures with Energy Stasis is to be affected with energy rearrangement')
  }
}

const applyDistributeEnergyOnCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES> = function (action) {
  const energyArrangement: Record<string, number> = this.getMetaValue(action.energyOnCreatures, action.generatedBy);

  this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
    if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
      const energyAmount = energyArrangement[card.id];
      card.addEnergy(energyAmount);
    }
  });
}

const applyDistributeDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES> = function (action, transform) {
  const damageArrangement: Record<string, number> = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
  this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
    if (card.card.type === TYPE_CREATURE && card.id in damageArrangement) {
      const damageAmount = damageArrangement[card.id];
      const source = action.source;
      if (damageAmount > 0 && source) {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
          source,
          target: card,
          amount: damageAmount,
          generatedBy: action.generatedBy,
          player: action.player,
        });
      }
    }
  });
}

const applyPromptEntered: ActionTransformer<typeof EFFECT_TYPE_PROMPT_ENTERED> = function (action) {
  const promptPlayer = this.getMetaValue(action.player, action.generatedBy);

  this.state = {
    ...this.state,
    prompt: true,
    promptType: action.promptType,
    // @ts-ignore
    promptParams: action.promptParams || this.state.promptParams,
    promptGeneratedBy: action.generatedBy,
    promptMessage: action.message,
    promptPlayer: promptPlayer,
    promptVariable: action.variable,
  }
}

const applyPromptEnteredEffect: ActionTransformer<typeof EFFECT_TYPE_PROMPT_ENTERED> = function (action) {
  if (!('player' in action)) {
    throw new Error('Prompt without player!');
  }
  let promptParams: PromptParamsType = {};
  const promptPlayer = this.getMetaValue(action.player, action.generatedBy);

  switch (action.promptType) {
    case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
      promptParams = {
        source: this.getMetaValue(action.source, action.generatedBy),
      };
      break;
    }
    case PROMPT_TYPE_MAY_ABILITY: {
      promptParams = action.promptParams;
      break;
    }
    case PROMPT_TYPE_ALTERNATIVE: {
      promptParams = {
        alternatives: action.promptParams.alternatives,
      }
      break;
    }
    case PROMPT_TYPE_PAYMENT_SOURCE: {
      promptParams = {
        paymentAmount: action.promptParams.amount,
        paymentType: action.promptParams.paymentType,
        cards: action.promptParams.cards.map(convertCard),
      }
      break;
    }
    case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
      if (action.promptParams.restriction && action.promptParams.restrictions) {
        throw new Error('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
      }
      const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
        {
          type: this.getMetaValue(action.promptParams.restriction, action.generatedBy),
          value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
        },
      ] : null);

      const zone = this.getMetaValue(action.promptParams.zone, action.generatedBy) as ZoneType;
      const zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
      const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);

      const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
      const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;

      const maxNumberOfCards = Math.min(numberOfCards, cards.length);
      if (maxNumberOfCards > 0) {
        promptParams = {
          zone,
          zoneOwner,
          restrictions,
          numberOfCards: maxNumberOfCards,
          cards: cards.map(convertCard),
        };
      }
      break;
    }
    case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
      if (action.promptParams.restriction && action.promptParams.restrictions) {
        throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
      }
      const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
        {
          type: this.getMetaValue(action.promptParams.restriction, action.generatedBy),
          value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
        },
      ] : null);

      const zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
      const zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
      const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);

      const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
      const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;

      const maxNumberOfCards = Math.min(numberOfCards, cards.length);

      if (maxNumberOfCards > 0) {
        promptParams = {
          zone,
          zoneOwner,
          restrictions,
          numberOfCards: maxNumberOfCards,
          cards: cards.map(convertCard),
        };
      }
      break;
    }
    case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
      const zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
      const zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
      const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
      const zoneContent = this.getZone(zone, zoneOwner).cards;
      const cards = zoneContent.slice(0, numberOfCards);
      promptParams = {
        zone,
        zoneOwner,
        numberOfCards,
        cards: cards.map(convertCard),
      };
      break;
    }
    case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
      if ('restrictions' in action.promptParams && action.promptParams.restrictions) {
        const restrictionsWithValues = action.promptParams.restrictions.map(({ type, value }: RestrictionObjectType) => ({
          type,
          value: this.getMetaValue(value, action.generatedBy as string),
        }));

        promptParams = {
          restrictions: restrictionsWithValues,
        };
      } else if ('restriction' in action.promptParams && action.promptParams.restriction && 'restrictionValue' in action.promptParams) {
        promptParams = {
          restrictions: [
            {
              type: action.promptParams.restriction,
              value: this.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
            }
          ],
        };
      }

      break;
    }
    case PROMPT_TYPE_CHOOSE_CARDS: {
      promptParams = action.promptParams;
      break;
    }
    case PROMPT_TYPE_NUMBER: {
      promptParams = {
        min: this.getMetaValue(action.promptParams.min, action.generatedBy as string),
        max: this.getMetaValue(action.promptParams.max, action.generatedBy as string),
      };
      break;
    }
    case PROMPT_TYPE_POWER_ON_MAGI: {
      promptParams = {
        magi: this.getMetaValue(action.promptParams.magi, action.generatedBy),
      }
      break;
    }
    case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
      if (action.promptParams.restriction) {
        promptParams = {
          amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
          restrictions: [
            {
              type: action.promptParams.restriction,
              value: this.getMetaValue(action.promptParams.amount, action.generatedBy),
            },
          ],
        };
      } else {
        promptParams = {
          amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
        };
      }
      break;
    }
    case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
      if (action.promptParams.restriction) {
        promptParams = {
          amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
          restrictions: [
            {
              type: action.promptParams.restriction,
              value: this.getMetaValue(action.promptParams.amount, action.generatedBy),
            },
          ],
        };
      } else {
        promptParams = {
          amount: this.getMetaValue(action.promptParams.amount, action.generatedBy),
        }
      }
      break;
    }
    case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
      // console.dir(this.getSpellMetadata(action.generatedBy))
      const sourceZone = this.getMetaValue(action.promptParams.sourceZone, action.generatedBy);
      const sourceZoneOwner = this.getMetaValue(action.promptParams.sourceZoneOwner, action.generatedBy);
      const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
      const zoneContent = this.getZone(sourceZone, sourceZoneOwner).cards;
      const cards = zoneContent.slice(0, numberOfCards);

      promptParams = {
        sourceZone,
        sourceZoneOwner,
        numberOfCards,
        cards: cards.map(convertCard),
        targetZones: action.promptParams.targetZones as ZoneType[],
      };
      break;
    }
  }

  this.state = {
    ...this.state,
    prompt: true,
    promptMessage: ('message' in action) ? action.message : '',
    promptPlayer,
    promptType: action.promptType,
    promptVariable: action.variable,
    promptGeneratedBy: action.generatedBy,
    promptParams,
  };
}

const applyRearrangeCardsOfZoneEffect: ActionTransformer<typeof EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE> = function (action) {
  const zone = this.getMetaValue(action.zone, action.generatedBy);
  const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
  // const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
  const zoneContent = this.getZone(zone, zoneOwner).cards;

  const cardsOrder: string[] = this.getMetaValue(action.cards, action.generatedBy);
  const cardsToRearrange: Record<string, CardInGame> = {}

  for (let i = 0; i < cardsOrder.length; i++) {
    if (i >= zoneContent.length) break;
    const currentCard = zoneContent[i]
    cardsToRearrange[currentCard.id] = currentCard;
  }
  const newZoneContent = [
    ...cardsOrder.map(id => cardsToRearrange[id]),
    ...zoneContent.slice(cardsOrder.length),
  ]

  this.getZone(zone, zoneOwner).cards = newZoneContent;
}

const applyDistributeCardsInZonesEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES> = function (action, transform) {
  const sourceZone = this.getMetaValue(action.sourceZone, action.generatedBy);
  const sourceZoneOwner = this.getMetaValue(action.sourceZoneOwner, action.generatedBy);

  const zoneContent = this.getZone(sourceZone, sourceZoneOwner);
  const cardsDistribution: Record<ZoneType, CardInGame[]> = this.getMetaValue(action.cards, action.generatedBy)
  // Check for the cards in the zone
  const totalCards = Object.values(cardsDistribution).flat()

  for (let card of totalCards) {
    if (!zoneContent.containsId(card.id)) {
      console.error(`Card ${card.id} is not in the indicated zone`);

      return;
    }
  }

  // Move the cards
  for (let [zone, zoneCards] of Object.entries(cardsDistribution)) {
    for (let card of zoneCards) {
      const targetCard = zoneContent.byId(card.id)
      if (targetCard) {
        transform({
          type: ACTION_EFFECT,
          effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
          sourceZone,
          target: targetCard,
          bottom: false,
          destinationZone: zone as ZoneType,
          generatedBy: action.generatedBy,
        })
      }
    }
  }
}

const applyPlayAttachedToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE> = function (action, transform) {
  const card: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    sourceZone: ZONE_TYPE_HAND,
    destinationZone: ZONE_TYPE_IN_PLAY,
    target: card,
    generatedBy: action.generatedBy,
    bottom: false,
  }, {
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_ATTACH_CARD_TO_CARD,
    target: '$new_card',	// We need to attach the new card in play, not the one in hand 
    attachmentTarget,
    generatedBy: action.generatedBy,
  })
}

const applyAttachCardToCardEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACH_CARD_TO_CARD> = function (action, transform) {
  const card = this.getMetaValue(action.target, action.generatedBy);
  const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);

  this.attachCard(card.id, attachmentTarget.id)

  this.transformIntoActions({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
    target: card,
    attachmentTarget: action.attachmentTarget,
    generatedBy: action.generatedBy,
  });
}

export const actionMap: Partial<ActionHandlerMap> = {
  // Beginning of turn and step
  [EFFECT_TYPE_START_TURN]: applyStartTurnEffect,
  [EFFECT_TYPE_START_OF_TURN]: applyStartOfTurnEffect,
  [EFFECT_TYPE_START_STEP]: applyStartStepEffect,
  [EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP]: applyDrawCardsInDrawStep,
  [EFFECT_TYPE_FIND_STARTING_CARDS]: applyFindStartingCardsEffect,
  [EFFECT_TYPE_DRAW_REST_OF_CARDS]: applyDrawRestOfCardsEffect,
  [EFFECT_TYPE_MAGI_FLIPPED]: applyMagiFlippedEffect,
  [EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI]: applyAddStartingEnergyToMagiEffect,

  // Discarding
  [EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]: applyDiscardCardsEffect,
  [EFFECT_TYPE_DISCARD_CARD_FROM_HAND]: applyDiscardCardEffect,
  [EFFECT_TYPE_RESHUFFLE_DISCARD]: applyReshuffleDiscardEffect,

  // Returning to hand
  [EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY]: applyReturnCreatureDiscardingEnergyEffect,
  [EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY]: applyReturnCreatureReturningEnergyEffect,

  // Drawing cards
  [EFFECT_TYPE_DRAW_N_CARDS]: applyDrawNCardsEffect,
  [EFFECT_TYPE_DRAW]: applyDrawEffect,

  // Attacking
  [EFFECT_TYPE_ATTACK]: applyAttackEffect,
  [EFFECT_TYPE_BEFORE_DAMAGE]: applyBeforeDamageEffect,
  [EFFECT_TYPE_DAMAGE_STEP]: applyDamageStepEffect,
  [EFFECT_TYPE_ATTACKER_DEALS_DAMAGE]: applyAttackerDealsDamageEffect,
  [EFFECT_TYPE_DEFENDER_DEALS_DAMAGE]: applyDefenderDealsDamageEffect,
  [EFFECT_TYPE_DEAL_DAMAGE]: applyDealDamageEffect,
  [EFFECT_TYPE_AFTER_DAMAGE]: applyAfterDamageEffect,
  [EFFECT_TYPE_CREATURE_DEFEATS_CREATURE]: applyCreatureDefeatsCreatureEffect,

  // Randomization
  [EFFECT_TYPE_ROLL_DIE]: applyRollDieEffect,
  [EFFECT_TYPE_DIE_ROLLED]: applyDieRolledEffect,

  // Powers
  [EFFECT_TYPE_EXECUTE_POWER_EFFECTS]: applyExecutePowerEffects,

  [EFFECT_TYPE_ENERGIZE]: applyEnergizeEffect,
  [EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES]: applyMoveCardsBetweenZonesEffect,
  [EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES]: applyMoveCardBetweenZonesEffect,
  [EFFECT_TYPE_DEFEAT_MAGI]: applyDefeatMagiEffect,
  [EFFECT_TYPE_MAGI_IS_DEFEATED]: applyMagiIsDefeatedEffect,
  [EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC]: applyDiscardCreatureOrRelic,
  [EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY]: applyDiscardRelicFromPlayEffect,
  [EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]: applyDiscardCreatureFromPlayEffect,
  [EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE]: applyRearrangeCardsOfZoneEffect,
  [EFFECT_TYPE_ATTACH_CARD_TO_CARD]: applyAttachCardToCardEffect,
  [EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES]: applyDistributeCardsInZonesEffect,

  // Moving energy
  [EFFECT_TYPE_MOVE_ENERGY]: applyMoveEnergyEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI]: applyAddEnergyToCreatureOrMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI]: applyDiscardEnergyFromCreatureOrMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI]: applyDiscardEnergyFromMagiEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES]: applyDiscardEnergyFromCreaturesEffect,
  [EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE]: applyDiscardEnergyFromCreatureEffect,
  [EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE]: applyRemoveEnergyFromCreatureEffect,
  [EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI]: applyRemoveEnergyFromMagiEffect,
  [EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY]: applyRestoreCreatureToStartingEnergyEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_CREATURE]: applyAddEnergyToCreatureEffect,
  [EFFECT_TYPE_ADD_ENERGY_TO_MAGI]: applyAddEnergyToMagiEffect,
  [EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: applyRearrangeEnergyOnCreaturesEffect,
  [EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: applyDistributeEnergyOnCreaturesEffect,
  [EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: applyDistributeDamageEffect,

  // Playing stuff
  [EFFECT_TYPE_PLAY_RELIC]: applyPlayRelicEffect,
  [EFFECT_TYPE_PLAY_CREATURE]: applyPlayCreatureEffect,
  [EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE]: applyStartingEnergyOnCreatureEffect,
  [EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE]: applyPlayAttachedToCreatureEffect,

  // Paying for stuff
  [EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC]: applyPayingEnergyForRelicEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL]: applyPayingEnergyForSpellEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE]: applyPayingEnergyForCreatureEffect,
  [EFFECT_TYPE_PAYING_ENERGY_FOR_POWER]: applyPayingEnergyForPowerEffect,

  // Delayed triggers, conditional and continuous effects
  [EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE]: applyForbidAttackToCreatureEffect,
  [EFFECT_TYPE_ADD_DELAYED_TRIGGER]: applyAddDelayedTriggerEffect,
  [EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT]: applyCreateContinuousEffect,
  [EFFECT_TYPE_CONDITIONAL]: applyConditionalEffect,

  // Prompt-related stuff
  [EFFECT_TYPE_PROMPT_ENTERED]: applyPromptEnteredEffect,
}
