import * as C from '../const.js';
/** Validate before clearing a prompt or resuming its saved effects. */
export function validatePromptResolution(state, action) {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h, _j, _k, _l;
    const { promptType, promptParams: params, promptPlayer } = state.state;
    if (!state.state.prompt || !promptType)
        return false;
    const target = 'target' in action ? action.target : undefined;
    const creatures = state.getZone(C.ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type === C.TYPE_CREATURE);
    const matches = (card) => state.makeCardFilter(params.restrictions || [])(card);
    const validCards = (cards) => {
        const ids = cards.map(card => typeof card === 'string' ? card : card && typeof card === 'object' && 'id' in card ? card.id : undefined);
        return new Set(ids).size === ids.length && ids.every(id => { var _a; return (_a = params.cards) === null || _a === void 0 ? void 0 : _a.some(card => card.id === id); });
    };
    const validDistribution = (distribution, rearrange = false) => {
        const eligible = creatures.filter(card => matches(card) && (!rearrange || state.modifyByStaticAbilities(card, C.PROPERTY_CONTROLLER) === promptPlayer));
        const entries = Object.entries(distribution);
        if (!entries.every(([id, value]) => Number.isSafeInteger(value) && value >= 0 && eligible.some(card => card.id === id)))
            return false;
        const total = entries.reduce((sum, [, value]) => sum + value, 0);
        if (!rearrange)
            return total === params.amount;
        return total === eligible.reduce((sum, card) => sum + card.data.energy, 0)
            && eligible.every(card => { var _a; return (!card.card.data.energyStasis || ((_a = distribution[card.id]) !== null && _a !== void 0 ? _a : card.data.energy) === card.data.energy)
                && (card.id in distribution || card.data.energy === 0); });
    };
    switch (promptType) {
        case C.PROMPT_TYPE_SINGLE_CREATURE:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_CREATURE;
        case C.PROMPT_TYPE_SINGLE_CREATURE_FILTERED:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_CREATURE && matches(target);
        case C.PROMPT_TYPE_OWN_SINGLE_CREATURE:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_CREATURE && state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER) === promptPlayer;
        case C.PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_CREATURE && target.id !== ((_a = params.source) === null || _a === void 0 ? void 0 : _a.id);
        case C.PROMPT_TYPE_SINGLE_MAGI:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_MAGI;
        case C.PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_CREATURE || (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_MAGI;
        case C.PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_MAGI && !creatures.some(card => state.modifyByStaticAbilities(card, C.PROPERTY_CONTROLLER) === state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER));
        case C.PROMPT_TYPE_RELIC:
            return (target === null || target === void 0 ? void 0 : target.card.type) === C.TYPE_RELIC;
        case C.PROMPT_TYPE_NUMBER: {
            if (!('number' in action) || action.number === undefined || (typeof action.number === 'string' && action.number.trim() === ''))
                return false;
            const number = Number(action.number);
            return Number.isSafeInteger(number) && number >= ((_h = params.min) !== null && _h !== void 0 ? _h : -Infinity) && number <= ((_j = params.max) !== null && _j !== void 0 ? _j : Infinity);
        }
        case C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE:
        case C.PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
            if (!('cards' in action) || !Array.isArray(action.cards))
                return false;
            const count = (_k = params.numberOfCards) !== null && _k !== void 0 ? _k : 0;
            return (promptType === C.PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE ? action.cards.length === count : action.cards.length <= count)
                && validCards(action.cards) && action.cards.every(matches);
        }
        case C.PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE:
            return 'cards' in action && Array.isArray(action.cards) && action.cards.length === ((_b = params.cards) === null || _b === void 0 ? void 0 : _b.length) && validCards(action.cards);
        case C.PROMPT_TYPE_DISTRIBUTE_CARDS_IN_ZONES: {
            if (!('cards' in action) || !action.cards || Array.isArray(action.cards))
                return false;
            const cards = Object.values(action.cards).flat();
            return Object.keys(action.cards).every(zone => { var _a; return (_a = params.targetZones) === null || _a === void 0 ? void 0 : _a.includes(zone); })
                && cards.length === ((_c = params.cards) === null || _c === void 0 ? void 0 : _c.length) && validCards(cards);
        }
        case C.PROMPT_TYPE_CHOOSE_CARDS:
            return 'cards' in action && Array.isArray(action.cards)
                && new Set(action.cards).size === action.cards.length
                && action.cards.every(card => { var _a; return (_a = params.availableCards) === null || _a === void 0 ? void 0 : _a.includes(card); });
        case C.PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES:
            return 'energyOnCreatures' in action && !!action.energyOnCreatures && validDistribution(action.energyOnCreatures);
        case C.PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES:
            return 'damageOnCreatures' in action && !!action.damageOnCreatures && validDistribution(action.damageOnCreatures);
        case C.PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
            return 'energyOnCreatures' in action && !!action.energyOnCreatures && validDistribution(action.energyOnCreatures, true);
        case C.PROMPT_TYPE_PLAYER:
            return 'targetPlayer' in action && state.players.includes(action.targetPlayer);
        case C.PROMPT_TYPE_ALTERNATIVE:
            return 'alternative' in action && !!((_d = params.alternatives) === null || _d === void 0 ? void 0 : _d.some(option => option.value === action.alternative));
        case C.PROMPT_TYPE_POWER_ON_MAGI: {
            if (!('source' in action) || !('power' in action))
                return false;
            const magi = Array.isArray(params.magi) ? params.magi : params.magi ? [params.magi] : [];
            const source = state.getMetaValue(action.source, action.generatedBy);
            const power = state.getMetaValue(action.power, action.generatedBy);
            return !!source && source.card.type === C.TYPE_MAGI && magi.some(card => card.id === source.id)
                && !!((_e = source.card.data.powers) === null || _e === void 0 ? void 0 : _e.some((candidate) => candidate.name === (power === null || power === void 0 ? void 0 : power.name) && candidate.cost === power.cost
                    && (candidate.cost === C.COST_X ? source.data.energy >= 3 : candidate.cost + 2 <= source.data.energy)));
        }
        case C.PROMPT_TYPE_PAYMENT_SOURCE:
            return !!target && !!params.paymentType && !!((_f = params.cards) === null || _f === void 0 ? void 0 : _f.some(card => card.id === target.id))
                && state.modifyByStaticAbilities(target, C.PROPERTY_CONTROLLER) === promptPlayer
                && (target.card.type === C.TYPE_MAGI || (target.card.type === C.TYPE_CREATURE && !!((_g = target.card.data.paymentSource) === null || _g === void 0 ? void 0 : _g.includes(params.paymentType))))
                && target.data.energy >= ((_l = params.paymentAmount) !== null && _l !== void 0 ? _l : 0);
        case C.PROMPT_TYPE_MAY_ABILITY:
            return typeof action.useEffect === 'boolean';
        default:
            return true;
    }
}
//# sourceMappingURL=validatePromptResolution.js.map