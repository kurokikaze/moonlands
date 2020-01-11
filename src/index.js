const {
    TYPE_CREATURE,
    TYPE_MAGI,
    TYPE_RELIC,
    TYPE_SPELL,
} = require('./const');

const {
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_ACTIVE_MAGI,
} = require('./zone');

const {CardInGame} = require('./cards');

const ACTION_PASS = 'actions/pass';
const ACTION_PLAY = 'actions/play';
const ACTION_POWER = 'actions/power';
const ACTION_EFFECT = 'actions/effect';
const ACTION_ENTER_PROMPT = 'actions/enter_prompt';
const ACTION_RESOLVE_PROMPT = 'actions/resolve_prompt';

const PROMPT_TYPE_SINGLE_CREATURE = 'prompt/creature';
const PROMPT_TYPE_SINGLE_CREATURE_FILTERED = 'prompt/creature_filtered';
const PROMPT_TYPE_NUMBER_OF_CREATURES = 'prompt/number_of_creatures';
const PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED = 'prompt/number_of_creatures_filtered';
const PROMPT_TYPE_SINGLE_MAGI = 'prompt/magi';
const PROMPT_TYPE_RELIC = 'prompt/relic';
const PROMPT_TYPE_NUMBER_OF_RELICS = 'prompt/number_of_relics';
const PROMPT_TYPE_NUMBER = 'prompt/number';

// Создаём перманент. id записывается в meta
const EFFECT_TYPE_PLAY_CREATURE = 'effects/play_creature';
// Существо входит в игру (для триггеров)
const EFFECT_TYPE_CREATURE_ENTERS_PLAY = 'effects/creature_enters_play';
// Снимаем энергию с Magi
const EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE = 'effects/paying_energy_for_creature';
// Помещаем на существо стартовую энергию
const EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE = 'effects/starting_energy_on_creature';
// Просто добавляем энергию на существо
const EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 'effects/add_energy_to_creature';
const EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 'effects/add_energy_to_magi';
const EFFECT_TYPE_ENERGIZE = 'effects/energize';

const EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 'effects/discard_energy_from_creature';

const NO_PRIORITY = 0;
const PRIORITY_PRS = 1;
const PRIORITY_ATTACK = 2;
const PRIORITY_CREATURES = 3;

const steps = [
    {
        name: 'Energize',
        priority: NO_PRIORITY,
    },
    {
        name: 'Powers/Relics/Spells',
        priority: PRIORITY_PRS,
    },
    {
        name: 'Attack',
        priority: PRIORITY_ATTACK,
    },
    {
        name: 'Play Dream Creatures',
        priority: PRIORITY_CREATURES,
    },
    {
        name: 'Powers/Relics/Spells',
        priority: PRIORITY_PRS,
    },
    {
        name: 'Draw',
        priority: NO_PRIORITY,
    },
];

const defaultState = {
    actions: [],
    savedActions: [],
    activePlayer: 0,
    prompt: false,
    promptType: null,
    step: 0,
    zones: [],
    players: [],
    spellMetaData: {},
};

class State {
    constructor(state) {
        this.state = {
            ...defaultState,
            ...state,
        };
    }

    getZone(type, player = null) {
        return this.state.zones.find(zone => zone.type === type && (zone.player == player || player == null));
    }

    getCurrentStep() {
        return this.state.step;
    }

    getActivePlayer() {
        return this.state.activePlayer;
    }

    getCurrentPriority() {
        return steps[this.state.step].priority;
    }

    addActions(actions) {
        this.state.actions.push(...arguments);
    }

    getNextAction() {
        return this.state.actions.shift();
    }
    
    hasActions() {
        return this.state.actions.length > 0;
    }

    getSpellMetaData(spellId) {
        return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
    }

    getMetaValue(value, spellId) {
        if (
            typeof value == 'string' &&
            value[0] == '$'
        ) {
            const variableName = value.slice(1);
            const spellMetaData = this.getSpellMetaData(spellId);
            return spellMetaData[variableName] ? spellMetaData[variableName] : null;
        } else {
            return value;
        }
    }

