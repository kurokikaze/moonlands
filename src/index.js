const {
    TYPE_CREATURE,
    TYPE_MAGI,
    TYPE_RELIC,
    TYPE_SPELL,

    ACTION_PASS,
    ACTION_PLAY,
    ACTION_POWER,
    ACTION_EFFECT,
    ACTION_SELECT,
    ACTION_CALCULATE,
    ACTION_ENTER_PROMPT,
    ACTION_RESOLVE_PROMPT,
    ACTION_GET_PROPERTY_VALUE,
    ACTION_ATTACK,

    PROPERTY_ENERGY_COUNT,
    PROPERTY_REGION,
    PROPERTY_COST,
    PROPERTY_ENERGIZE,
    PROPERTY_MAGI_STARTING_ENERGY,

    CALCULATION_SET,
    CALCULATION_DOUBLE,
    CALCULATION_ADD,
    CALCULATION_SUBTRACT,
    CALCULATION_HALVE_ROUND_DOWN,
    CALCULATION_HALVE_ROUND_UP,
    CALCULATION_MIN,
    CALCULATION_MAX,

    SELECTOR_CREATURES,
    SELECTOR_CREATURES_AND_MAGI,
    SELECTOR_OWN_MAGI,
    SELECTOR_ENEMY_MAGI,
    SELECTOR_CREATURES_OF_REGION,
    SELECTOR_CREATURES_NOT_OF_REGION,
    SELECTOR_OWN_CREATURES,
    SELECTOR_ENEMY_CREATURES,
    SELECTOR_TOP_MAGI_OF_PILE,
    SELECTOR_MAGI_OF_REGION,
    SELECTOR_MAGI_NOT_OF_REGION,

    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,

    EFFECT_TYPE_MOVE_ENERGY,
    EFFECT_TYPE_ROLL_DIE,
    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
    EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
    EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
    EFFECT_TYPE_BEFORE_DAMAGE,
    EFFECT_TYPE_DEAL_DAMAGE,
    EFFECT_TYPE_AFTER_DAMAGE,

    COST_X,
} = require('./const');

const {
    ZONE_TYPE_HAND,
    ZONE_TYPE_IN_PLAY,
    ZONE_TYPE_DISCARD,
    ZONE_TYPE_ACTIVE_MAGI,
    ZONE_TYPE_MAGI_PILE,
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
};

const oneOrSeveral = (targets, callback) => {
    if (targets.length) {
        if (targets.length > 0) {
            targets.forEach(target => callback(target));
        }
    } else {
        callback(targets);
    }
};


