import type { RestrictionObjectType, RestrictionType } from '../types/index.js';
export declare function resolvePromptRestrictions(params: {
    restrictions?: RestrictionObjectType[] | null;
    restriction?: RestrictionType;
    restrictionValue?: any;
}, resolve: (value: any) => any, player: number): RestrictionObjectType[] | undefined;
