import { State } from "..";
import CardInGame, { ConvertedCard } from "../classes/CardInGame";
import { PROMPT_TYPE_NUMBER, ACTION_EFFECT, EFFECT_TYPE_PROMPT_ENTERED, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER_OF_CREATURES, PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_SINGLE_MAGI, ZONE_TYPE_IN_PLAY } from "../const";
import { PromptType, RestrictionObjectType, ZoneType } from "../types";
import { AnyPromptEnteredEffect, NumberPromptEnteredEffect, AlternativePromptEnteredEffect, AnyCreatureExceptSourcePromptEnteredEffect, ChooseCardsPromptPromptEnteredEffect, ChooseNCardsFromZonePromptEnteredEffect, ChooseUpToNCardsFromZonePromptEnteredEffect, DistributeDamagePromptEnteredEffect, DistributeEnergyPromptEnteredEffect, DistributeCardsInZonesPromptEnteredEffect, GenericPromptEnteredEffect, GenericPromptEnteredPromptType, MayAbilityPromptEnteredEffect, PaymentSourcePromptEnteredEffect, PlayerPromptEnteredEffect, PowerOnMagiPromptEntered, RearrangeCardsOfZonePromptEnteredEffect, RearrangeEnergyPromptEnteredEffect, SingleCreatureFilteredPromptEnteredEffect } from "../types/effect";

const convertCard = (cardInGame: CardInGame): ConvertedCard => ({
    id: cardInGame.id,
    owner: cardInGame.owner,
    card: cardInGame.card.name,
    data: cardInGame.data,
});

export default function convertPromptActionToEffect(action: PromptType & { source: CardInGame }, state: State): AnyPromptEnteredEffect {
    const player = state.getMetaValue(action.player, action.generatedBy) as number;
    switch (action.promptType) {
        case PROMPT_TYPE_NUMBER: {
            const effect: NumberPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                promptParams: {
                    min: state.getMetaValue(action.promptParams.min, action.generatedBy) as number,
                    max: state.getMetaValue(action.promptParams.max, action.generatedBy) as number,
                },
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect;
        }
        case PROMPT_TYPE_ALTERNATIVE: {
            const effect: AlternativePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
            const effect: AnyCreatureExceptSourcePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
                source: state.getMetaValue(action.source, action.generatedBy) as CardInGame,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }

            return effect
        }
        case PROMPT_TYPE_CHOOSE_CARDS: {
            const effect: ChooseCardsPromptPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);

            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy) as ZoneType;
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);

            const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;

            const maxNumberOfCards = Math.min(numberOfCards, cards.length);

            const effect: ChooseNCardsFromZonePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
                promptParams: {
                    zone,
                    zoneOwner,
                    restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                },
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            const restrictions = action.promptParams.restrictions || (action.promptParams.restriction ? [
                {
                    type: state.getMetaValue(action.promptParams.restriction, action.generatedBy),
                    value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                },
            ] : undefined);

            const zone = state.getMetaValue(action.promptParams.zone, action.generatedBy);
            const zoneOwner = state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
            const numberOfCards = state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);

            const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? state.getZone(zone, null).cards : state.getZone(zone, zoneOwner).cards;
            const cards = restrictions ? zoneContent.filter(state.makeCardFilter(restrictions)) : zoneContent;

            const maxNumberOfCards = Math.min(numberOfCards, cards.length);
            const effect: ChooseUpToNCardsFromZonePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                promptParams: {
                    zone,
                    zoneOwner,
                    restrictions,
                    numberOfCards: maxNumberOfCards,
                    cards: cards.map(convertCard),
                },
                player,
            }
            return effect
        }
        case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
            const effect: DistributeDamagePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptParams: {
                    amount: state.getMetaValue(action.promptParams.amount, action.generatedBy),
                },
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
            const effect: DistributeEnergyPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
            const effect: DistributeCardsInZonesPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_MAY_ABILITY: {
            const effect: MayAbilityPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: PROMPT_TYPE_MAY_ABILITY,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_PAYMENT_SOURCE: {
            const effect: PaymentSourcePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_PLAYER: {
            const effect: PlayerPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                promptType: PROMPT_TYPE_PLAYER,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_POWER_ON_MAGI: {
            const effect: PowerOnMagiPromptEntered = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
            const effect: RearrangeCardsOfZonePromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                promptParams: {
                    ...action.promptParams,
                    zone: state.getMetaValue(action.promptParams.zone, action.generatedBy) as ZoneType,
                    zoneOwner: state.getMetaValue(action.promptParams.zoneOwner, action.generatedBy) as number,
                    numberOfCards: state.getMetaValue(action.promptParams.numberOfCards, action.generatedBy) as number,
                },
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect as RearrangeCardsOfZonePromptEnteredEffect;
        }
        case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES: {
            const effect: RearrangeEnergyPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_RELIC: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_SINGLE_CREATURE: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
            let restrictions: RestrictionObjectType[] = [];
            if ('restrictions' in action.promptParams) {
                restrictions = action.promptParams.restrictions.map(({ type, value }: RestrictionObjectType) => ({
                    type,
                    value: state.getMetaValue(value, action.generatedBy as string),
                }));
            } else if ('restriction' in action.promptParams) {
                restrictions = [
                    {
                        type: action.promptParams.restriction,
                        value: state.getMetaValue(action.promptParams.restrictionValue, action.generatedBy),
                    }
                ]
            }


            const effect: SingleCreatureFilteredPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }

            if (restrictions.length) {
                effect.promptParams = {
                    restrictions,
                };
            }
            return effect
        }
        case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
        case PROMPT_TYPE_SINGLE_MAGI: {
            const effect: GenericPromptEnteredEffect = {
                ...action,
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_PROMPT_ENTERED,
                promptType: action.promptType as GenericPromptEnteredPromptType,
                generatedBy: action.generatedBy || 'the-game',
                player,
            }
            return effect
        }
    }
}