class State {
    constructor(state) {
        this.state = {
            ...defaultState,
            spellMetaData: {},
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

    transformIntoActions(actions) {
        this.state.actions.unshift(...arguments);
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

    getSpellMetadata(spellId) {
        return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
    }

    getMetaValue(value, spellId) {
        if (
            typeof value == 'string' &&
            value[0] == '$'
        ) {
            const variableName = value.slice(1);
            const spellMetaData = this.getSpellMetadata(spellId);
            return spellMetaData[variableName] ? spellMetaData[variableName] : null;
        } else {
            return value;
        }
    }

    useSelector(selector, player, argument) {
        switch (selector) {
            case SELECTOR_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_CREATURE);
            case SELECTOR_TOP_MAGI_OF_PILE:
                const topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
                return [topMagi]; // Selectors always have to return array
                break;
            case SELECTOR_OWN_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
                break;
            case SELECTOR_ENEMY_MAGI:
                return this.getZone(ZONE_TYPE_ACTIVE_MAGI, 1 - player).cards; // @TODO get enemy player
                break;
            case SELECTOR_OWN_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller == player && card.card.type == TYPE_CREATURE);
                break;
            case SELECTOR_ENEMY_CREATURES:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.data.controller != player && card.card.type == TYPE_CREATURE);
                break;
            case SELECTOR_CREATURES_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.region == argument && card.card.type == TYPE_CREATURE);
                break;
            case SELECTOR_CREATURES_NOT_OF_REGION:
                return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.region != argument && card.card.type == TYPE_CREATURE);
                break;
        }
    }

    getByProperty(target, property) {
        switch(property) {
            case PROPERTY_COST:
                return target.card.cost;
            case PROPERTY_ENERGIZE:
                return target.card.data.energize;
            case PROPERTY_REGION:
                return target.card.region;
            case PROPERTY_MAGI_STARTING_ENERGY:
                return target.card.data.startingEnergy;
        }
    }

    modifyByStaticAbilities(target, property) {
        // gathering static abilities from the field, adding players to them
        const zoneAbilities = this.getZone(ZONE_TYPE_IN_PLAY).cards.reduce(
            (acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
                ...acc,
                ...(cardInPlay.card.data.staticAbilities.filter(a => a.property == property).map(a => ({...a, player: cardInPlay.data.controller})))
            ] : acc,
            [],
        );
        const staticAbilities = [...zoneAbilities]; // @TODO static abilities of Magi

        let initialValue = this.getByProperty(target, property);

        staticAbilities.forEach(staticAbility => {
            const selected = this.useSelector(staticAbility.selector, staticAbility.player, staticAbility.selectorParameter);
            if (selected.includes(target)) {
                initialValue = staticAbility.modifier(initialValue);
            }
        });

        return initialValue;
    }

    update(initialAction) {
        this.addActions(initialAction);
        while (this.hasActions()) {
            const action = this.getNextAction();

            switch (action.type) {
                case ACTION_ATTACK:
                    /*
                        source
                        target

                        ---

                        BEFORE_DAMAGE,
                        DEAL_DAMAGE,
                        DEAL_DAMAGE,
                        AFTER_DAMAGE,
                    */
                    const attackSource = this.getMetaValue(action.source, action.generatedBy);
                    const attackTarget = this.getMetaValue(action.target, action.generatedBy);
                    const attackSequence = [
                    {
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_BEFORE_DAMAGE,
                        source: attackSource,
                        target: attackTarget,
                    },
                    {  // from source to target
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_DEAL_DAMAGE,
                        source: attackSource,
                        target: attackTarget,
                        amount: attackSource.data.energy,
                    }, // from target to source (if attacking a creature)
                    (attackTarget.card.type === TYPE_CREATURE) ? {
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_DEAL_DAMAGE,
                        source: attackTarget,
                        target: attackSource,
                        amount: attackTarget.data.energy,
                    } : null,
                    {
                        type: ACTION_EFFECT,
                        effectType: EFFECT_TYPE_AFTER_DAMAGE,
                        source: attackSource,
                        target: attackTarget,
                    },
                    ].filter(Boolean);
                    this.transformIntoActions(...attackSequence);
                    break;
                case ACTION_GET_PROPERTY_VALUE:
                    const target = this.getMetaValue(action.target, action.generatedBy);
                    const property = this.getMetaValue(action.property, action.generatedBy);

                    const rawData = this.getSpellMetadata(action.generatedBy);

                    const modifiedResult = this.modifyByStaticAbilities(target, property);
                    this.state.spellMetaData[action.generatedBy] = {
                        ...rawData,
                        [action.variable || 'result']: modifiedResult,
                    };
                    break;
                case ACTION_CALCULATE:
                    const beforeData = this.getSpellMetadata(action.generatedBy);
                    const operandOne = this.getMetaValue(action.operandOne, action.generatedBy);
                    const operandTwo = this.getMetaValue(action.operandTwo, action.generatedBy);
                    let result;
                    switch (action.operator) {
                        case CALCULATION_SET:
                            result = operandOne;
                            break;
                        case CALCULATION_DOUBLE:
                            result = operandOne * 2;
                            break;
                        case CALCULATION_ADD:
                            result = operandOne + operandTwo;
                            break;
                        case CALCULATION_SUBTRACT:
                            result = operandOne - operandTwo;
                            break;
                        case CALCULATION_HALVE_ROUND_DOWN:
                            result = Math.floor(operandOne / 2);
                            break;
                        case CALCULATION_HALVE_ROUND_UP:
                            result = Math.ceil(operandOne / 2);
                            break;
                        case CALCULATION_MIN:
                            result = Math.min(operandOne, operandTwo);
                            break;
                        case CALCULATION_MAX:
                            result = Math.max(operandOne, operandTwo);
                            break;
                    }

                    this.state.spellMetaData[action.generatedBy] = {
                        ...beforeData,
                        [action.variable || 'result']: result,
                    }
                    break;
                case ACTION_POWER:
                    if (!action.source.wasActionUsed(action.power.name)) {
                        const source = action.source;
                        const effects = action.power.effects;
                        
                        const preparedActions = effects.map(effect => ({...effect, generatedBy: source.id, player: action.player}));

                        let currentPowerMetaData = {
                            source,
                            sourceCreature: source,
                        }; // No retrieving old metadata from old activations

                        source.setActionUsed(action.power.name);

                        if (action.power.cost == COST_X) {
                            this.addActions(
                                {
                                    type: ACTION_ENTER_PROMPT,
                                    promptType: PROMPT_TYPE_NUMBER,
                                    generatedBy: source.id,
                                },
                                {
                                    type: ACTION_CALCULATE,
                                    operator: CALCULATION_SET,
                                    operandOne: '$number',
                                    variable: 'chosen_cost',
                                    generatedBy: source.id,
                                },
                                {
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                    target: source,
                                    amount: '$number',
                                    generatedBy: source.id,
                                },
                            );
                        } else if (action.power.cost > 0) {
                            this.addActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
                                target: source,
                                amount: action.power.cost,
                                generatedBy: source.id,
                            });
                        }
                        this.addActions(...preparedActions);
                        this.setSpellMetadata(currentPowerMetaData, source.id);
                    }
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
                            currentActionMetaData[action.variable || 'number'] = action.number;
                            break;
                        case PROMPT_TYPE_SINGLE_CREATURE:
                            currentActionMetaData[action.variable || 'target'] = action.target;
                            break;
                        case PROMPT_TYPE_SINGLE_MAGI:
                            currentActionMetaData[action.variable || 'targetMagi'] = action.target;
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
                case ACTION_SELECT:
                    const varName = action.variable || 'selected';
                    switch (action.selector) {
                        case SELECTOR_CREATURES_AND_MAGI:
                            const allOfTheAbove = [
                                ...this.useSelector(SELECTOR_OWN_MAGI, action.player),
                                ...this.useSelector(SELECTOR_ENEMY_MAGI, action.player),
                                ...this.useSelector(SELECTOR_CREATURES),
                            ];

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: allOfTheAbove,
                            }, action.generatedBy);
                        case SELECTOR_TOP_MAGI_OF_PILE:
                            const selectedTopMagi = this.useSelector(SELECTOR_TOP_MAGI_OF_PILE, action.player);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedTopMagi,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_OWN_MAGI:
                            const selectedOwnMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedOwnMagi,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_OWN_CREATURES:
                            const selectedOwnCreatures = this.useSelector(SELECTOR_OWN_CREATURES, action.player);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedOwnCreatures,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_ENEMY_CREATURES:
                            const selectedEnemyCreatures = this.useSelector(SELECTOR_ENEMY_CREATURES, action.player);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedEnemyCreatures,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_ENEMY_MAGI:
                            const selectedEnemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedEnemyMagi,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_CREATURES_OF_REGION:
                            const selectedRegionCreatures = this.useSelector(SELECTOR_CREATURES_OF_REGION, action.player, action.region);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedRegionCreatures,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_CREATURES_NOT_OF_REGION:
                            const selectedNonRegionCreatures =
                                this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.region != action.region);

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedNonRegionCreatures,
                            }, action.generatedBy);
                            break;
                        case SELECTOR_MAGI_OF_REGION:
                            const selectedMagiOfRegion = [
                                ...this.useSelector(SELECTOR_OWN_MAGI, action.player),
                                ...this.useSelector(SELECTOR_ENEMY_MAGI, action.player),
                            ].filter(magi => magi.card.region === action.region); // @TODO Layers here

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedMagiOfRegion,
                            }, action.generatedBy);                            
                            break;
                        case SELECTOR_MAGI_NOT_OF_REGION:
                            const selectedMagiNotOfRegion = [
                                ...this.useSelector(SELECTOR_OWN_MAGI, action.player),
                                ...this.useSelector(SELECTOR_ENEMY_MAGI, action.player),
                            ].filter(magi => magi.card.region != action.region); // @TODO Layers here

                            this.setSpellMetadata({
                                ...this.getSpellMetadata(action.generatedBy),
                                [varName]: selectedMagiNotOfRegion,
                            }, action.generatedBy);                            
                            break;
                    }

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
                                this.transformIntoActions(
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
                        /** Attack sequence actions */
                        case EFFECT_TYPE_BEFORE_DAMAGE:
                            action.source.markAttackDone();
                            action.target.markAttackReceived();
                            break;
                        case EFFECT_TYPE_DEAL_DAMAGE:
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
                                target: action.target,
                                amount: action.amount,
                                attack: true,
                            });
                            break;
                        case EFFECT_TYPE_AFTER_DAMAGE:
                            if (action.target.data.energy === 0) {
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
                                    source: action.source,
                                    target: action.target,
                                    attack: true,
                                });
                                this.transformIntoActions({
                                    type: ACTION_EFFECT,
                                    effectType: EFFECT_TYPE_CREATURE_IS_DEFEATED,
                                    target: action.target,
                                    attack: true,
                                });
                            }
                            break;
                        case EFFECT_TYPE_ROLL_DIE:
                            const result = action.result || (Math.floor(Math.random() * 6) + 1);
                            if (!this.state.spellMetaData[action.generatedBy]) {
                                this.state.spellMetaData[action.generatedBy] = {};
                            }
                            this.state.spellMetaData[action.generatedBy].roll_result = result;
                            break;
                        case EFFECT_TYPE_ENERGIZE:
                            const amount = this.modifyByStaticAbilities(action.target, PROPERTY_ENERGIZE);
                            const type = action.target.card.type;
                            this.transformIntoActions({
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
                        case EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES:
                            /*
                            target: CardInPlay,
                            sourceZone: ZONE_TYPE,
                            destinationZone: ZONE_TYPE,
                            bottom: true / false,
                             */
                            const zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
                            const zoneChangingCard = zoneChangingTarget.length ? zoneChangingTarget[0] : zoneChangingTarget;
                            const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
                            const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
                            const destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
                            const newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner);
                            if (action.bottom) {
                                destinationZone.add([newObject]);
                            } else {
                                destinationZone.addToTop([newObject]);
                            }
                            sourceZone.removeById(zoneChangingCard.id);

                            if (!this.state.spellMetaData[action.generatedBy]) {
                                this.state.spellMetaData[action.generatedBy] = {};
                            }

                            this.state.spellMetaData[action.generatedBy].new_card = newObject;                            
                            break;
                        case EFFECT_TYPE_CREATURE_ENTERS_PLAY:
                            break;
                        case EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE:
                            const targetId = this.state.spellMetaData[action.generatedBy].creature_created;
                            this.transformIntoActions({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: this.getZone(ZONE_TYPE_IN_PLAY).byId(targetId),
                                amount: this.getMetaValue(action.amount, action.generatedBy),
                                generatedBy: action.generatedBy,
                            });
                            break;
                        case EFFECT_TYPE_MOVE_ENERGY:
                            const moveSource = this.getMetaValue(action.source, action.generatedBy);
                            const moveTarget = this.getMetaValue(action.target, action.generatedBy);
                            const amountToMove = this.getMetaValue(action.amount, action.generatedBy);

                            moveSource.removeEnergy(amountToMove);
                            moveTarget.addEnergy(amountToMove);
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI:
                            const addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);

                            oneOrSeveral(discardMiltiTarget, target => {
                                switch (target.card.type) {
                                    case TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI:
                            const discardMiltiTarget = this.getMetaValue(action.target, action.generatedBy);

                            oneOrSeveral(discardMiltiTarget, target => {
                                switch (target.card.type) {
                                    case TYPE_CREATURE:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                    case TYPE_MAGI:
                                        this.transformIntoActions({
                                            type: ACTION_EFFECT,
                                            effectType: EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                                            amount: action.amount,
                                            target,
                                            generatedBy: action.generatedBy,
                                        });
                                        break;
                                }
                            });
                            break;
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI:
                            oneOrSeveral(
                                this.getMetaValue(action.target, action.generatedBy),
                                target => target.removeEnergy(this.getMetaValue(action.amount, action.generatedBy)),
                            );
                            break;
                        case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                            oneOrSeveral(
                                this.getMetaValue(action.target, action.generatedBy),
                                target => target.removeEnergy(this.getMetaValue(action.amount, action.generatedBy))
                            );
                            break;
                        case EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY:
                            const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
                            const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
                            if (restoreAmount > 0) {
                                this.transformIntoActions({
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
                                this.transformIntoActions({
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

                            oneOrSeveral(magiTarget, target => target.addEnergy(this.getMetaValue(action.amount, action.generatedBy)));                            
                            break;
                        case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY:
                            const creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
                            const discardPile = this.getZone(ZONE_TYPE_DISCARD, creatureDiscardTarget.owner);
                            oneOrSeveral(creatureDiscardTarget, creature => {
                                const cardInDiscard = new CardInGame(creature.card, creature.owner);
                                discardPile.add([cardInDiscard]);
                                this.getZone(ZONE_TYPE_IN_PLAY).removeById(creature.id);
                            });
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
    ACTION_CALCULATE,
    ACTION_ATTACK,
    NO_PRIORITY,
    PRIORITY_PRS,
    PRIORITY_ATTACK,
    PRIORITY_CREATURES,
    PROMPT_TYPE_NUMBER,
    PROMPT_TYPE_SINGLE_CREATURE,
    PROMPT_TYPE_SINGLE_MAGI,
    EFFECT_TYPE_MOVE_ENERGY,
    EFFECT_TYPE_PLAY_CREATURE,
    EFFECT_TYPE_CREATURE_ENTERS_PLAY,
    EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
    EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
    EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
    EFFECT_TYPE_ENERGIZE,
    EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
    EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
    EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
    EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
};
