const ACTION_PASS = 'actions/pass';
const ACTION_PLAY = 'actions/play';
const ACTION_POWER = 'actions/power';
const ACTION_EFFECT = 'actions/effect';
const ACTION_ENTER_PROMPT = 'actions/enter_prompt';
const ACTION_RESOLVE_PROMPT = 'actions/resolve_prompt';

const REGION_ARDERIAL = 'regions/arderial';
const REGION_CALD = 'regions/cald';
const REGION_NAROOM = 'regions/naroom';
const REGION_OROTHE = 'regions/orothe';
const REGION_UNDERNEATH = 'regions/underneath';
const REGION_WEAVE = 'regions/weave';
const REGION_KYBARS_TEETH = 'regions/kybars_teeth';
const REGION_BOGRATH = 'regions/bograth';
const REGION_PARADWYN = 'regions/paradwyn';
const REGION_D_RESH = 'regions/d_resh';

const EFFECT_TYPE_PLAY_CREATURE = 'effects/play_creature';
const EFFECT_TYPE_CREATURE_ENTERS_PLAY = 'effects/creature_enters_play';
const EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = 'effects/paying_energy_for_creature';
const EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = 'effects/starting_energy_on_creature';
const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 'effects/add_energy_to_creature';
const EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 'effects/add_energy_to_magi';
const EFFECT_TYPE_ENERGIZE = 'effects/energize';
const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 'effects/discard_energy_from_creature';
const EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = 'effects/discard_creature_from_play';
const EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY = 'effects/restore_creature_to_starting_energy';
const EFFECT_TYPE_PAYING_ENERGY_FOR_POWER = 'effects/paying_energy_for_power';

const PROMPT_TYPE_SINGLE_CREATURE = 'prompt/creature';
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

module.exports = {
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_EFFECT,
    ACTION_ENTER_PROMPT,
    ACTION_RESOLVE_PROMPT,

    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,

    RESTRICTION_ENERGY_LESS_THAN_STARTING,

    PROMPT_TYPE_SINGLE_CREATURE,
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

    TYPE_CREATURE,
    TYPE_MAGI,
    TYPE_RELIC,
    TYPE_SPELL,
};
