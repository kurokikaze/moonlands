import CardInGame, { ConvertedCard } from "../../classes/CardInGame";
import {
  EFFECT_TYPE_PROMPT_ENTERED,
  PROMPT_TYPE_ALTERNATIVE,
  PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
  PROMPT_TYPE_CHOOSE_CARDS,
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
  PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
  ZONE_TYPE_IN_PLAY,
} from "../../const";
import { RestrictionObjectType, ZoneType } from "../../types";
import { ActionTransformer } from "../actionMapTypes";
import { PromptParamsType } from "../..";

const convertCard = (cardInGame: CardInGame): ConvertedCard => ({
  id: cardInGame.id,
  owner: cardInGame.owner,
  card: cardInGame.card.name,
  data: cardInGame.data,
});

export const applyPromptEnteredEffect: ActionTransformer<typeof EFFECT_TYPE_PROMPT_ENTERED> = function (action) {
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
