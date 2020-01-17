const ACTION_PASS = 'actions/pass';
const ACTION_PLAY = 'actions/play';
const ACTION_POWER = 'actions/power';
const ACTION_EFFECT = 'actions/effect';
const ACTION_SELECT = 'actions/select';
const ACTION_CALCULATE = 'actions/calculate';
const ACTION_ENTER_PROMPT = 'actions/enter_prompt';
const ACTION_RESOLVE_PROMPT = 'actions/resolve_prompt';
const ACTION_GET_PROPERTY_VALUE = 'actions/get_property_value';
const ACTION_ATTACK = 'actions/attack';
// const ACTION_NOOP = 'actions/noop'; // Empty actions for replacement

const PROPERTY_ID = 'properties/id';
const PROPERTY_TYPE = 'properties/type';
const PROPERTY_ENERGY_COUNT = 'properties/energy_count';
const PROPERTY_CONTROLLER = 'properties/controller';
const PROPERTY_REGION = 'properties/region';
const PROPERTY_COST = 'properties/cost';
const PROPERTY_ENERGIZE = 'properties/energize';
const PROPERTY_MAGI_STARTING_ENERGY = 'properties/magi_starting_energy';
const PROPERTY_ATTACKS_PER_TURN = 'properties/attacks_per_turn';
const PROPERTY_CAN_ATTACK_MAGI_DIRECTLY = 'properties/can_attack_magi_directly';

const SELECTOR_OPPONENT_ID = 'selectors/opponent_id'; // THIS WILL RETURN ID OF PLAYER'S OPPONENT
const SELECTOR_CREATURES = 'selectors/creatures';
const SELECTOR_CREATURES_AND_MAGI = 'selectors/creatures_and_magi';
const SELECTOR_OWN_MAGI = 'selectors/own_magi';
const SELECTOR_TOP_MAGI_OF_PILE = 'selectors/top_magi_of_pile';
const SELECTOR_ENEMY_MAGI = 'selectors/enemy_magi';
const SELECTOR_CREATURES_OF_REGION = 'selectors/creatures_of_region';
const SELECTOR_CREATURES_NOT_OF_REGION = 'selectors/creatures_not_of_region';
const SELECTOR_MAGI_OF_REGION = 'selectors/magi_of_region';
const SELECTOR_MAGI_NOT_OF_REGION = 'selectors/magi_not_of_region';
const SELECTOR_OWN_CREATURES = 'selectors/own_creatures';
const SELECTOR_ENEMY_CREATURES = 'selectors/enemy_creatures';
const SELECTOR_CARDS_WITH_ENERGIZE_RATE = 'selectors/cards_with_energize_rate';

const CALCULATION_SET = 'calculations/set';
const CALCULATION_DOUBLE = 'calculations/double';
const CALCULATION_ADD = 'calculations/add';
const CALCULATION_SUBTRACT = 'calculations/subtract';
const CALCULATION_HALVE_ROUND_DOWN = 'calculations/halve_round_down';
const CALCULATION_HALVE_ROUND_UP = 'calculations/halve_round_up';
const CALCULATION_MIN = 'calculations/min';
const CALCULATION_MAX = 'calculations/max';

const REGION_ARDERIAL = 'regions/arderial';
const REGION_CALD = 'regions/cald';
const REGION_NAROOM = 'regions/naroom';
const REGION_OROTHE = 'regions/orothe';
const REGION_UNDERNEATH = 'regions/underneath';
// const REGION_WEAVE = 'regions/weave';
// const REGION_KYBARS_TEETH = 'regions/kybars_teeth';
const REGION_BOGRATH = 'regions/bograth';
// const REGION_PARADWYN = 'regions/paradwyn';
// const REGION_D_RESH = 'regions/d_resh';
const REGION_UNIVERSAL = 'regions/universal';

