import { TYPE_CREATURE, TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_RELIC, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, COST_X, PROPERTY_CONTROLLER, ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI, ACTION_GET_PROPERTY_VALUE, ACTION_ENTER_PROMPT, } from './const.js';
export class PromptValidator {
    constructor(context) {
        this.context = context;
    }
    checkPrompts(source, preparedActions, isPower, powerCost, player, generatedBy) {
        var _a, _b, _c;
        if (isPower === void 0) { isPower = false; }
        if (powerCost === void 0) { powerCost = 0; }
        if (player === void 0) { player = (_a = source === null || source === void 0 ? void 0 : source.data.controller) !== null && _a !== void 0 ? _a : 0; }
        if (generatedBy === void 0) { generatedBy = (_b = source === null || source === void 0 ? void 0 : source.id) !== null && _b !== void 0 ? _b : ''; }
        const { getZone, modifyByStaticAbilities, getOpponent, getMetaValue, checkAnyCardForRestrictions, checkAnyCardForRestriction } = this.context;
        const testedActions = [...preparedActions];
        // Calculate if prompts are resolvable
        // If source is Magi, it will not be filtered out, being in another zone
        const creatureWillSurvive = !isPower || ((_c = source === null || source === void 0 ? void 0 : source.data.energy) !== null && _c !== void 0 ? _c : 0) > powerCost;
        const ourCardsInPlay = getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => (creatureWillSurvive ? true : card.id !== (source === null || source === void 0 ? void 0 : source.id)) && modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === player);
        const allCardsInPlay = getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => creatureWillSurvive ? true : card.id !== (source === null || source === void 0 ? void 0 : source.id));
        const metaValues = source ? {
            '$source': source,
            '$sourceCreature': source,
        } : {};
        while (testedActions.length && testedActions[0].type === ACTION_GET_PROPERTY_VALUE) {
            const valueGetter = testedActions[0];
            testedActions.shift();
            const multiTarget = valueGetter.source;
            const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
            const property = getMetaValue(valueGetter.property, valueGetter.generatedBy || '');
            const modifiedResult = modifyByStaticAbilities(target, property);
            const variable = valueGetter.variable || 'result';
            metaValues[`$${variable}`] = modifiedResult;
        }
        // powerPromptsDoable
        const testablePrompts = [
            PROMPT_TYPE_SINGLE_CREATURE,
            PROMPT_TYPE_RELIC,
            PROMPT_TYPE_OWN_SINGLE_CREATURE,
            PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
            PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
            PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
            PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
            PROMPT_TYPE_POWER_ON_MAGI,
        ];
        const testablePromptFilter = (action) => action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);
        const allPrompts = testedActions.filter(testablePromptFilter);
        const allPromptsAreDoable = allPrompts.every(promptAction => {
            switch (promptAction.promptType) {
                case PROMPT_TYPE_SINGLE_CREATURE:
                    return allCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
                case PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    const opponent = getOpponent(player);
                    const magi = [...getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards, ...getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards];
                    return magi.some(magi => !allCardsInPlay.some(card => card.card.type === TYPE_CREATURE && modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === magi.data.controller));
                case PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(card => card.card.type === TYPE_RELIC);
                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return ourCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    return getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.id !== (source === null || source === void 0 ? void 0 : source.id));
                }
                case PROMPT_TYPE_POWER_ON_MAGI: {
                    const magi = getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
                    return magi.some(magi => magi.card.data.powers && magi.card.data.powers.some(power => power.cost === COST_X || (power.cost <= magi.data.energy + 2)));
                }
                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
                    if ('restrictions' in promptAction.promptParams && promptAction.promptParams.restrictions) {
                        const restrictionsWithValues = promptAction.promptParams.restrictions.map(({ type, value }) => {
                            const restrictionValue = (typeof value === 'string' &&
                                value in metaValues) ? metaValues[value] : value;
                            return {
                                type,
                                value: restrictionValue,
                            };
                        });
                        return checkAnyCardForRestrictions(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), restrictionsWithValues);
                    }
                    else if ('restriction' in promptAction.promptParams) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            default: {
                                const restrictionValue = (typeof promptAction.promptParams.restrictionValue === 'string' &&
                                    promptAction.promptParams.restrictionValue in metaValues) ? metaValues[promptAction.promptParams.restrictionValue] : promptAction.promptParams.restrictionValue;
                                return checkAnyCardForRestriction(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    const zoneOwner = getMetaValue(promptAction.promptParams.zoneOwner, generatedBy);
                    const cardsInZone = getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    const numberOfCards = getMetaValue(promptAction.promptParams.numberOfCards, generatedBy);
                    // if (cardsInZone.length < numberOfCards) {
                    //	 return false;
                    // }
                    if (promptAction.promptParams.restrictions) {
                        return checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            default: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
                    const zoneOwner = getMetaValue(promptAction.promptParams.zoneOwner, generatedBy);
                    const cardsInZone = getZone(promptAction.promptParams.zone, zoneOwner).cards;
                    if (promptAction.promptParams.restrictions) {
                        return checkAnyCardForRestrictions(cardsInZone, promptAction.promptParams.restrictions);
                    }
                    else if (promptAction.promptParams.restriction) {
                        switch (promptAction.promptParams.restriction) {
                            case RESTRICTION_OWN_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            case RESTRICTION_OPPONENT_CREATURE: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, player);
                            }
                            default: {
                                return checkAnyCardForRestriction(cardsInZone.filter(card => card.card.type === TYPE_CREATURE), promptAction.promptParams.restriction, promptAction.promptParams.restrictionValue);
                            }
                        }
                    }
                    return true;
                }
                default:
                    return true;
            }
        });
        return allPromptsAreDoable;
    }
}
//# sourceMappingURL=PromptValidator.js.map