import { AnyEffectType } from './types';
export declare const color: {
    red: (word: string) => string;
    green: (word: string) => string;
    yellow: (word: string) => string;
    blue: (word: string) => string;
    magenta: (word: string) => string;
    cyan: (word: string) => string;
    white: (word: string) => string;
};
export declare const showAction: (action: AnyEffectType) => void;
