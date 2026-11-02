import { RESTRICTION_OWN_CREATURE, RESTRICTION_OPPONENT_CREATURE } from '../const.js';
import type { RestrictionObjectType, RestrictionType } from '../types/index.js';

export function resolvePromptRestrictions(
	params: { restrictions?: RestrictionObjectType[] | null; restriction?: RestrictionType; restrictionValue?: any },
	resolve: (value: any) => any,
	player: number,
): RestrictionObjectType[] | undefined {
	const restrictions = params.restrictions || (params.restriction ? [{ type: params.restriction, value: params.restrictionValue }] : undefined);
	return restrictions?.map(({ type, value }) => ({
		type: resolve(type),
		value: (type === RESTRICTION_OWN_CREATURE || type === RESTRICTION_OPPONENT_CREATURE) && (value == null || value === '')
			? player : resolve(value),
	})) as RestrictionObjectType[] | undefined;
}
