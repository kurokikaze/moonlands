const {
    // REGION_ARDERIAL,
    // REGION_CALD,
    // REGION_NAROOM,
    // REGION_OROTHE,
    // REGION_UNDERNEATH,
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
const ACTION_EFFECT = 'actions/effect';

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
    activePlayer: 0,
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
        this.actions = [];
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

    update(initialAction) {
        this.actions.push(initialAction);
        while (this.actions.length > 0) {
            const action = this.actions.shift();

            switch (action.type) {
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
                                this.actions.push(
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
                        case EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE:
                            action.from.card.removeEnergy(action.amount);
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
                            this.actions.push({
                                type: ACTION_EFFECT,
                                effectType: EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                                target: this.getZone(ZONE_TYPE_IN_PLAY).byId(targetId),
                                amount: action.amount,
                                generatedBy: action.generatedBy,
                            });
                            break;
                        case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE:
                            action.target.addEnergy(action.amount);
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
    NO_PRIORITY,
    PRIORITY_PRS,
    PRIORITY_ATTACK,
    PRIORITY_CREATURES,
};
