"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAddStartingEnergyToMagiEffect = exports.applyMagiFlippedEffect = exports.applyDrawRestOfCardsEffect = exports.applyFindStartingCardsEffect = exports.applyAddDelayedTriggerEffect = exports.applyStartStepEffect = exports.applyStartOfTurnEffect = exports.applyDrawCardsInDrawStep = exports.applyStartTurnEffect = void 0;
const const_1 = require("../../const");
const actionMapUtils_1 = require("../actionMapUtils");
const steps = [
    {
        name: 'Energize',
        priority: const_1.NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: const_1.ACTION_SELECT,
                selector: const_1.SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
                variable: 'energize',
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_ENERGIZE,
                target: '$energize',
            },
        ],
    },
    {
        name: 'Powers/Relics/Spells',
        priority: const_1.PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Attack',
        priority: const_1.PRIORITY_ATTACK,
        automatic: false,
    },
    {
        name: 'Play Dream Creatures',
        priority: const_1.PRIORITY_CREATURES,
        automatic: false,
    },
    {
        name: 'Powers/Relics/Spells',
        priority: const_1.PRIORITY_PRS,
        automatic: false,
    },
    {
        name: 'Draw',
        priority: const_1.NO_PRIORITY,
        automatic: true,
        effects: [
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
                numberOfCards: 2,
            },
        ],
    },
];
const applyStartTurnEffect = function (action, transform) {
    if (this.turn === null) {
        this.turn = 0;
    }
    else {
        this.turn += 1;
    }
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_START_STEP,
        player: action.player,
        step: 0,
        generatedBy: action.generatedBy,
    }, {
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_START_OF_TURN,
        player: action.player,
        generatedBy: action.generatedBy,
    });
    this.state = {
        ...this.state,
        continuousEffects: this.state.continuousEffects.map((0, actionMapUtils_1.updateContinuousEffects)(action.player)).filter(Boolean),
        activePlayer: action.player,
        step: 0,
    };
};
exports.applyStartTurnEffect = applyStartTurnEffect;
const applyDrawCardsInDrawStep = function (action, transform) {
    const numberOfCards = action.numberOfCards;
    const draws = (new Array(numberOfCards)).fill({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DRAW,
        stepEffect: true,
        player: action.player,
        generatedBy: action.generatedBy,
    });
    transform(...draws);
};
exports.applyDrawCardsInDrawStep = applyDrawCardsInDrawStep;
const applyStartOfTurnEffect = function (action, transform) {
    if (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 0 &&
        this.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).length > 0) {
        const topMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, action.player).cards[0];
        const availableCards = this.getAvailableCards(action.player, topMagi);
        const firstMagi = this.getZone(const_1.ZONE_TYPE_DEFEATED_MAGI, action.player).length == 0;
        const actionsToTake = [
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_MAGI_FLIPPED,
                target: topMagi,
            },
            {
                type: const_1.ACTION_SELECT,
                selector: const_1.SELECTOR_OWN_MAGI,
                variable: 'ownMagi',
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
                target: '$ownMagi',
            },
            {
                type: const_1.ACTION_ENTER_PROMPT,
                promptType: const_1.PROMPT_TYPE_CHOOSE_CARDS,
                promptParams: {
                    startingCards: topMagi.card.data.startingCards || [],
                    availableCards,
                },
                variable: 'startingCards',
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_FIND_STARTING_CARDS,
                cards: '$startingCards',
            }
        ];
        if (firstMagi) {
            actionsToTake.push({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS,
                drawnCards: '$foundCards',
            });
        }
        const actions = actionsToTake.map(preAction => ({
            ...preAction,
            player: action.player,
            generatedBy: action.generatedBy,
        }));
        transform(...actions);
    }
    // Reset creatures' actions and attacks
    const creatures = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
        .filter(card => card.card.type === const_1.TYPE_CREATURE && card.data.controller === action.player);
    if (creatures.length > 0) {
        creatures.forEach(creature => {
            creature.clearAttackMarkers();
            creature.clearActionsUsed();
        });
    }
    // Reset relics' actions
    const relics = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards
        .filter(card => card.card.type === const_1.TYPE_RELIC && card.data.controller === action.player);
    if (relics.length > 0) {
        relics.forEach(relic => relic.clearActionsUsed());
    }
    // if magi is active, reset its actions used too
    if (this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player).length == 1) {
        this.getZone(const_1.ZONE_TYPE_ACTIVE_MAGI, action.player)?.card?.clearActionsUsed();
    }
};
exports.applyStartOfTurnEffect = applyStartOfTurnEffect;
const applyStartStepEffect = function (action) {
    // Player who goes first do not energize on first turn
    const isFirstEnergize = this.turn === 0 &&
        action.player === this.state.goesFirst &&
        action.step === 0;
    if (steps[action.step].effects && !isFirstEnergize) {
        const transformedActions = steps[action.step]?.effects?.map(effect => ({
            ...effect,
            player: action.player,
            generatedBy: action.generatedBy,
        })) || [];
        this.addActions(...transformedActions);
    }
    if (steps[action.step].automatic) {
        this.addActions({
            type: const_1.ACTION_PASS,
            player: action.player,
        });
    }
    if (action.step === 1 && this.timerEnabled) {
        this.startTurnTimer();
    }
    this.state = {
        ...this.state,
        step: action.step,
    };
};
exports.applyStartStepEffect = applyStartStepEffect;
const applyAddDelayedTriggerEffect = function (action, _transform, _state, seeded_nanoid) {
    const metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    if ('source' in metaData || 'new_card' in metaData) {
        const self = metaData.source || metaData.new_card;
        this.state = {
            ...this.state,
            delayedTriggers: [
                ...this.state.delayedTriggers,
                {
                    id: seeded_nanoid(),
                    self,
                    ...action.delayedTrigger,
                }
            ],
        };
    }
};
exports.applyAddDelayedTriggerEffect = applyAddDelayedTriggerEffect;
const applyFindStartingCardsEffect = function (action, transform) {
    const cardsToFind = this.getMetaValue(action.cards, action.generatedBy);
    let foundCards = [];
    if (cardsToFind.length) {
        const deck = this.getZone(const_1.ZONE_TYPE_DECK, action.player);
        const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, action.player);
        cardsToFind.forEach(cardName => {
            if (discard.cards.some(({ card }) => card.name == cardName)) {
                const card = discard.cards.find(({ card }) => card.name == cardName);
                if (!card) {
                    return true;
                }
                foundCards.push(cardName);
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    target: card,
                    sourceZone: const_1.ZONE_TYPE_DISCARD,
                    destinationZone: const_1.ZONE_TYPE_HAND,
                    generatedBy: action.generatedBy,
                    bottom: false,
                });
            }
            else if (deck.cards.some(({ card }) => card.name == cardName)) {
                const card = deck.cards.find(({ card }) => card.name == cardName);
                if (!card) {
                    return true;
                }
                foundCards.push(cardName);
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    target: card,
                    sourceZone: const_1.ZONE_TYPE_DECK,
                    destinationZone: const_1.ZONE_TYPE_HAND,
                    generatedBy: action.generatedBy,
                    bottom: false,
                });
            }
        });
    }
    this.setSpellMetaDataField('foundCards', foundCards, action.generatedBy);
};
exports.applyFindStartingCardsEffect = applyFindStartingCardsEffect;
const applyDrawRestOfCardsEffect = function (action, transform) {
    const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
    const number = 5 - foundCards.length;
    if (number > 0) {
        for (let i = 0; i < number; i++) {
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DRAW,
                player: action.player,
                generatedBy: action.generatedBy,
            });
        }
    }
};
exports.applyDrawRestOfCardsEffect = applyDrawRestOfCardsEffect;
const applyMagiFlippedEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_MAGI_PILE,
        destinationZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
        bottom: false,
        target: action.target,
        generatedBy: action.generatedBy,
    });
};
exports.applyMagiFlippedEffect = applyMagiFlippedEffect;
const applyAddStartingEnergyToMagiEffect = function (action, transform) {
    const magiTargets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(magiTargets, (magiTarget) => {
        const startingEnergy = this.modifyByStaticAbilities(magiTarget, const_1.PROPERTY_MAGI_STARTING_ENERGY);
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: magiTarget,
            amount: startingEnergy,
            generatedBy: action.generatedBy,
        });
    });
};
exports.applyAddStartingEnergyToMagiEffect = applyAddStartingEnergyToMagiEffect;
//# sourceMappingURL=turnAndStep.js.map