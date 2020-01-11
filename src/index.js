const {
    TYPE_CREATURE,
    TYPE_MAGI,
    TYPE_RELIC,
    TYPE_SPELL,

    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_EFFECT,
    ACTION_ENTER_PROMPT,
    ACTION_RESOLVE_PROMPT,

    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,

    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
} = require('./const');

const {
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_ACTIVE_MAGI,
} = require('./zone');

const {CardInGame} = require('./cards');

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

    setSpellMetadata(metadata, spellId) {
        this.state.spellMetaData[spellId] = metadata;
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
                /*
                    {
                        source, # save to meta
                        name,
                        effects: [],
                        player,
                    }
                */
                case ACTION_POWER:
                    const source = action.source;
                    const effects = action.power.effects;
                    const preparedActions = effects.map(effect => ({...effect, generatedBy: source.id}));

                    let currentPowerMetaData = {
                        source,
                        sourceCreature: source,
                    }; // No retrieving old metadata from old activations

                    if (action.power.cost > 0) {
                        this.addActions({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                            target: source,
                            amount: action.power.cost,
                        });
                    }
                    this.addActions(...preparedActions);
                    this.setSpellMetadata(currentPowerMetaData, source.id);
                    break;
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
                    let currentActionMetaData = this.state.spellMetaData[action.generatedBy] || {};
                    switch (this.state.promptType) {
                        case PROMPT_TYPE_NUMBER:
                            currentActionMetaData.number = action.number;
                            break;
                        case PROMPT_TYPE_SINGLE_CREATURE:
                            currentActionMetaData.target = action.target;
                            break;
                        case PROMPT_TYPE_SINGLE_MAGI:
                            currentActionMetaData.targetMagi = action.target;
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
                            [action.generatedBy]: currentActionMetaData,
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
                        case EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY:
                            const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
                            const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
                            if (restoreAmount > 0) {
                                this.addActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                    target: restoreTarget,
                                    amount: restoreAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_POWER:
                            const payingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const payingAmount = this.getMetaValue(action.amount, action.generatedBy);
                            if (payingAmount > 0) {
                                this.addActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                    target: payingTarget,
                                    amount: payingAmount,
                                    player: action.player,
                                    generatedBy: action.generatedBy,
                                });
                            }
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE:
                            const addTarget = this.getMetaValue(action.target, action.generatedBy);
                            addTarget.addEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_MAGI:
                            const magiTarget = this.getMetaValue(action.target, action.generatedBy);
                            magiTarget.addEnergy(this.getMetaValue(action.amount, action.generatedBy));
                            break;
                        case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
                            const cretureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            const discardPile = this.getZone(ZONE_TYPE_DISCARD, action.player);
                            const cardInDiscard = new CardInGame(cretureDiscardTarget.card, cretureDiscardTarget.owner);
                            discardPile.add([cardInDiscard]);
                            this.getZone(ZONE_TYPE_IN_PLAY).removeById(cretureDiscardTarget.id);
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
    ACTION_POWER,
    NO_PRIORITY,
    PRIORITY_PRS,
    PRIORITY_ATTACK,
    PRIORITY_CREATURES,
    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
};
