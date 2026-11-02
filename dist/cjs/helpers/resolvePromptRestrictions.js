import { RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE } from '../const.js';
export function resolvePromptRestrictions(params, resolve, player) {
    const restrictions = params.restrictions || (params.restriction ? [{ type: params.restriction, value: params.restrictionValue }] : undefined);
    return restrictions?.map(({ type, value }) => ({
        type: resolve(type),
        value: (type === RESTRICTION_OWN_CREATURE || type === RESTRICTION_OPPONENT_CREATURE) && (value == null || value === '')
            ? player : resolve(value),
    }));
}
//# sourceMappingURL=resolvePromptRestrictions.js.map