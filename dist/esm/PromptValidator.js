import { TYPE_CREATURE, TYPE_RELIC, PROMPT_TYPE_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_MAGI, PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI, PROMPT_TYPE_RELIC, PROMPT_TYPE_OWN_SINGLE_CREATURE, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_MAGI_WITHOUT_CREATURES, PROMPT_TYPE_POWER_ON_MAGI, RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE, COST_X, CARD_COUNT, PROPERTY_CONTROLLER, PROPERTY_POWER_COST, ZONE_TYPE_IN_PLAY, ZONE_TYPE_ACTIVE_MAGI, ACTION_GET_PROPERTY_VALUE, ACTION_ENTER_PROMPT, } from './const.js';
export class PromptValidator {
    constructor(context) {
        this.context = context;
    }
    checkPrompts(source, preparedActions, isPower, powerCost, player, generatedBy) {
        var _a;
        var _b, _c;
        if (isPower === void 0) { isPower = false; }
        if (powerCost === void 0) { powerCost = 0; }
        if (player === void 0) { player = (_b = source === null || source === void 0 ? void 0 : source.data.controller) !== null && _b !== void 0 ? _b : 0; }
        if (generatedBy === void 0) { generatedBy = (_c = source === null || source === void 0 ? void 0 : source.id) !== null && _c !== void 0 ? _c : ''; }
        const { getZone, modifyByStaticAbilities, getOpponent, getMetaValue, checkAnyCardForRestrictions } = this.context;
        // Only creatures leave play when paying their last energy. Relic powers are paid by a Magi.
        const sourceLeavesPlay = isPower && (source === null || source === void 0 ? void 0 : source.card.type) === TYPE_CREATURE && source.data.energy <= powerCost;
        const allCardsInPlay = getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => !sourceLeavesPlay || card.id !== (source === null || source === void 0 ? void 0 : source.id));
        const creatures = allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE);
        const activeMagi = () => [...getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards, ...getZone(ZONE_TYPE_ACTIVE_MAGI, getOpponent(player)).cards];
        // Property lookups during preflight must not mutate the game's spell metadata.
        const metaValues = Object.assign({ '$player': player }, (source ? { '$source': source, '$sourceCreature': source } : {}));
        const resolve = (value, namespace = generatedBy) => typeof value === 'string' && value in metaValues ? metaValues[value] : getMetaValue(value, namespace);
        const isUnknown = (value, resolved) => typeof value === 'string' && value.startsWith('$') && (resolved == null || resolved === value);
        let firstAction = 0;
        while (((_a = preparedActions[firstAction]) === null || _a === void 0 ? void 0 : _a.type) === ACTION_GET_PROPERTY_VALUE) {
            const action = preparedActions[firstAction++];
            if (action.type !== ACTION_GET_PROPERTY_VALUE)
                break;
            const namespace = action.generatedBy || generatedBy;
            const multiTarget = resolve(action.target, namespace);
            const property = resolve(action.property, namespace);
            const target = Array.isArray(multiTarget) ? multiTarget[0] : multiTarget;
            if (isUnknown(action.target, multiTarget) || isUnknown(action.property, property))
                continue;
            const result = property === CARD_COUNT
                ? (Array.isArray(multiTarget) ? multiTarget.length : 0)
                : target && 'name' in target && 'effects' in target && property === PROPERTY_POWER_COST
                    ? target.cost
                    : target ? modifyByStaticAbilities(target, property, action.subProperty) : undefined;
            metaValues[`$${action.variable || 'result'}`] = result;
        }
        return preparedActions.slice(firstAction).every(action => {
            if (action.type !== ACTION_ENTER_PROMPT)
                return true;
            const namespace = action.generatedBy || generatedBy;
            const resolveValue = (value) => resolve(value, namespace);
            const hasMatchingCard = (cards, params) => {
                const restrictions = params.restrictions || (params.restriction ? [{ type: params.restriction, value: params.restrictionValue }] : []);
                const resolved = [];
                for (const { type, value } of restrictions) {
                    const restrictionValue = (value == null || value === '') && (type === RESTRICTION_OWN_CREATURE || type === RESTRICTION_OPPONENT_CREATURE)
                        ? player : resolveValue(value);
                    // Earlier choices/effects may supply values later. Check known constraints only.
                    if (!isUnknown(value, restrictionValue))
                        resolved.push({ type, value: restrictionValue });
                }
                return checkAnyCardForRestrictions(cards, resolved);
            };
            switch (action.promptType) {
                case PROMPT_TYPE_SINGLE_CREATURE:
                    return creatures.length > 0;
                case PROMPT_TYPE_SINGLE_MAGI:
                    return activeMagi().length > 0;
                case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
                    return creatures.length > 0 || activeMagi().length > 0;
                case PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
                    return activeMagi().some(magi => !creatures.some(card => modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === modifyByStaticAbilities(magi, PROPERTY_CONTROLLER)));
                case PROMPT_TYPE_RELIC:
                    return allCardsInPlay.some(card => card.card.type === TYPE_RELIC);
                case PROMPT_TYPE_OWN_SINGLE_CREATURE:
                    return creatures.some(card => modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === player);
                case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
                    const excluded = action.source === undefined ? source : resolveValue(action.source);
                    return creatures.some(card => card.id !== (excluded === null || excluded === void 0 ? void 0 : excluded.id));
                }
                case PROMPT_TYPE_POWER_ON_MAGI: {
                    const selected = resolveValue(action.promptParams.magi);
                    // Mirror Pendant selects the own Magi before this prompt; that variable may not exist yet.
                    const magi = isUnknown(action.promptParams.magi, selected)
                        ? getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
                        : Array.isArray(selected) ? selected : selected ? [selected] : [];
                    return magi.some(magi => { var _a; return (_a = magi.card.data.powers) === null || _a === void 0 ? void 0 : _a.some(power => power.cost === COST_X ? magi.data.energy >= 3 : power.cost + 2 <= magi.data.energy); });
                }
                case PROMPT_TYPE_SINGLE_CREATURE_FILTERED:
                    return hasMatchingCard(creatures, action.promptParams);
                case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
                    const params = action.promptParams;
                    const count = resolveValue(params.numberOfCards);
                    if (count === 0 || isUnknown(params.numberOfCards, count))
                        return true;
                    const zone = resolveValue(params.zone);
                    const owner = resolveValue(params.zoneOwner);
                    if (isUnknown(params.zone, zone) || isUnknown(params.zoneOwner, owner))
                        return true;
                    const cards = zone === ZONE_TYPE_IN_PLAY ? allCardsInPlay : getZone(zone, owner).cards;
                    // The engine caps the requested count at the number of eligible cards.
                    return (!params.restriction && !params.restrictions) || hasMatchingCard(cards, params);
                }
                // Optional choices can always select zero cards; other types have no target preflight.
                default:
                    return true;
            }
        });
    }
}
//# sourceMappingURL=PromptValidator.js.map