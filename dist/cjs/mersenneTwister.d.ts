type TwisterState = {
    N: number;
    M: number;
    MATRIX_A: number;
    UPPER_MASK: number;
    LOWER_MASK: number;
    mt: Array<number>;
    mti: number;
    init_genrand: (s: number) => void;
};
export declare var MersenneTwister: (this: TwisterState, seed: number) => void;
export {};
