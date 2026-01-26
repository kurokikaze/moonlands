import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  ACTION_GET_PROPERTY_VALUE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
  EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
  EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
  EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
  EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
  EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_ENERGIZE,
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
  EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_ENERGY,
  EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
  EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
  EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
  EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
  PROPERTY_ENERGIZE,
  PROPERTY_ENERGY_COUNT,
  PROPERTY_ENERGY_LOSS_THRESHOLD,
  SELECTOR_OWN_CREATURES,
  SELECTOR_OWN_MAGI,
  TYPE_CREATURE,
  TYPE_MAGI,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
  ZONE_TYPE_IN_PLAY,
} from "../../const";
import { oneOrSeveral } from "../actionMapUtils";
import { ActionTransformer } from "../actionMapTypes";
import { DiscardCreatureFromPlayEffect, DiscardEnergyFromCreatureEffect } from "../../types/effect";

export const applyReturnCreatureDiscardingEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY> =
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

export const applyReturnCreatureReturningEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY> = function (action, transform) {
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

export const applyEnergizeEffect: ActionTransformer<typeof EFFECT_TYPE_ENERGIZE> = function (action, transform) {
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

export const applyMoveEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_ENERGY> = function (action, transform, _state) {
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

export const applyAddEnergyToCreatureOrMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI> = function (action, transform) {
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

export const applyDiscardEnergyFromMagiEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI> = function (action, transform) {
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

export const applyDiscardEnergyFromCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES> = function (action, transform) {
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

export const applyDiscardEnergyFromCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE> = function (action, transform) {
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

export const applyRemoveEnergyFromCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE> = function (action, transform) {
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

export const applyRemoveEnergyFromMagiEffect: ActionTransformer<typeof EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI> = function (action) {
  const target: CardInGame = this.getMetaValue(action.target, action.generatedBy);
  const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
  if (target.card.type === TYPE_MAGI) {
    target.removeEnergy(energyToLose);
  }
}

export const applyRestoreCreatureToStartingEnergyEffect: ActionTransformer<typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY> = function (action, transform) {
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

export const applyAddEnergyToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE> = function (action) {
  const addTargets = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(addTargets, addTarget => {
    if (this.isCardAffectedByEffect(addTarget, action)) {
      addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10));
    }
  });
}

export const applyAddEnergyToMagiEffect: ActionTransformer<typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI> = function (action) {
  const magiTarget = this.getMetaValue(action.target, action.generatedBy);

  oneOrSeveral(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
}

export const applyRearrangeEnergyOnCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES> = function (action, transform) {
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

export const applyDistributeEnergyOnCreaturesEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES> = function (action) {
  const energyArrangement: Record<string, number> = this.getMetaValue(action.energyOnCreatures, action.generatedBy);

  this.getZone(ZONE_TYPE_IN_PLAY).cards.forEach(card => {
    if (card.card.type === TYPE_CREATURE && card.id in energyArrangement) {
      const energyAmount = energyArrangement[card.id];
      card.addEnergy(energyAmount);
    }
  });
}

export const applyDistributeDamageEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES> = function (action, transform) {
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
