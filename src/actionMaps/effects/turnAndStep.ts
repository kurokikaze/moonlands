import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  ACTION_ENTER_PROMPT,
  ACTION_PASS,
  ACTION_SELECT,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
  EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
  EFFECT_TYPE_DRAW_REST_OF_CARDS,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_FIND_STARTING_CARDS,
  EFFECT_TYPE_MAGI_FLIPPED,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_START_OF_TURN,
  EFFECT_TYPE_START_STEP,
  EFFECT_TYPE_START_TURN,
  EFFECT_TYPE_ADD_DELAYED_TRIGGER,
  NO_PRIORITY,
  PRIORITY_ATTACK,
  PRIORITY_CREATURES,
  PRIORITY_PRS,
  PROMPT_TYPE_CHOOSE_CARDS,
  PROPERTY_MAGI_STARTING_ENERGY,
  SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
  SELECTOR_OWN_MAGI,
  TYPE_CREATURE,
  TYPE_RELIC,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DEFEATED_MAGI,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_MAGI_PILE,
} from "../../const";
import { AnyEffectType, ContinuousEffectType } from "../../types";
import { oneOrSeveral, updateContinuousEffects } from "../actionMapUtils";
import { ActionTransformer, ProtoEffectType, ProtoChooseCardsPrompt, StepType } from "../actionMapTypes";

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

export const applyStartTurnEffect: ActionTransformer<typeof EFFECT_TYPE_START_TURN> = function (action, transform) {
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
    step: 0,
  };
}

export const applyDrawCardsInDrawStep: ActionTransformer<typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP> = function (action, transform) {
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

export const applyStartOfTurnEffect: ActionTransformer<typeof EFFECT_TYPE_START_OF_TURN> = function (action, transform) {
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

export const applyStartStepEffect: ActionTransformer<typeof EFFECT_TYPE_START_STEP> = function (action) {
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

export const applyAddDelayedTriggerEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER> = function (action, _transform, _state, seeded_nanoid) {
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

export const applyFindStartingCardsEffect: ActionTransformer<typeof EFFECT_TYPE_FIND_STARTING_CARDS> = function (action, transform) {
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

export const applyDrawRestOfCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_REST_OF_CARDS> = function (action, transform) {
  const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
  const number = 5 - foundCards.length;

  if (number > 0) {
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

export const applyMagiFlippedEffect: ActionTransformer<typeof EFFECT_TYPE_MAGI_FLIPPED> = function (action, transform) {
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

export const applyAddStartingEnergyToMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI> = function (action, transform) {
  const magiTargets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(magiTargets, (magiTarget: CardInGame) => {
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
