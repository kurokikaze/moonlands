"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionMap = exports.applyDiscardEnergyFromCreatureOrMagiEffect = void 0;
const nanoid_1 = require("nanoid");
const CardInGame_1 = __importDefault(require("../classes/CardInGame"));
const const_1 = require("../const");
const actionMapUtils_1 = require("./actionMapUtils");
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
        step: 0, // this will be rewritten to 0 by EFFECT_TYPE_START_STEP, but no big deal
    };
};
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
const applyAddDelayedTriggerEffect = function (action) {
    const metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    if ('source' in metaData || 'new_card' in metaData) {
        const self = metaData.source || metaData.new_card;
        this.state = {
            ...this.state,
            delayedTriggers: [
                ...this.state.delayedTriggers,
                {
                    id: (0, nanoid_1.nanoid)(),
                    self,
                    ...action.delayedTrigger,
                }
            ],
        };
    }
};
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
const applyDrawRestOfCardsEffect = function (action, transform) {
    const foundCards = this.getMetaValue(action.drawnCards, action.generatedBy) || [];
    const number = 5 - foundCards.length;
    if (number > 0) { // who knows
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
const applyDiscardCardsEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, target => target && transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
        target,
        generatedBy: action.generatedBy,
        player: action.player,
    }));
};
const applyDiscardCardEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    if (target) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_HAND,
            destinationZone: const_1.ZONE_TYPE_DISCARD,
            bottom: false,
            target,
            generatedBy: action.generatedBy,
        });
    }
};
const applyReturnCreatureDiscardingEnergyEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
const applyReturnCreatureReturningEnergyEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    if (this.isCardAffectedByEffect(card, action)) {
        const ownersMagi = this.useSelector(const_1.SELECTOR_OWN_MAGI, card.owner)[0];
        transform({
            type: const_1.ACTION_GET_PROPERTY_VALUE,
            property: const_1.PROPERTY_ENERGY_COUNT,
            target: card,
            variable: 'creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target: ownersMagi,
            amount: '$creatureEnergyToRefund',
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            target: card,
            generatedBy: action.generatedBy,
        });
    }
};
const applyDrawNCardsEffect = function (action, transform) {
    const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
    for (let i = 0; i < numberOfCards; i++) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DRAW,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
const applyDrawEffect = function (action, transform) {
    const player = this.getMetaValue(action.player, action.generatedBy);
    const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
    const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
    if (deck.length > 0) {
        const card = deck.cards[0];
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: card,
            sourceZone: const_1.ZONE_TYPE_DECK,
            destinationZone: const_1.ZONE_TYPE_HAND,
            bottom: false,
            player: player,
            generatedBy: action.generatedBy,
        });
    }
    else if (discard.length > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_RESHUFFLE_DISCARD,
            player: player,
            generatedBy: action.generatedBy,
        }, action);
    }
};
const applyReshuffleDiscardEffect = function (action, transform) {
    const player = this.getMetaValue(action.player, action.generatedBy);
    const deck = this.getZone(const_1.ZONE_TYPE_DECK, player);
    const discard = this.getZone(const_1.ZONE_TYPE_DISCARD, player);
    const newCards = discard.cards.map(card => new CardInGame_1.default(card.card, card.owner));
    deck.add(newCards);
    deck.shuffle();
    discard.empty();
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_RESHUFFLED,
        cards: newCards.map(({ id }) => id),
        player: player,
        generatedBy: action.generatedBy,
    });
};
const applyAttackEffect = function (action, transform) {
    const source = this.getMetaValue(action.source, action.generatedBy);
    const target = this.getMetaValue(action.target, action.generatedBy);
    const additionalAttackers = this.getMetaValue(action.additionalAttackers, action.generatedBy);
    let attackSequence = [
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
            source: source,
            sourceAtStart: source.copy(),
            target: target,
            packHuntAttack: false,
            targetAtStart: target.copy(),
            generatedBy: source.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
            source: source,
            target: target,
            generatedBy: source.id,
        },
    ];
    if (additionalAttackers) {
        const preparedEffects = additionalAttackers.map((card) => [
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_CREATURE_ATTACKS,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_BEFORE_DAMAGE,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DAMAGE_STEP,
                source: card,
                sourceAtStart: card.copy(),
                packHuntAttack: true,
                target: target,
                targetAtStart: target.copy(),
                generatedBy: source.id,
            },
            {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_AFTER_DAMAGE,
                source: card,
                packHuntAttack: true,
                target: target,
                generatedBy: source.id,
            },
        ]).flat();
        for (let effect of preparedEffects) {
            attackSequence.push(effect);
        }
    }
    transform(...attackSequence);
};
const applyBeforeDamageEffect = function (action) {
    action.source.markAttackDone();
    action.target.markAttackReceived();
};
const applyDamageStepEffect = function (action, transform) {
    // Here we finalize damage amount from both creatures' energy
    const attackSource = action.source;
    const attackTarget = action.target;
    const damageByAttacker = attackSource.data.energy;
    const damageByDefender = (attackTarget.card.type === const_1.TYPE_CREATURE) ?
        attackTarget.data.energy :
        0;
    const attackerDamageActions = [{
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE,
            source: attackSource,
            sourceAtStart: action.sourceAtStart,
            target: attackTarget,
            targetAtStart: action.targetAtStart,
            sourceBeforeDamage: attackSource.copy(),
            targetBeforeDamage: attackTarget.copy(),
            amount: damageByAttacker,
            generatedBy: attackSource.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ATTACKER_DAMAGE_DEALT,
            source: attackSource,
            sourceAtStart: action.sourceAtStart,
            target: attackTarget,
            targetAtStart: action.targetAtStart,
            sourceBeforeDamage: attackSource.copy(),
            targetBeforeDamage: attackTarget.copy(),
            amount: '$damageDealt',
            generatedBy: attackSource.id,
        }
    ];
    const damageActions = (attackTarget.card.type === const_1.TYPE_CREATURE && !action.packHuntAttack) ? [
        ...attackerDamageActions, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
            source: attackTarget,
            sourceAtStart: action.targetAtStart,
            target: attackSource,
            amount: damageByDefender,
            targetAtStart: action.sourceAtStart,
            sourceBeforeDamage: attackTarget.copy(),
            targetBeforeDamage: attackSource.copy(),
            generatedBy: attackSource.id,
        },
        {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DEFENDER_DAMAGE_DEALT,
            source: attackTarget,
            sourceAtStart: action.targetAtStart,
            target: attackSource,
            amount: '$damageDealt',
            targetAtStart: action.sourceAtStart,
            sourceBeforeDamage: attackTarget.copy(),
            targetBeforeDamage: attackSource.copy(),
            generatedBy: attackSource.id,
        }
    ] : attackerDamageActions;
    transform(...damageActions);
};
const applyAttackerDealsDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
const applyDefenderDealsDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DEAL_DAMAGE,
        source: action.source,
        sourceAtStart: action.sourceAtStart,
        target: action.target,
        targetAtStart: action.targetAtStart,
        amount: action.amount,
        attack: true,
        generatedBy: action.generatedBy,
    });
};
const applyDealDamageEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
        target: action.target,
        source: action.source,
        amount: action.amount,
        attack: true,
        variable: 'damageDealt',
        generatedBy: action.generatedBy,
    });
};
const applyAfterDamageEffect = function (action, transform) {
    if (action.source.data.energy === 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.target,
            target: action.source,
            attack: true,
            asAttacker: false,
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.source,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
    if (action.target.data.energy === 0 && action.target.card.type === const_1.TYPE_CREATURE) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
            source: action.source,
            target: action.target,
            attack: true,
            asAttacker: true,
            generatedBy: action.generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CREATURE_IS_DEFEATED,
            target: action.target,
            attack: true,
            generatedBy: action.generatedBy,
        });
    }
};
const applyCreatureDefeatsCreatureEffect = function (action, transform) {
    if (action.target.data.energy === 0) {
        action.source.markDefeatedCreature();
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
            source: action.source,
            target: action.target,
            attack: true,
            player: action.player || 0,
            generatedBy: action.generatedBy,
        });
    }
};
const applyRollDieEffect = function (action, transform) {
    // @ts-ignore
    const randomValue = this.twister ? this.twister.random() : Math.random();
    const result = action.result ||
        (this.rollDebugValue === null ? (Math.floor(randomValue * 6) + 1) : this.rollDebugValue);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_DIE_ROLLED,
        result,
        player: action.player,
        generatedBy: action.generatedBy,
    });
};
const applyDieRolledEffect = function (action) {
    this.setSpellMetaDataField('roll_result', action.result, action.generatedBy);
};
const applyExecutePowerEffects = function (action) {
    const power = this.getMetaValue(action.power, action.generatedBy);
    const sourceRaw = this.getMetaValue(action.source, action.generatedBy);
    // Some selectors will give us arrays anyway
    const source = sourceRaw instanceof Array ? sourceRaw[0] : sourceRaw;
    const sourceController = this.modifyByStaticAbilities(source, const_1.PROPERTY_CONTROLLER);
    const powerCost = this.modifyByStaticAbilities(source, const_1.PROPERTY_POWER_COST, power.name || '');
    const enrichAction = (effect) => ({
        source,
        player: sourceController,
        ...effect,
        power: true,
        generatedBy: source.id,
    });
    if ('effects' in power && power.effects) {
        const effects = power.effects;
        const preparedActions = effects.map(enrichAction);
        const allPromptsAreDoable = this.checkPrompts(source, preparedActions, true);
        if (allPromptsAreDoable) {
            if (!('setUsage' in action) || action.setUsage == true) {
                source.setActionUsed(power.name);
            }
            this.transformIntoActions(...preparedActions);
        }
    }
};
const applyEnergizeEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, (target) => {
        const amount = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGIZE);
        const type = target.card.type;
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: (type == const_1.TYPE_CREATURE) ? const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE : const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
            target,
            source: undefined,
            amount,
            generatedBy: action.generatedBy,
        });
    });
};
const applyPayingEnergyForRelicEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
const applyPayingEnergyForSpellEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
            target: payingTarget,
            amount: payingAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
const applyPayingEnergyForCreatureEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.from, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        if (payingTarget instanceof CardInGame_1.default) {
            if (this.modifyByStaticAbilities(payingTarget, const_1.PROPERTY_CONTROLLER) == action.player) {
                const correctEffectType = payingTarget.card.type === const_1.TYPE_MAGI ? const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI : const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: correctEffectType,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            else {
                throw new Error('Trying to pay for the creature from non-controlled Orathan');
            }
        }
    }
};
const applyPlayRelicEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: const_1.ACTION_GET_PROPERTY_VALUE,
        property: const_1.PROPERTY_ID,
        target: '$new_card',
        variable: 'relic_created',
        generatedBy: action.generatedBy,
    });
};
const applyPlayCreatureEffect = function (action, transform) {
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        bottom: false,
        target: action.card,
        player: action.player,
        generatedBy: action.generatedBy,
    }, {
        type: const_1.ACTION_CALCULATE,
        operator: const_1.CALCULATION_SET,
        operandOne: '$new_card',
        variable: 'creature_created',
        generatedBy: action.generatedBy,
    });
};
// Should rework into continuous effect with duration
const applyForbidAttackToCreatureEffect = function (action, transform) {
    const targets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(targets, target => target.forbidAttacks());
};
const applyConditionalEffect = function (action, transform) {
    const metaData = this.getSpellMetadata(action.generatedBy);
    // "new_card" fallback is for "defeated" triggers
    const self = action.triggerSource || metaData.source || metaData.new_card;
    if (!self) {
        return;
    }
    //   checkCondition(action, self, condition)
    const results = action.conditions.map(condition => this.checkCondition(action, self, condition));
    const enrichAction = (effect) => ({
        source: self,
        player: self.data.controller,
        ...effect,
        generatedBy: action.generatedBy,
    });
    if (results.every(result => result === true)) {
        if (action.thenEffects) {
            const preparedEffects = action.thenEffects
                .map(enrichAction);
            transform(...preparedEffects);
        }
    }
    else {
        if (action.elseEffects) {
            const preparedEffects = action.elseEffects
                .map(enrichAction);
            transform(...preparedEffects);
        }
    }
};
const applyMoveCardsBetweenZonesEffect = function (action, transform) {
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    const zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy) || [];
    if (!zoneChangingTargets) {
        console.dir(zoneChangingTargets);
        console.dir(this.getSpellMetadata(action.generatedBy));
    }
    if (zoneChangingTargets.length) {
        // We assume all cards changing zones are in one zone initially
        const zoneOwner = zoneChangingTargets[0].owner;
        const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
        const sourceZone = this.getZone(sourceZoneType, sourceZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
        const destinationZone = this.getZone(destinationZoneType, destinationZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        const newCards = [];
        (0, actionMapUtils_1.oneOrSeveral)(zoneChangingTargets, zoneChangingCard => {
            const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
            if (action.bottom) {
                destinationZone.add([newObject]);
            }
            else {
                destinationZone.addToTop([newObject]);
            }
            sourceZone.removeById(zoneChangingCard.id);
            newCards.push(newObject);
            // Let the old cards keep track of the movement too
            this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                sourceCard: zoneChangingCard,
                sourceZone: sourceZoneType,
                destinationCard: newObject,
                destinationZone: destinationZoneType,
                generatedBy: action.generatedBy,
            });
        });
        this.setSpellMetaDataField('new_cards', newCards, action.generatedBy);
    }
};
const applyMoveCardBetweenZonesEffect = function (action, transform) {
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    const zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
    const zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
    if (zoneChangingCard) {
        const sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
        const destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
        const destinationZone = this.getZone(destinationZoneType, destinationZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        const sourceZone = this.getZone(sourceZoneType, sourceZoneType === const_1.ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner);
        if (action.bottom) {
            destinationZone.add([newObject]);
        }
        else {
            destinationZone.addToTop([newObject]);
        }
        sourceZone.removeById(zoneChangingCard.id);
        if (sourceZoneType == const_1.ZONE_TYPE_IN_PLAY && destinationZoneType !== const_1.ZONE_TYPE_IN_PLAY) {
            if (zoneChangingCard.id in this.state.cardsAttached) {
                // Queue the removal of the attached cards
                for (const attachmentId of this.state.cardsAttached[zoneChangingCard.id]) {
                    const attachedCard = this.getZone(const_1.ZONE_TYPE_IN_PLAY).byId(attachmentId);
                    if (attachedCard) {
                        transform({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: attachedCard,
                            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                            destinationZone: const_1.ZONE_TYPE_DISCARD,
                            generatedBy: action.generatedBy,
                            bottom: false,
                        });
                    }
                    else {
                        console.log(`Cannot find the card ${attachmentId} in play`);
                    }
                }
                // This cleans up the attachments
                this.removeAttachments(zoneChangingCard.id);
            }
        }
        this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
        this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
            sourceCard: zoneChangingCard,
            sourceZone: sourceZoneType,
            destinationCard: newObject,
            attack: action.attack,
            destinationZone: destinationZoneType,
            generatedBy: action.generatedBy,
        });
    }
};
const applyStartingEnergyOnCreatureEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
        target,
        source: undefined,
        amount: this.getMetaValue(action.amount, action.generatedBy),
        generatedBy: action.generatedBy,
    });
};
const applyMoveEnergyEffect = function (action, transform) {
    const moveMultiSource = this.getMetaValue(action.source, action.generatedBy);
    const moveSource = (moveMultiSource instanceof Array) ? moveMultiSource[0] : moveMultiSource;
    const moveMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    const moveTarget = (moveMultiTarget instanceof Array) ? moveMultiTarget[0] : moveMultiTarget;
    const amountToMove = this.getMetaValue(action.amount, action.generatedBy);
    if (moveSource.data.energy >= amountToMove) {
        moveSource.removeEnergy(amountToMove);
        moveTarget.addEnergy(amountToMove);
        if (moveSource.data.energy === 0) {
            switch (moveSource.card.type) {
                case const_1.TYPE_CREATURE: {
                    // Creature goes to discard
                    transform({
                        type: const_1.ACTION_EFFECT,
                        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                        sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                        destinationZone: const_1.ZONE_TYPE_DISCARD,
                        bottom: false,
                        target: moveSource,
                        player: action.player,
                        generatedBy: action.generatedBy,
                    });
                    break;
                }
            }
        }
    }
};
const applyAddEnergyToCreatureOrMagiEffect = function (action, transform) {
    const addMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(addMiltiTarget, (target) => {
        switch (target.card.type) {
            case const_1.TYPE_CREATURE:
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
                    amount: action.amount,
                    target,
                    source: undefined,
                    generatedBy: action.generatedBy,
                });
                break;
            case const_1.TYPE_MAGI:
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
                    amount: action.amount,
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
        }
    });
};
const applyDiscardEnergyFromCreatureOrMagiEffect = function (action, transform) {
    const discardMultiTarget = this.getMetaValue(action.target, action.generatedBy);
    const source = action.source;
    if (!source) {
        return;
    }
    (0, actionMapUtils_1.oneOrSeveral)(discardMultiTarget, target => {
        switch (target.card.type) {
            case const_1.TYPE_CREATURE: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    source: action.source,
                    variable: action.variable || false,
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case const_1.TYPE_MAGI: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
                    source,
                    amount: action.amount,
                    attack: action.attack || false,
                    spell: action.spell || false,
                    relic: action.relic || false,
                    ...(action.variable ? { variable: action.variable } : {}),
                    target,
                    generatedBy: action.generatedBy,
                });
                break;
            }
        }
    });
};
exports.applyDiscardEnergyFromCreatureOrMagiEffect = applyDiscardEnergyFromCreatureOrMagiEffect;
const applyDiscardEnergyFromMagiEffect = function (action, transform) {
    (0, actionMapUtils_1.oneOrSeveral)(this.getMetaValue(action.target, action.generatedBy), target => {
        const energyToRemove = Math.min(this.getMetaValue(action.amount, action.generatedBy), target.data.energy);
        target.removeEnergy(energyToRemove);
        if (energyToRemove > 0) {
            transform({
                ...action,
                effectType: const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_MAGI,
                amount: energyToRemove,
            });
        }
    });
};
const applyDefeatMagiEffect = function (action, transform) {
    const magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(magiMiltiTarget, target => {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MAGI_IS_DEFEATED,
            target,
            source: null,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
const applyMagiIsDefeatedEffect = function (action, transform) {
    const { target, generatedBy } = action;
    const stillHasMagi = this.getZone(const_1.ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
    if (stillHasMagi) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: target,
            sourceZone: const_1.ZONE_TYPE_ACTIVE_MAGI,
            destinationZone: const_1.ZONE_TYPE_DEFEATED_MAGI,
            bottom: false,
            generatedBy,
        }, {
            type: const_1.ACTION_SELECT,
            selector: const_1.SELECTOR_OWN_CARDS_IN_PLAY,
            player: target.owner,
            variable: 'cardsInPlay',
            generatedBy,
        }, {
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
            dueToMagiDefeat: true,
            target: '$cardsInPlay',
            player: target.owner,
            generatedBy,
        });
    }
    else {
        const winner = this.getOpponent(target.owner);
        transform({
            type: const_1.ACTION_PLAYER_WINS,
            player: winner,
        });
    }
};
const applyDiscardEnergyFromCreaturesEffect = function (action, transform) {
    // Right now multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE cannot be distinguished on target-by-target basis
    // No cards use this effect now, but some may later
    // Also, multitarget EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE was probably a bad idea from the start
    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var amount = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    (0, actionMapUtils_1.oneOrSeveral)(multiTarget, target => {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
            target,
            amount,
            power: action.power,
            spell: action.spell,
            source: action.source,
            attack: action.attack,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
const applyDiscardEnergyFromCreatureEffect = function (action, transform) {
    const multiTarget = this.getMetaValue(action.target, action.generatedBy);
    var totalEnergyLost = 0;
    (0, actionMapUtils_1.oneOrSeveral)(multiTarget, target => {
        if (this.isCardAffectedByEffect(target, action)) {
            var energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
            const energyLossThreshold = this.modifyByStaticAbilities(target, const_1.PROPERTY_ENERGY_LOSS_THRESHOLD);
            const energyLostAlready = target.data.energyLostThisTurn;
            if (energyLossThreshold > 0 && (action.power || action.spell || action.attack)) {
                const energyCanLoseThisTurn = Math.max(energyLossThreshold - energyLostAlready, 0);
                energyToLose = Math.min(energyToLose, energyCanLoseThisTurn);
            }
            const energyLost = Math.min(energyToLose, target.data.energy);
            target.removeEnergy(energyLost);
            totalEnergyLost += energyLost;
            if (target.data.energy == 0 && !action.attack) {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                    source: action.source,
                    target,
                    attack: action.attack,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
            }
            // The events transformed later take precedence over the events transformed earlier
            // That's why we transform the energy discarded event here before potentially transforming a discard creature event
            if (energyToLose > 0) {
                transform({
                    ...action,
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_ENERGY_DISCARDED_FROM_CREATURE,
                    amount: energyLost,
                });
            }
        }
    });
    if (action.variable) {
        this.setSpellMetaDataField(action.variable, totalEnergyLost, action.generatedBy);
    }
};
const applyRemoveEnergyFromCreatureEffect = function (action, transform) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === const_1.TYPE_CREATURE) {
        target.removeEnergy(energyToLose);
        if (target.data.energy === 0) {
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target,
                attack: false,
                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                destinationZone: const_1.ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            });
        }
    }
    else {
        console.error('Wrong card type');
    }
};
const applyRemoveEnergyFromMagiEffect = function (action) {
    const target = this.getMetaValue(action.target, action.generatedBy);
    const energyToLose = parseInt(this.getMetaValue(action.amount, action.generatedBy), 10);
    if (target.card.type === const_1.TYPE_MAGI) {
        target.removeEnergy(energyToLose);
    }
};
const applyRestoreCreatureToStartingEnergyEffect = function (action, transform) {
    const restoreTarget = this.getMetaValue(action.target, action.generatedBy);
    const restoreAmount = restoreTarget.card.cost - restoreTarget.data.energy;
    if (restoreAmount > 0) {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
            source: action.source || undefined,
            power: action.power || false,
            spell: action.spell || false,
            target: restoreTarget,
            amount: restoreAmount,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    }
};
const applyPayingEnergyForPowerEffect = function (action, transform) {
    const payingTarget = this.getMetaValue(action.target, action.generatedBy);
    const payingAmount = Number(this.getMetaValue(action.amount, action.generatedBy));
    if (payingAmount > 0) {
        switch (payingTarget.card.type) {
            case const_1.TYPE_CREATURE: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
            case const_1.TYPE_MAGI: {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI,
                    target: payingTarget,
                    amount: payingAmount,
                    player: action.player,
                    generatedBy: action.generatedBy,
                });
                break;
            }
        }
    }
};
const applyAddEnergyToCreatureEffect = function (action) {
    const addTargets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(addTargets, addTarget => {
        if (this.isCardAffectedByEffect(addTarget, action)) {
            addTarget.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy), 10));
        }
    });
};
const applyAddStartingEnergyToMagiEffect = function (action, transform) {
    const magiTargets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(magiTargets, magiTarget => {
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
const applyAddEnergyToMagiEffect = function (action) {
    const magiTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(magiTarget, target => target.addEnergy(parseInt(this.getMetaValue(action.amount, action.generatedBy)), 10));
};
const applyDiscardCreatureOrRelic = function (action, transform) {
    const discardTargets = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(discardTargets, target => {
        const targetType = target.card.type;
        if (targetType === const_1.TYPE_CREATURE) {
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                attack: false,
                target,
                generatedBy: action.generatedBy,
                player: action.player || 0,
            });
        }
        else if (targetType === const_1.TYPE_RELIC) {
            transform({
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
                target,
                ...(action.dueToMagiDefeat ? { dueToMagiDefeat: true } : {}),
                generatedBy: action.generatedBy,
                player: action.player || 0,
            });
        }
    });
};
const applyDiscardRelicFromPlayEffect = function (action, transform) {
    const relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(relicDiscardTarget, relic => {
        transform({
            type: const_1.ACTION_EFFECT,
            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: relic,
            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
            destinationZone: const_1.ZONE_TYPE_DISCARD,
            bottom: false,
            generatedBy: action.generatedBy,
        });
    });
};
const applyDiscardCreatureFromPlayEffect = function (action, transform) {
    const creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    (0, actionMapUtils_1.oneOrSeveral)(creatureDiscardTarget, creature => {
        if (this.isCardAffectedByEffect(creature, action)) {
            const effect = {
                type: const_1.ACTION_EFFECT,
                effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target: creature,
                attack: action.attack,
                sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                destinationZone: const_1.ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            };
            transform(effect);
        }
    });
};
const applyCreateContinuousEffect = function (action) {
    const id = (0, nanoid_1.nanoid)();
    const staticAbilities = (action.staticAbilities || []).map(ability => {
        switch (ability.selector) {
            case const_1.SELECTOR_ID: {
                const selectorParameterMetaValue = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                const selectorParameter = (selectorParameterMetaValue instanceof CardInGame_1.default) ? selectorParameterMetaValue.id : selectorParameterMetaValue;
                return {
                    ...ability,
                    selectorParameter,
                };
            }
            case const_1.SELECTOR_CREATURES_OF_PLAYER: {
                const selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
                return {
                    ...ability,
                    selectorParameter,
                };
            }
            default: {
                return ability;
            }
        }
    }).map(ability => {
        const operandOne = this.getMetaValue(ability.modifier?.operandOne, action.generatedBy);
        return {
            ...ability,
            modifier: {
                operator: ability.modifier.operator,
                operandOne,
            },
        };
    });
    const continuousEffect = {
        triggerEffects: action.triggerEffects || [],
        staticAbilities,
        expiration: action.expiration,
        player: action.player || 0,
        id,
    };
    this.state = {
        ...this.state,
        continuousEffects: [
            ...this.state.continuousEffects,
            continuousEffect,
        ],
    };
};
const applyRearrangeEnergyOnCreaturesEffect = function (action, transform) {
    const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    const ownCreatures = this.useSelector(const_1.SELECTOR_OWN_CREATURES, action.player || 0);
    const totalEnergyOnCreatures = (ownCreatures instanceof Array) ? ownCreatures.map(card => card.data.energy).reduce((a, b) => a + b, 0) : 0;
    const newEnergyTotal = Object.values(energyArrangement).reduce((a, b) => a + b, 0);
    // Energy stasis check
    const valid = this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.every(card => {
        if (!card.card.data.energyStasis)
            return true;
        if (card.id in energyArrangement) {
            const newEnergy = energyArrangement[card.id];
            return newEnergy === card.data.energy;
        }
        return true;
    });
    if (valid) {
        if (newEnergyTotal === totalEnergyOnCreatures) {
            this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
                if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement) {
                    const newEnergy = energyArrangement[card.id];
                    card.setEnergy(newEnergy);
                    if (card.data.energy === 0) {
                        transform({
                            type: const_1.ACTION_EFFECT,
                            effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: card,
                            sourceZone: const_1.ZONE_TYPE_IN_PLAY,
                            destinationZone: const_1.ZONE_TYPE_DISCARD,
                            bottom: false,
                            attack: false,
                            generatedBy: action.generatedBy,
                        });
                    }
                }
            });
        }
        else if (this.debug) {
            console.error(`Cannot rearrange energy because new total ${newEnergyTotal} is not equal to old total ${totalEnergyOnCreatures}`);
        }
    }
    else if (this.debug) {
        console.error('One or more creatures with Energy Stasis is to be affected with energy rearrangement');
    }
};
const applyDistributeEnergyOnCreaturesEffect = function (action) {
    const energyArrangement = this.getMetaValue(action.energyOnCreatures, action.generatedBy);
    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
        if (card.card.type === const_1.TYPE_CREATURE && card.id in energyArrangement) {
            const energyAmount = energyArrangement[card.id];
            card.addEnergy(energyAmount);
        }
    });
};
const applyDistributeDamageEffect = function (action, transform) {
    const damageArrangement = this.getMetaValue(action.damageOnCreatures, action.generatedBy);
    this.getZone(const_1.ZONE_TYPE_IN_PLAY).cards.forEach(card => {
        if (card.card.type === const_1.TYPE_CREATURE && card.id in damageArrangement) {
            const damageAmount = damageArrangement[card.id];
            const source = action.source;
            if (damageAmount > 0 && source) {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                    source,
                    target: card,
                    amount: damageAmount,
                    generatedBy: action.generatedBy,
                    player: action.player,
                });
            }
        }
    });
};
const applyRearrangeCardsOfZoneEffect = function (action) {
    const zone = this.getMetaValue(action.zone, action.generatedBy);
    const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
    // const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
    const zoneContent = this.getZone(zone, zoneOwner).cards;
    const cardsOrder = this.getMetaValue(action.cards, action.generatedBy);
    const cardsToRearrange = {};
    for (let i = 0; i < cardsOrder.length; i++) {
        if (i >= zoneContent.length)
            break;
        const currentCard = zoneContent[i];
        cardsToRearrange[currentCard.id] = currentCard;
    }
    const newZoneContent = [
        ...cardsOrder.map(id => cardsToRearrange[id]),
        ...zoneContent.slice(cardsOrder.length),
    ];
    this.getZone(zone, zoneOwner).cards = newZoneContent;
};
const applyDistributeCardsInZonesEffect = function (action, transform) {
    const sourceZone = this.getMetaValue(action.sourceZone, action.generatedBy);
    const sourceZoneOwner = this.getMetaValue(action.sourceZoneOwner, action.generatedBy);
    const zoneContent = this.getZone(sourceZone, sourceZoneOwner);
    const cardsDistribution = this.getMetaValue(action.cards, action.generatedBy);
    // Check for the cards in the zone
    const totalCards = Object.values(cardsDistribution).flat();
    for (let card of totalCards) {
        if (!zoneContent.containsId(card.id)) {
            console.error(`Card ${card.id} is not in the indicated zone`);
            return;
        }
    }
    // Move the cards
    for (let [zone, zoneCards] of Object.entries(cardsDistribution)) {
        for (let card of zoneCards) {
            const targetCard = zoneContent.byId(card.id);
            if (targetCard) {
                transform({
                    type: const_1.ACTION_EFFECT,
                    effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    sourceZone,
                    target: targetCard,
                    bottom: false,
                    destinationZone: zone,
                    generatedBy: action.generatedBy,
                });
            }
        }
    }
};
const applyPlayAttachedToCreatureEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    transform({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
        sourceZone: const_1.ZONE_TYPE_HAND,
        destinationZone: const_1.ZONE_TYPE_IN_PLAY,
        target: card,
        generatedBy: action.generatedBy,
        bottom: false,
    }, {
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD,
        target: '$new_card', // We need to attach the new card in play, not the one in hand 
        attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
const applyAttachCardToCardEffect = function (action, transform) {
    const card = this.getMetaValue(action.target, action.generatedBy);
    const attachmentTarget = this.getMetaValue(action.attachmentTarget, action.generatedBy);
    this.attachCard(card.id, attachmentTarget.id);
    this.transformIntoActions({
        type: const_1.ACTION_EFFECT,
        effectType: const_1.EFFECT_TYPE_CARD_ATTACHED_TO_CARD,
        target: card,
        attachmentTarget: action.attachmentTarget,
        generatedBy: action.generatedBy,
    });
};
exports.actionMap = {
    // Beginning of turn and step
    [const_1.EFFECT_TYPE_START_TURN]: applyStartTurnEffect,
    [const_1.EFFECT_TYPE_START_OF_TURN]: applyStartOfTurnEffect,
    [const_1.EFFECT_TYPE_START_STEP]: applyStartStepEffect,
    [const_1.EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP]: applyDrawCardsInDrawStep,
    [const_1.EFFECT_TYPE_FIND_STARTING_CARDS]: applyFindStartingCardsEffect,
    [const_1.EFFECT_TYPE_DRAW_REST_OF_CARDS]: applyDrawRestOfCardsEffect,
    [const_1.EFFECT_TYPE_MAGI_FLIPPED]: applyMagiFlippedEffect,
    [const_1.EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI]: applyAddStartingEnergyToMagiEffect,
    // Discarding
    [const_1.EFFECT_TYPE_DISCARD_CARDS_FROM_HAND]: applyDiscardCardsEffect,
    [const_1.EFFECT_TYPE_DISCARD_CARD_FROM_HAND]: applyDiscardCardEffect,
    [const_1.EFFECT_TYPE_RESHUFFLE_DISCARD]: applyReshuffleDiscardEffect,
    // Returning to hand
    [const_1.EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY]: applyReturnCreatureDiscardingEnergyEffect,
    [const_1.EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY]: applyReturnCreatureReturningEnergyEffect,
    // Drawing cards
    [const_1.EFFECT_TYPE_DRAW_N_CARDS]: applyDrawNCardsEffect,
    [const_1.EFFECT_TYPE_DRAW]: applyDrawEffect,
    // Attacking
    [const_1.EFFECT_TYPE_ATTACK]: applyAttackEffect,
    [const_1.EFFECT_TYPE_BEFORE_DAMAGE]: applyBeforeDamageEffect,
    [const_1.EFFECT_TYPE_DAMAGE_STEP]: applyDamageStepEffect,
    [const_1.EFFECT_TYPE_ATTACKER_DEALS_DAMAGE]: applyAttackerDealsDamageEffect,
    [const_1.EFFECT_TYPE_DEFENDER_DEALS_DAMAGE]: applyDefenderDealsDamageEffect,
    [const_1.EFFECT_TYPE_DEAL_DAMAGE]: applyDealDamageEffect,
    [const_1.EFFECT_TYPE_AFTER_DAMAGE]: applyAfterDamageEffect,
    [const_1.EFFECT_TYPE_CREATURE_DEFEATS_CREATURE]: applyCreatureDefeatsCreatureEffect,
    // Randomization
    [const_1.EFFECT_TYPE_ROLL_DIE]: applyRollDieEffect,
    [const_1.EFFECT_TYPE_DIE_ROLLED]: applyDieRolledEffect,
    // Powers
    [const_1.EFFECT_TYPE_EXECUTE_POWER_EFFECTS]: applyExecutePowerEffects,
    [const_1.EFFECT_TYPE_ENERGIZE]: applyEnergizeEffect,
    [const_1.EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES]: applyMoveCardsBetweenZonesEffect,
    [const_1.EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES]: applyMoveCardBetweenZonesEffect,
    [const_1.EFFECT_TYPE_DEFEAT_MAGI]: applyDefeatMagiEffect,
    [const_1.EFFECT_TYPE_MAGI_IS_DEFEATED]: applyMagiIsDefeatedEffect,
    [const_1.EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC]: applyDiscardCreatureOrRelic,
    [const_1.EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY]: applyDiscardRelicFromPlayEffect,
    [const_1.EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]: applyDiscardCreatureFromPlayEffect,
    [const_1.EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE]: applyRearrangeCardsOfZoneEffect,
    [const_1.EFFECT_TYPE_ATTACH_CARD_TO_CARD]: applyAttachCardToCardEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_CARDS_IN_ZONES]: applyDistributeCardsInZonesEffect,
    // Moving energy
    [const_1.EFFECT_TYPE_MOVE_ENERGY]: applyMoveEnergyEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI]: applyAddEnergyToCreatureOrMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI]: exports.applyDiscardEnergyFromCreatureOrMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI]: applyDiscardEnergyFromMagiEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURES]: applyDiscardEnergyFromCreaturesEffect,
    [const_1.EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE]: applyDiscardEnergyFromCreatureEffect,
    [const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE]: applyRemoveEnergyFromCreatureEffect,
    [const_1.EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI]: applyRemoveEnergyFromMagiEffect,
    [const_1.EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY]: applyRestoreCreatureToStartingEnergyEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_CREATURE]: applyAddEnergyToCreatureEffect,
    [const_1.EFFECT_TYPE_ADD_ENERGY_TO_MAGI]: applyAddEnergyToMagiEffect,
    [const_1.EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: applyRearrangeEnergyOnCreaturesEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: applyDistributeEnergyOnCreaturesEffect,
    [const_1.EFFECT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: applyDistributeDamageEffect,
    // Playing stuff
    [const_1.EFFECT_TYPE_PLAY_RELIC]: applyPlayRelicEffect,
    [const_1.EFFECT_TYPE_PLAY_CREATURE]: applyPlayCreatureEffect,
    [const_1.EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE]: applyStartingEnergyOnCreatureEffect,
    [const_1.EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE]: applyPlayAttachedToCreatureEffect,
    // Paying for stuff
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC]: applyPayingEnergyForRelicEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL]: applyPayingEnergyForSpellEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE]: applyPayingEnergyForCreatureEffect,
    [const_1.EFFECT_TYPE_PAYING_ENERGY_FOR_POWER]: applyPayingEnergyForPowerEffect,
    // Delayed triggers, conditional and continuous effects
    [const_1.EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE]: applyForbidAttackToCreatureEffect,
    [const_1.EFFECT_TYPE_ADD_DELAYED_TRIGGER]: applyAddDelayedTriggerEffect,
    [const_1.EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT]: applyCreateContinuousEffect,
    [const_1.EFFECT_TYPE_CONDITIONAL]: applyConditionalEffect,
};
//# sourceMappingURL=effects.js.map