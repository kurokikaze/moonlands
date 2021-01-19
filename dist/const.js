export const ACTION_PASS = 'actions/pass';
export const ACTION_PLAY = 'actions/play';
export const ACTION_POWER = 'actions/power';
export const ACTION_EFFECT = 'actions/effect';
export const ACTION_SELECT = 'actions/select';
export const ACTION_CALCULATE = 'actions/calculate';
export const ACTION_ENTER_PROMPT = 'actions/enter_prompt';
export const ACTION_RESOLVE_PROMPT = 'actions/resolve_prompt';
export const ACTION_GET_PROPERTY_VALUE = 'actions/get_property_value';
export const ACTION_ATTACK = 'actions/attack';
export const ACTION_CONCEDE = 'actions/concede';
export const ACTION_PLAYER_WINS = 'actions/player_wins';
export const ACTION_NONE = 'actions/none';
export const ACTION_PROPERTY = 'special_properties/action_property';
export const PROPERTY_ID = 'properties/id';
export const PROPERTY_TYPE = 'properties/type';
export const PROPERTY_ENERGY_COUNT = 'properties/energy_count';
export const PROPERTY_CONTROLLER = 'properties/controller';
export const PROPERTY_REGION = 'properties/region';
export const PROPERTY_COST = 'properties/cost';
export const PROPERTY_ENERGIZE = 'properties/energize';
export const PROPERTY_CREATURE_TYPES = 'properties/creature_types';
export const PROPERTY_MAGI_STARTING_ENERGY = 'properties/magi_starting_energy';
export const PROPERTY_ATTACKS_PER_TURN = 'properties/attacks_per_turn';
export const PROPERTY_ABLE_TO_ATTACK = 'properties/able_to_attack';
export const PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = 'properties/can_attack_magi_directly';
export const PROPERTY_POWER_COST = 'properties/power_cost'; // NOT FOR PROPERTY GETTER, ONLY STATIC ABILITIES
export const PROPERTY_ENERGY_LOSS_THRESHOLD = 'properties/energy_loss_threshold';
// Maybe make statuses into separate category
export const PROPERTY_STATUS_DEFEATED_CREATURE = 'properties/status/defeated_creature';
export const PROPERTY_STATUS_WAS_ATTACKED = 'properties/status/was_attacked';
export const PROPERTY_STATUS = 'properties/status';
export const SELECTOR_OPPONENT_ID = 'selectors/opponent_id'; // THIS WILL RETURN ID OF PLAYER'S OPPONENT
export const SELECTOR_CREATURES = 'selectors/creatures';
export const SELECTOR_MAGI = 'selectors/magi';
export const SELECTOR_CREATURES_AND_MAGI = 'selectors/creatures_and_magi';
export const SELECTOR_OWN_MAGI = 'selectors/own_magi';
export const SELECTOR_TOP_MAGI_OF_PILE = 'selectors/top_magi_of_pile';
export const SELECTOR_ENEMY_MAGI = 'selectors/enemy_magi';
export const SELECTOR_CREATURES_OF_REGION = 'selectors/creatures_of_region';
export const SELECTOR_CREATURES_NOT_OF_REGION = 'selectors/creatures_not_of_region';
export const SELECTOR_MAGI_OF_REGION = 'selectors/magi_of_region';
export const SELECTOR_MAGI_NOT_OF_REGION = 'selectors/magi_not_of_region';
export const SELECTOR_OWN_CREATURES = 'selectors/own_creatures';
export const SELECTOR_ENEMY_CREATURES = 'selectors/enemy_creatures';
export const SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE = 'selectors/own_cards_with_energize_rate';
export const SELECTOR_CARDS_WITH_ENERGIZE_RATE = 'selectors/cards_with_energize_rate';
export const SELECTOR_OWN_CARDS_IN_PLAY = 'selectors/own_cards_in_play';
export const SELECTOR_CREATURES_OF_TYPE = 'selectors/creatures_of_type';
export const SELECTOR_CREATURES_NOT_OF_TYPE = 'selectors/creatures_not_of_type';
export const SELECTOR_OWN_CREATURES_OF_TYPE = 'selectors/own_creatures_of_type';
export const SELECTOR_OTHER_CREATURES_OF_TYPE = 'selectors/other_creatures_of_type';
export const SELECTOR_RELICS = 'selectors/relics';
export const SELECTOR_OWN_SPELLS_IN_HAND = 'selectors/own_spells_in_hand';
export const SELECTOR_OWN_CREATURES_WITH_STATUS = 'selectors/own_creatures_with_status';
export const SELECTOR_CREATURES_WITHOUT_STATUS = 'selectors/creatures_without_status';
export const SELECTOR_STATUS = 'selectors/status';
export const STATUS_BURROWED = 'status/burrowed';
export const STATUS_FROZEN = 'status/frozen';
export const CALCULATION_SET = 'calculations/set';
export const CALCULATION_DOUBLE = 'calculations/double';
export const CALCULATION_ADD = 'calculations/add';
export const CALCULATION_SUBTRACT = 'calculations/subtract';
export const CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE = 'calculations/subtract_to_minimum_of_one';
export const CALCULATION_HALVE_ROUND_DOWN = 'calculations/halve_round_down';
export const CALCULATION_HALVE_ROUND_UP = 'calculations/halve_round_up';
export const CALCULATION_MIN = 'calculations/min';
export const CALCULATION_MAX = 'calculations/max';
export const REGION_ARDERIAL = 'regions/arderial';
export const REGION_CALD = 'regions/cald';
export const REGION_NAROOM = 'regions/naroom';
export const REGION_OROTHE = 'regions/orothe';
export const REGION_UNDERNEATH = 'regions/underneath';
// export const REGION_WEAVE = 'regions/weave';
// export const REGION_KYBARS_TEETH = 'regions/kybars_teeth';
export const REGION_BOGRATH = 'regions/bograth';
// export const REGION_PARADWYN = 'regions/paradwyn';
// export const REGION_D_RESH = 'regions/d_resh';
export const REGION_UNIVERSAL = 'regions/universal';
export const EFFECT_TYPE_NONE = 'effects/none';
export const EFFECT_TYPE_DRAW = 'effects/draw';
export const EFFECT_TYPE_START_STEP = 'effects/start_step';
export const EFFECT_TYPE_START_TURN = 'effects/start_turn';
export const EFFECT_TYPE_RESHUFFLE_DISCARD = 'effects/reshuffle_discard';
export const EFFECT_TYPE_ATTACK = 'effects/attack';
export const EFFECT_TYPE_BEFORE_DAMAGE = 'effects/before_damage';
export const EFFECT_TYPE_ATTACKER_DEALS_DAMAGE = 'effects/attacker_deals_damage';
export const EFFECT_TYPE_DEFENDER_DEALS_DAMAGE = 'effects/defender_deals_damage';
export const EFFECT_TYPE_DEAL_DAMAGE = 'effects/deal_damage';
export const EFFECT_TYPE_AFTER_DAMAGE = 'effects/after_damage';
export const EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = 'effects/creature_defeats_creature';
export const EFFECT_TYPE_CREATURE_IS_DEFEATED = 'effects/creature_is_defeated';
export const EFFECT_TYPE_DEFEAT_MAGI = 'effects/defeat_magi';
export const EFFECT_TYPE_MAGI_IS_DEFEATED = 'effects/magi_is_defeated';
export const EFFECT_TYPE_ROLL_DIE = 'effects/roll_die';
export const EFFECT_TYPE_MOVE_ENERGY = 'effects/move_energy';
export const EFFECT_TYPE_PLAY_CREATURE = 'effects/play_creature';
export const EFFECT_TYPE_PLAY_RELIC = 'effects/play_relic';
export const EFFECT_TYPE_PLAY_SPELL = 'effects/play_spell';
export const EFFECT_TYPE_CREATURE_ENTERS_PLAY = 'effects/creature_enters_play';
export const EFFECT_TYPE_RELIC_ENTERS_PLAY = 'effects/relic_enters_play';
export const EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = 'effects/paying_energy_for_relic';
export const EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = 'effects/paying_energy_for_spell';
export const EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = 'effects/paying_energy_for_creature';
export const EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = 'effects/starting_energy_on_creature';
export const EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = 'effects/move_card_between_zones';
export const EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES = 'effects/move_cards_between_zones';
export const EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES = 'effects/card_moved_between_zones';
export const EFFECT_TYPE_CONDITIONAL = 'effects/conditional';
export const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = 'effects/add_energy_to_creature_or_magi';
export const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 'effects/add_energy_to_creature';
export const EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 'effects/add_energy_to_magi';
export const EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI = 'effects/add_starting_energy_to_magi';
export const EFFECT_TYPE_ENERGIZE = 'effects/energize';
export const EFFECT_TYPE_DAMAGE_STEP = 'effects/damage_step';
export const EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY = 'effects/return_creature_discarding_energy';
export const EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY = 'effects/return_creature_returning_energy';
export const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 'effects/discard_energy_from_creature';
export const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES = 'effects/discard_energy_from_creatures';
export const EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = 'effects/discard_energy_from_magi';
export const EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = 'effects/discard_creature_from_play';
export const EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC = 'effects/discard_creature_or_relic';
export const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = 'effects/discard_energy_from_creature_or_magi';
export const EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = 'effects/restore_creature_to_starting_energy';
export const EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = 'effects/paying_energy_for_power';
export const EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = 'effects/discard_relic_from_play';
export const EFFECT_TYPE_CREATURE_ATTACKS = 'effects/creature_attacks';
export const EFFECT_TYPE_CREATURE_IS_ATTACKED = 'effects/creature_is_attacked';
export const EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP = 'effects/draw_cards_in_draw_step';
export const EFFECT_TYPE_START_OF_TURN = 'effects/start_of_turn';
export const EFFECT_TYPE_END_OF_TURN = 'effects/end_of_turn';
export const EFFECT_TYPE_MAGI_FLIPPED = 'effects/magi_flipped';
export const EFFECT_TYPE_FIND_STARTING_CARDS = 'effects/find_starting_cards';
export const EFFECT_TYPE_DRAW_REST_OF_CARDS = 'effects/draw_rest_of_cards';
export const EFFECT_TYPE_DISCARD_CARDS_FROM_HAND = 'effects/discard_cards_from_hand';
export const EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE = 'effects/forbid_attack_to_creature';
export const EFFECT_TYPE_ADD_DELAYED_TRIGGER = 'effects/add_delayed_trigger';
export const NO_PRIORITY = 0;
export const PRIORITY_PRS = 1;
export const PRIORITY_ATTACK = 2;
export const PRIORITY_CREATURES = 3;
export const PROMPT_TYPE_CHOOSE_CARDS = 'prompt/choose_cards';
export const PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE = 'prompt/choose_n_cards_from_zone';
export const PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = 'prompt/any_creature_except_source';
export const PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI = 'prompt/creature_or_magi';
export const PROMPT_TYPE_SINGLE_CREATURE = 'prompt/creature';
export const PROMPT_TYPE_OWN_SINGLE_CREATURE = 'prompt/own_creature';
export const PROMPT_TYPE_SINGLE_CREATURE_FILTERED = 'prompt/creature_filtered';
export const PROMPT_TYPE_NUMBER_OF_CREATURES = 'prompt/number_of_creatures';
export const PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED = 'prompt/number_of_creatures_filtered';
export const PROMPT_TYPE_SINGLE_MAGI = 'prompt/magi';
export const PROMPT_TYPE_RELIC = 'prompt/relic';
export const PROMPT_TYPE_NUMBER = 'prompt/number';
export const PROMPT_TYPE_MAY_ABILITY = 'prompt/may_ability';
export const RESTRICTION_TYPE = 'restrictions/type';
export const RESTRICTION_ENERGY_LESS_THAN_STARTING = 'restrictions/energy_less_than_starting';
export const RESTRICTION_ENERGY_LESS_THAN = 'restrictions/energy_less_than';
export const RESTRICTION_OWN_CREATURE = 'restrictions/own_creature';
export const RESTRICTION_OPPONENT_CREATURE = 'restrictions/opponent_creature';
export const RESTRICTION_REGION = 'restrictions/region';
export const RESTRICTION_CREATURE_TYPE = 'restrictions/creature_type';
export const RESTRICTION_PLAYABLE = 'restrictions/card_playable';
export const RESTRICTION_CREATURE_WAS_ATTACKED = 'restrictions/creature_was_attacked';
export const RESTRICTION_MAGI_WITHOUT_CREATURES = 'restrictions/magi_without_creatures';
export const RESTRICTION_STATUS = 'restrictions/status';
export const TYPE_CREATURE = 'types/creature';
export const TYPE_MAGI = 'types/magi';
export const TYPE_RELIC = 'types/relic';
export const TYPE_SPELL = 'types/spell';
export const COST_X = 'X';
export const ZONE_TYPE_ACTIVE_MAGI = 'zones/active_magi';
export const ZONE_TYPE_MAGI_PILE = 'zones/magi_pile';
export const ZONE_TYPE_DEFEATED_MAGI = 'zones/defeated_magi';
export const ZONE_TYPE_DECK = 'zones/deck';
export const ZONE_TYPE_IN_PLAY = 'zones/in_play';
export const ZONE_TYPE_DISCARD = 'zones/discard';
export const ZONE_TYPE_HAND = 'zones/hand';
export const LOG_ENTRY_PLAY = 'log_entry/play';
export const LOG_ENTRY_DRAW = 'log_entry/draw';
export const LOG_ENTRY_CHOOSES_STARTING_CARDS = 'log_entry/choose_starting_cards';
export const LOG_ENTRY_POWER_ACTIVATION = 'log_entry/power_activation';
export const LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY = 'log_entry/creature_discarded_from_play';
export const LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY = 'log_entry/relic_discarded_from_play';
export const LOG_ENTRY_TARGETING = 'log_entry/targeting';
export const LOG_ENTRY_NUMBER_CHOICE = 'log_entry/number_choice';
export const LOG_ENTRY_ATTACK = 'log_entry/attack';
export const LOG_ENTRY_CREATURE_ENERGY_LOSS = 'log_entry/creature_energy_loss';
export const LOG_ENTRY_MAGI_ENERGY_LOSS = 'log_entry/magi_energy_loss';
export const LOG_ENTRY_CREATURE_ENERGY_GAIN = 'log_entry/creature_energy_gain';
export const LOG_ENTRY_MAGI_ENERGY_GAIN = 'log_entry/magi_energy_gain';
export const LOG_ENTRY_MAGI_DEFEATED = 'log_entry/magi_defeated';
//# sourceMappingURL=const.js.map