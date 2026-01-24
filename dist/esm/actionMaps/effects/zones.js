var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import CardInGame from "../../classes/CardInGame.js";
import { ACTION_EFFECT, ACTION_PLAYER_WINS, ACTION_SELECT, EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES, EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY, EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC, EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, EFFECT_TYPE_MAGI_IS_DEFEATED, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, SELECTOR_OWN_CARDS_IN_PLAY, TYPE_CREATURE, TYPE_RELIC, ZONE_TYPE_ACTIVE_MAGI, ZONE_TYPE_DEFEATED_MAGI, ZONE_TYPE_DISCARD, ZONE_TYPE_IN_PLAY, ZONE_TYPE_MAGI_PILE, } from "../../const.js";
import { oneOrSeveral } from "../actionMapUtils.js";
export var applyMoveCardsBetweenZonesEffect = function (action, transform, _state, seeded_nanoid) {
    var _this = this;
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    var zoneChangingTargets = this.getMetaValue(action.target, action.generatedBy) || [];
    if (!zoneChangingTargets) {
        console.dir(zoneChangingTargets);
        console.dir(this.getSpellMetadata(action.generatedBy));
    }
    if (zoneChangingTargets.length) {
        // We assume all cards changing zones are in one zone initially
        var zoneOwner = zoneChangingTargets[0].owner;
        var sourceZoneType_1 = this.getMetaValue(action.sourceZone, action.generatedBy);
        var sourceZone_1 = this.getZone(sourceZoneType_1, sourceZoneType_1 === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        var destinationZoneType_1 = this.getMetaValue(action.destinationZone, action.generatedBy);
        var destinationZone_1 = this.getZone(destinationZoneType_1, destinationZoneType_1 === ZONE_TYPE_IN_PLAY ? null : zoneOwner);
        var newCards_1 = [];
        oneOrSeveral(zoneChangingTargets, function (zoneChangingCard) {
            var newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
            if (action.bottom) {
                destinationZone_1.add([newObject]);
            }
            else {
                destinationZone_1.addToTop([newObject]);
            }
            sourceZone_1.removeById(zoneChangingCard.id);
            newCards_1.push(newObject);
            // Let the old cards keep track of the movement too
            _this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
                sourceCard: zoneChangingCard,
                sourceZone: sourceZoneType_1,
                destinationCard: newObject,
                destinationZone: destinationZoneType_1,
                generatedBy: action.generatedBy,
            });
        });
        this.setSpellMetaDataField('new_cards', newCards_1, action.generatedBy);
    }
};
export var applyMoveCardBetweenZonesEffect = function (action, transform, _state, seeded_nanoid) {
    if (!action.sourceZone || !action.destinationZone) {
        console.error('Source zone or destination zone invalid');
        throw new Error('Invalid params for EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES');
    }
    var zoneChangingTarget = this.getMetaValue(action.target, action.generatedBy);
    var zoneChangingCard = (zoneChangingTarget instanceof Array) ? zoneChangingTarget[0] : zoneChangingTarget;
    if (zoneChangingCard) {
        var sourceZoneType = this.getMetaValue(action.sourceZone, action.generatedBy);
        var destinationZoneType = this.getMetaValue(action.destinationZone, action.generatedBy);
        var destinationZone = this.getZone(destinationZoneType, destinationZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        var sourceZone = this.getZone(sourceZoneType, sourceZoneType === ZONE_TYPE_IN_PLAY ? null : zoneChangingCard.owner);
        var newObject = new CardInGame(zoneChangingCard.card, zoneChangingCard.owner, seeded_nanoid);
        if (action.bottom) {
            destinationZone.add([newObject]);
        }
        else {
            destinationZone.addToTop([newObject]);
        }
        sourceZone.removeById(zoneChangingCard.id);
        if (sourceZoneType == ZONE_TYPE_IN_PLAY && destinationZoneType !== ZONE_TYPE_IN_PLAY) {
            if (zoneChangingCard.id in this.state.cardsAttached) {
                // Queue the removal of the attached cards
                for (var _i = 0, _a = this.state.cardsAttached[zoneChangingCard.id]; _i < _a.length; _i++) {
                    var attachmentId = _a[_i];
                    var attachedCard = this.getZone(ZONE_TYPE_IN_PLAY).byId(attachmentId);
                    if (attachedCard) {
                        transform({
                            type: ACTION_EFFECT,
                            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                            target: attachedCard,
                            sourceZone: ZONE_TYPE_IN_PLAY,
                            destinationZone: ZONE_TYPE_DISCARD,
                            generatedBy: action.generatedBy,
                            bottom: false,
                        });
                    }
                    else {
                        console.log("Cannot find the card ".concat(attachmentId, " in play"));
                    }
                }
                // This cleans up the attachments
                this.removeAttachments(zoneChangingCard.id);
            }
        }
        this.setSpellMetaDataField('new_card', newObject, action.generatedBy);
        this.setSpellMetaDataField('new_card', newObject, zoneChangingCard.id);
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
            sourceCard: zoneChangingCard,
            sourceZone: sourceZoneType,
            destinationCard: newObject,
            attack: action.attack,
            destinationZone: destinationZoneType,
            generatedBy: action.generatedBy,
        });
    }
};
export var applyDefeatMagiEffect = function (action, transform) {
    var magiMiltiTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(magiMiltiTarget, function (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
            target: target,
            source: null,
            player: action.player,
            generatedBy: action.generatedBy,
        });
    });
};
export var applyMagiIsDefeatedEffect = function (action, transform) {
    var target = action.target, generatedBy = action.generatedBy;
    var stillHasMagi = this.getZone(ZONE_TYPE_MAGI_PILE, target.data.controller).length > 0;
    if (stillHasMagi) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: target,
            sourceZone: ZONE_TYPE_ACTIVE_MAGI,
            destinationZone: ZONE_TYPE_DEFEATED_MAGI,
            bottom: false,
            generatedBy: generatedBy,
        }, {
            type: ACTION_SELECT,
            selector: SELECTOR_OWN_CARDS_IN_PLAY,
            player: target.owner,
            variable: 'cardsInPlay',
            generatedBy: generatedBy,
        }, {
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
            dueToMagiDefeat: true,
            target: '$cardsInPlay',
            player: target.owner,
            generatedBy: generatedBy,
        });
    }
    else {
        var winner = this.getOpponent(target.owner);
        transform({
            type: ACTION_PLAYER_WINS,
            player: winner,
        });
    }
};
export var applyDiscardCreatureOrRelic = function (action, transform) {
    var discardTargets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(discardTargets, function (target) {
        var targetType = target.card.type;
        if (targetType === TYPE_CREATURE) {
            transform({
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
                attack: false,
                target: target,
                generatedBy: action.generatedBy,
                player: action.player || 0,
            });
        }
        else if (targetType === TYPE_RELIC) {
            transform(__assign(__assign({ type: ACTION_EFFECT, effectType: EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY, target: target }, (action.dueToMagiDefeat ? { dueToMagiDefeat: true } : {})), { generatedBy: action.generatedBy, player: action.player || 0 }));
        }
    });
};
export var applyDiscardRelicFromPlayEffect = function (action, transform) {
    var relicDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(relicDiscardTarget, function (relic) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            target: relic,
            sourceZone: ZONE_TYPE_IN_PLAY,
            destinationZone: ZONE_TYPE_DISCARD,
            bottom: false,
            generatedBy: action.generatedBy,
        });
    });
};
export var applyDiscardCreatureFromPlayEffect = function (action, transform) {
    var _this = this;
    var creatureDiscardTarget = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(creatureDiscardTarget, function (creature) {
        if (_this.isCardAffectedByEffect(creature, action)) {
            var effect = {
                type: ACTION_EFFECT,
                effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                target: creature,
                attack: action.attack,
                sourceZone: ZONE_TYPE_IN_PLAY,
                destinationZone: ZONE_TYPE_DISCARD,
                bottom: false,
                generatedBy: action.generatedBy,
            };
            transform(effect);
        }
    });
};
export var applyRearrangeCardsOfZoneEffect = function (action) {
    var zone = this.getMetaValue(action.zone, action.generatedBy);
    var zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
    // const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
    var zoneContent = this.getZone(zone, zoneOwner).cards;
    var cardsOrder = this.getMetaValue(action.cards, action.generatedBy);
    var cardsToRearrange = {};
    for (var i = 0; i < cardsOrder.length; i++) {
        if (i >= zoneContent.length)
            break;
        var currentCard = zoneContent[i];
        cardsToRearrange[currentCard.id] = currentCard;
    }
    var newZoneContent = __spreadArray(__spreadArray([], cardsOrder.map(function (id) { return cardsToRearrange[id]; }), true), zoneContent.slice(cardsOrder.length), true);
    this.getZone(zone, zoneOwner).cards = newZoneContent;
};
export var applyDistributeCardsInZonesEffect = function (action, transform) {
    var sourceZone = this.getMetaValue(action.sourceZone, action.generatedBy);
    var sourceZoneOwner = this.getMetaValue(action.sourceZoneOwner, action.generatedBy);
    var zoneContent = this.getZone(sourceZone, sourceZoneOwner);
    var cardsDistribution = this.getMetaValue(action.cards, action.generatedBy);
    // Check for the cards in the zone
    var totalCards = Object.values(cardsDistribution).flat();
    for (var _i = 0, totalCards_1 = totalCards; _i < totalCards_1.length; _i++) {
        var card = totalCards_1[_i];
        if (!zoneContent.containsId(card.id)) {
            console.error("Card ".concat(card.id, " is not in the indicated zone"));
            return;
        }
    }
    // Move the cards
    for (var _a = 0, _b = Object.entries(cardsDistribution); _a < _b.length; _a++) {
        var _c = _b[_a], zone = _c[0], zoneCards = _c[1];
        for (var _d = 0, zoneCards_1 = zoneCards; _d < zoneCards_1.length; _d++) {
            var card = zoneCards_1[_d];
            var targetCard = zoneContent.byId(card.id);
            if (targetCard) {
                transform({
                    type: ACTION_EFFECT,
                    effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
                    sourceZone: sourceZone,
                    target: targetCard,
                    bottom: false,
                    destinationZone: zone,
                    generatedBy: action.generatedBy,
                });
            }
        }
    }
};
//# sourceMappingURL=zones.js.map