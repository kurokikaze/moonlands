"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDistributeCardsInZonesEffect = exports.applyRearrangeCardsOfZoneEffect = exports.applyDiscardCreatureFromPlayEffect = exports.applyDiscardRelicFromPlayEffect = exports.applyDiscardCreatureOrRelic = exports.applyMagiIsDefeatedEffect = exports.applyDefeatMagiEffect = exports.applyMoveCardBetweenZonesEffect = exports.applyMoveCardsBetweenZonesEffect = void 0;
const CardInGame_1 = __importDefault(require("../../classes/CardInGame"));
const const_1 = require("../../const");
const actionMapUtils_1 = require("../actionMapUtils");
const applyMoveCardsBetweenZonesEffect = function (action, transform, _state, seeded_nanoid) {
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
            const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
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
exports.applyMoveCardsBetweenZonesEffect = applyMoveCardsBetweenZonesEffect;
const applyMoveCardBetweenZonesEffect = function (action, transform, _state, seeded_nanoid) {
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
        const newObject = new CardInGame_1.default(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
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
exports.applyMoveCardBetweenZonesEffect = applyMoveCardBetweenZonesEffect;
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
exports.applyDefeatMagiEffect = applyDefeatMagiEffect;
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
exports.applyMagiIsDefeatedEffect = applyMagiIsDefeatedEffect;
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
exports.applyDiscardCreatureOrRelic = applyDiscardCreatureOrRelic;
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
exports.applyDiscardRelicFromPlayEffect = applyDiscardRelicFromPlayEffect;
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
exports.applyDiscardCreatureFromPlayEffect = applyDiscardCreatureFromPlayEffect;
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
exports.applyRearrangeCardsOfZoneEffect = applyRearrangeCardsOfZoneEffect;
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
exports.applyDistributeCardsInZonesEffect = applyDistributeCardsInZonesEffect;
//# sourceMappingURL=zones.js.map