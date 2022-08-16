import { LOG_ENTRY_CREATURE_ENERGY_LOSS, LOG_ENTRY_ATTACK, LOG_ENTRY_CHOOSES_STARTING_CARDS, LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY, LOG_ENTRY_CREATURE_ENERGY_GAIN, LOG_ENTRY_DRAW, LOG_ENTRY_MAGI_DEFEATED, LOG_ENTRY_MAGI_ENERGY_GAIN, LOG_ENTRY_MAGI_ENERGY_LOSS, LOG_ENTRY_NUMBER_CHOICE, LOG_ENTRY_PLAY, LOG_ENTRY_POWER_ACTIVATION, LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY, LOG_ENTRY_TARGETING } from '../const';
declare type CreatureEnergyLossEntry = {
    type: typeof LOG_ENTRY_CREATURE_ENERGY_LOSS;
    card: string;
    amount: number;
};
declare type CreatureEnergyGainEntry = {
    type: typeof LOG_ENTRY_CREATURE_ENERGY_GAIN;
    card: string;
    amount: number;
};
declare type PlayEntry = {
    type: typeof LOG_ENTRY_PLAY;
    card: string;
    player: number;
};
declare type PowerActivationEntry = {
    type: typeof LOG_ENTRY_POWER_ACTIVATION;
    card: string;
    name: string;
    player: number;
};
declare type DrawEntry = {
    type: typeof LOG_ENTRY_DRAW;
    player: number;
};
declare type NumberChoiceEntry = {
    type: typeof LOG_ENTRY_NUMBER_CHOICE;
    number: number;
    player: number;
};
declare type TargetingEntry = {
    type: typeof LOG_ENTRY_TARGETING;
    card: string;
    player: number;
};
declare type ChoosesStartingCards = {
    type: typeof LOG_ENTRY_CHOOSES_STARTING_CARDS;
    player: number;
};
declare type CreatureDiscardedFromPlay = {
    type: typeof LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY;
    card: string;
    player: number;
};
declare type MagiEnergyGainEntry = {
    type: typeof LOG_ENTRY_MAGI_ENERGY_GAIN;
    card: string;
    amount: number;
};
declare type MagiEnergyLossEntry = {
    type: typeof LOG_ENTRY_MAGI_ENERGY_LOSS;
    card: string;
    amount: number;
};
declare type MagiIsDefeatedEntry = {
    type: typeof LOG_ENTRY_MAGI_DEFEATED;
    card: string;
    player: number;
};
declare type RelicDiscadedFromPlayEntry = {
    type: typeof LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY;
    card: string;
    player: number;
};
declare type AttackEntry = {
    type: typeof LOG_ENTRY_ATTACK;
    source: string;
    target: string;
};
export declare type LogEntryType = CreatureEnergyLossEntry | CreatureEnergyGainEntry | PlayEntry | PowerActivationEntry | DrawEntry | NumberChoiceEntry | TargetingEntry | ChoosesStartingCards | CreatureDiscardedFromPlay | MagiEnergyGainEntry | MagiEnergyLossEntry | MagiIsDefeatedEntry | RelicDiscadedFromPlayEntry | AttackEntry;
export {};
