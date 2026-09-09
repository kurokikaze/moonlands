import { LOG_ENTRY_CREATURE_ENERGY_LOSS, LOG_ENTRY_ATTACK, LOG_ENTRY_CHOOSES_STARTING_CARDS, LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY, LOG_ENTRY_CREATURE_ENERGY_GAIN, LOG_ENTRY_DRAW, LOG_ENTRY_MAGI_DEFEATED, LOG_ENTRY_MAGI_ENERGY_GAIN, LOG_ENTRY_MAGI_ENERGY_LOSS, LOG_ENTRY_NUMBER_CHOICE, LOG_ENTRY_PLAY, LOG_ENTRY_POWER_ACTIVATION, LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY, LOG_ENTRY_TARGETING, LOG_ENTRY_DIE_ROLLED, LOG_ENTRY_CARD_DISCARDED_FROM_HAND } from '../const.js';
type CreatureEnergyLossEntry = {
    type: typeof LOG_ENTRY_CREATURE_ENERGY_LOSS;
    card: string;
    amount: number;
};
type CreatureEnergyGainEntry = {
    type: typeof LOG_ENTRY_CREATURE_ENERGY_GAIN;
    card: string;
    amount: number;
};
type PlayEntry = {
    type: typeof LOG_ENTRY_PLAY;
    card: string;
    player: number;
};
type PowerActivationEntry = {
    type: typeof LOG_ENTRY_POWER_ACTIVATION;
    card: string;
    name: string;
    player: number;
};
type DrawEntry = {
    type: typeof LOG_ENTRY_DRAW;
    player: number;
};
type NumberChoiceEntry = {
    type: typeof LOG_ENTRY_NUMBER_CHOICE;
    number: number;
    player: number;
};
type TargetingEntry = {
    type: typeof LOG_ENTRY_TARGETING;
    card: string;
    player: number;
};
type ChoosesStartingCards = {
    type: typeof LOG_ENTRY_CHOOSES_STARTING_CARDS;
    player: number;
};
type CreatureDiscardedFromPlay = {
    type: typeof LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY;
    card: string;
    player: number;
};
type MagiEnergyGainEntry = {
    type: typeof LOG_ENTRY_MAGI_ENERGY_GAIN;
    card: string;
    amount: number;
};
type MagiEnergyLossEntry = {
    type: typeof LOG_ENTRY_MAGI_ENERGY_LOSS;
    card: string;
    amount: number;
};
type MagiIsDefeatedEntry = {
    type: typeof LOG_ENTRY_MAGI_DEFEATED;
    card: string;
    player: number;
};
type RelicDiscadedFromPlayEntry = {
    type: typeof LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY;
    card: string;
    player: number;
};
type AttackEntry = {
    type: typeof LOG_ENTRY_ATTACK;
    source: string;
    target: string;
    packHuntAttack: boolean;
};
type DieRolledEntry = {
    type: typeof LOG_ENTRY_DIE_ROLLED;
    result: number;
    player?: number;
};
type CardDiscardedEntry = {
    type: typeof LOG_ENTRY_CARD_DISCARDED_FROM_HAND;
    card: string;
    player: number;
};
export type LogEntryType = CreatureEnergyLossEntry | CreatureEnergyGainEntry | PlayEntry | PowerActivationEntry | DrawEntry | NumberChoiceEntry | TargetingEntry | CardDiscardedEntry | ChoosesStartingCards | CreatureDiscardedFromPlay | MagiEnergyGainEntry | MagiEnergyLossEntry | MagiIsDefeatedEntry | RelicDiscadedFromPlayEntry | DieRolledEntry | AttackEntry;
export {};