const EFFECT_TYPE_NONE = 'effects/none';
const EFFECT_TYPE_DRAW = 'effects/draw';
const EFFECT_TYPE_RESHUFFLE_DISCARD = 'effects/reshuffle_discard';
const EFFECT_TYPE_BEFORE_DAMAGE = 'effects/before_damage';
const EFFECT_TYPE_DEAL_DAMAGE = 'effects/deal_damage';
const EFFECT_TYPE_AFTER_DAMAGE = 'effects/after_damage';
const EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = 'effects/creature_defeats_creature';
const EFFECT_TYPE_CREATURE_IS_DEFEATED = 'effects/creature_is_defeated';
const EFFECT_TYPE_ROLL_DIE = 'effects/roll_die';
const EFFECT_TYPE_MOVE_ENERGY = 'effects/move_energy';
const EFFECT_TYPE_PLAY_CREATURE = 'effects/play_creature';
const EFFECT_TYPE_PLAY_RELIC = 'effects/play_relic';
const EFFECT_TYPE_PLAY_SPELL = 'effects/play_spell';
const EFFECT_TYPE_CREATURE_ENTERS_PLAY = 'effects/creature_enters_play';
const EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC = 'effects/paying_energy_for_relic';
const EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL = 'effects/paying_energy_for_spell';
const EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = 'effects/paying_energy_for_creature';
const EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = 'effects/starting_energy_on_creature';
const EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = 'effects/move_card_between_zones';
const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI = 'effects/add_energy_to_creature_or_magi';
const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 'effects/add_energy_to_creature';
const EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 'effects/add_energy_to_magi';
const EFFECT_TYPE_ENERGIZE = 'effects/energize';
const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 'effects/discard_energy_from_creature';
const EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = 'effects/discard_energy_from_magi';
const EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = 'effects/discard_creature_from_play';
const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI = 'effects/discard_energy_from_creature_or_magi';
const EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = 'effects/restore_creature_to_starting_energy';
const EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = 'effects/paying_energy_for_power';
const EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY = 'effects/discard_relic_from_play';
const EFFECT_TYPE_CREATURE_ATTACKS = 'effects/creature_attacks';
const EFFECT_TYPE_CREATURE_IS_ATTACKED = 'effects/creature_is_attacked';
const EFFECT_TYPE_START_OF_TURN = 'effects/start_of_turn';
const EFFECT_TYPE_END_OF_TURN = 'effects/end_of_turn';

const PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE = 'prompt/any_creature_except_source';
const PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI = 'prompt/creature_or_magi';
const PROMPT_TYPE_SINGLE_CREATURE = 'prompt/creature';
const PROMPT_TYPE_OWN_SINGLE_CREATURE = 'prompt/own_creature';
const PROMPT_TYPE_SINGLE_CREATURE_FILTERED = 'prompt/creature_filtered';
const PROMPT_TYPE_NUMBER_OF_CREATURES = 'prompt/number_of_creatures';
const PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED = 'prompt/number_of_creatures_filtered';
const PROMPT_TYPE_SINGLE_MAGI = 'prompt/magi';
const PROMPT_TYPE_RELIC = 'prompt/relic';
const PROMPT_TYPE_NUMBER_OF_RELICS = 'prompt/number_of_relics';
const PROMPT_TYPE_NUMBER = 'prompt/number';

const RESTRICTION_ENERGY_LESS_THAN_STARTING = 'restrictions/energy_less_than_starting';

const TYPE_CREATURE = 'types/creature';
const TYPE_MAGI = 'types/magi';
const TYPE_RELIC = 'types/relic';
const TYPE_SPELL = 'types/spell';

const COST_X = 'X';

module.exports = {
	ACTION_ATTACK,
	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_CALCULATE,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_GET_PROPERTY_VALUE,

	CALCULATION_SET,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,

	SELECTOR_OPPONENT_ID,
	SELECTOR_CREATURES,
	SELECTOR_OWN_MAGI,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_CREATURES_AND_MAGI,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES,
	SELECTOR_ENEMY_CREATURES,
	SELECTOR_TOP_MAGI_OF_PILE,

	PROPERTY_ID,
	PROPERTY_ENERGY_COUNT,
	PROPERTY_MAGI_STARTING_ENERGY,
	PROPERTY_REGION,
	PROPERTY_COST,
	PROPERTY_CONTROLLER,
	PROPERTY_ENERGIZE,
	PROPERTY_ATTACKS_PER_TURN,
	PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
	PROPERTY_TYPE,

	EFFECT_TYPE_NONE,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_RESHUFFLE_DISCARD,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
	EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
	EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
	EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_BEFORE_DAMAGE,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_CREATURE_IS_DEFEATED,
	EFFECT_TYPE_AFTER_DAMAGE,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_CREATURE_IS_ATTACKED,
	EFFECT_TYPE_START_OF_TURN,
	EFFECT_TYPE_END_OF_TURN,

	RESTRICTION_ENERGY_LESS_THAN_STARTING,

	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_NUMBER_OF_CREATURES,
	PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_NUMBER_OF_RELICS,
	PROMPT_TYPE_NUMBER,

	REGION_ARDERIAL,
	REGION_CALD,
	REGION_NAROOM,
	REGION_OROTHE,
	REGION_UNDERNEATH,
	REGION_BOGRATH,
	REGION_UNIVERSAL,

	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

	COST_X,
};