    update(initialAction) {
        this.addActions(initialAction);
        while (this.hasActions()) {
            const action = this.getNextAction();

            switch (action.type) {
                case ACTION_ENTER_PROMPT:
                    const savedActions = this.state.actions;
                    this.state = {
                        ...this.state,
                        actions: [],
                        savedActions,
                        prompt: true,
                        promptType: action.promptType,
                    };
                    break;
                case ACTION_RESOLVE_PROMPT:
                    const currentMetaData = this.state.spellMetaData[action.generatedBy] || {};
                    switch (this.state.promptType) {
                        case PROMPT_TYPE_NUMBER:
                            currentMetaData.number = action.number;
                            break;
                        case PROMPT_TYPE_SINGLE_CREATURE:
                            currentMetaData.target = action.target;
                            break;
                    }
                    const actions = this.state.savedActions || [];
                    this.state = {
                        ...this.state,
                        actions,
                        savedActions: [],
                        prompt: false,
                        promptType: null,
                        spellMetaData: {
                            ...this.state.spellMetaData,
                            [action.generatedBy]: currentMetaData,
                        },
                    };
                    break;
                case ACTION_PASS:
                    const newStep = (this.state.step + 1) % steps.length;
                    let activePlayer = (newStep == 0) ? 1 - this.state.activePlayer : this.state.activePlayer;
                    this.state = {
                        ...this.state,
                        step: newStep,
                        activePlayer,
                    };
                    break;
                case ACTION_PLAY:
                    const player = action.payload.player;
                    const playerHand = this.getZone(ZONE_TYPE_HAND, player);
                    const cardInHand = playerHand.containsId(action.payload.card.id);
                    if (cardInHand) {
                        // baseCard is "abstract" card, CardInPlay is concrete instance
                        const baseCard = action.payload.card.card;

                        const currentPriority = this.getCurrentPriority();
                        const cardType = baseCard.type;
                        if (
                            (cardType == TYPE_CREATURE && currentPriority == PRIORITY_CREATURES) ||
                            (cardType == TYPE_RELIC && currentPriority == PRIORITY_PRS) ||
                            (cardType == TYPE_SPELL && currentPriority == PRIORITY_PRS)
                         ) {
                                // Здесь должен быть полный шаг определения стоимости
                                const activeMagi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
                                const regionPenalty = (activeMagi.card.region == baseCard.region) ? 0 : 1;
                                this.addActions(
                                {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
                                    from: this.getZone(ZONE_TYPE_ACTIVE_MAGI, player),
                                    amount: baseCard.cost + regionPenalty,
                                    player: action.payload.player,
                                    generatedBy: action.payload.card.id,
                                },
                                {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PLAY_CREATURE,
                                    card: baseCard,
                                    player: action.payload.player,
                                    generatedBy: action.payload.card.id,
                                },
                                {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CREATURE_ENTERS_PLAY,
                                    card: baseCard,
                                    player: action.payload.player,
                                    generatedBy: action.payload.card.id,
                                },
                                {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
                                    card: baseCard,
                                    player: action.payload.player,
                                    amount: baseCard.cost,
                                    generatedBy: action.payload.card.id,
                                }
                            );
                        } else {
                            console.log(`Wrong Priority: current is ${currentPriority} (step ${this.getCurrentStep()})`);
                        }
                    } else {
                        console.log('No card to play');
                    }
                    break;
                case ACTION_EFFECT:
                    switch(action.effectType) {
                        case EFFECT_TYPE_ENERGIZE:
                            const amount = action.target.card.data.energize;
                            const type = action.target.card.type;
                            this.addActions({
                                type: ACTION_EFFECT,
                                effectType: (type == TYPE_CREATURE) ? EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                target: action.target,
                                amount,
                            });
                            break;
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE:
                            action.from.card.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        case EFFECT_TYPE_PLAY_CREATURE:
                            const inPlay = this.getZone(ZONE_TYPE_IN_PLAY);
                            const creature = new CardInGame(action.card, action.player);
                            if (!this.state.spellMetaData[action.generatedBy]) {
                                this.state.spellMetaData[action.generatedBy] = {};
                            }
                            this.state.spellMetaData[action.generatedBy].creature_created = creature.id;
                            inPlay.add([creature]);
                            break;
                        case EFFECT_TYPE_CREATURE_ENTERS_PLAY:
                            break;
                        case EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE:
                            const targetId = this.state.spellMetaData[action.generatedBy].creature_created;
                            this.addActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: this.getZone(ZONE_TYPE_IN_PLAY).byId(targetId),
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                generatedBy: action.generatedBy,
                            });
                            break;
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                            const discardTarget = this.getMetaValue(action.target, action.generatedBy);
                            discardTarget.removeEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE:
                            const addTarget = this.getMetaValue(action.target, action.generatedBy);
                            addTarget.addEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_MAGI:
                            action.target.addEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                    }
                    break;
            };
        }
    }
};

module.exports = {
    State,
    ACTION_PASS,
    ACTION_PLAY,
    ACTION_EFFECT,
    ACTION_ENTER_PROMPT,
    ACTION_RESOLVE_PROMPT,
    NO_PRIORITY,
    PRIORITY_PRS,
    PRIORITY_ATTACK,
    PRIORITY_CREATURES,
    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_SINGLE_CREATURE,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
};
