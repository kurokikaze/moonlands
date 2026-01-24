import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  ACTION_PLAYER_WINS,
  ACTION_SELECT,
  EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
  EFFECT_TYPE_DEFEAT_MAGI,
  EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
  EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
  EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
  EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES,
  EFFECT_TYPE_MAGI_IS_DEFEATED,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
  EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE,
  SELECTOR_OWN_CARDS_IN_PLAY,
  TYPE_CREATURE,
  TYPE_RELIC,
  ZONE_TYPE_ACTIVE_MAGI,
  ZONE_TYPE_DEFEATED_MAGI,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_IN_PLAY,
  ZONE_TYPE_MAGI_PILE,
} from "../../const";
import { ZoneType } from "../../types";
import { oneOrSeveral } from "../actionMapUtils";
import { ActionTransformer } from "../actionMapTypes";
import { DiscardCreatureFromPlayEffect, MoveCardBetwenZonesEffect } from "../../types/effect";

export const applyMoveCardsBetweenZonesEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES> = function (action, transform, _state, seeded_nanoid) {
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

export const applyMoveCardBetweenZonesEffect: ActionTransformer<typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES> = function (action, transform, _state, seeded_nanoid) {
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

export const applyDefeatMagiEffect: ActionTransformer<typeof EFFECT_TYPE_DEFEAT_MAGI> = function (action, transform) {
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

export const applyMagiIsDefeatedEffect: ActionTransformer<typeof EFFECT_TYPE_MAGI_IS_DEFEATED> = function (action, transform) {
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

export const applyDiscardCreatureOrRelic: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC> = function (action, transform) {
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

export const applyDiscardRelicFromPlayEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY> = function (action, transform) {
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

export const applyDiscardCreatureFromPlayEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY> = function (action, transform) {
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

export const applyRearrangeCardsOfZoneEffect: ActionTransformer<typeof EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE> = function (action) {
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

export const applyDistributeCardsInZonesEffect: ActionTransformer<typeof EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES> = function (action, transform) {
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
