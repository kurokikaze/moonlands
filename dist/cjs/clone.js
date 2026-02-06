"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = require("./cards");
const CardInGame_1 = __importDefault(require("./classes/CardInGame"));
const Zone_1 = __importDefault(require("./classes/Zone"));
function clone(item, cardsGenerated = {}) {
    if (!item) {
        return item;
    } // null, undefined values check
    var types = [Number, String, Boolean], result;
    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
        if (item instanceof type) {
            return type(item);
        }
    });
    if (typeof result == 'undefined') {
        if (Object.prototype.toString.call(item) === '[object Array]') {
            const result = [];
            item.forEach(function (child, index) {
                result[index] = clone(child, cardsGenerated);
            });
            return result;
        }
        else if (typeof item == 'object') {
            // testing that this is DOM
            if (!('prototype' in item)) { // check that this is a literal
                if (item instanceof Date) {
                    return new Date(item);
                }
                else if (item instanceof Zone_1.default) {
                    result = new Zone_1.default(item.name, item.type, item.player, item.ordered);
                    result.add(item.cards.map(card => clone(card, cardsGenerated)));
                    return result;
                }
                else if (item instanceof CardInGame_1.default) {
                    const card = (0, cards_1.byName)(item.card.name);
                    if (card) {
                        if (item.id in cardsGenerated) {
                            return cardsGenerated[item.id];
                        }
                        result = new CardInGame_1.default(card, item.owner);
                        result.id = item.id;
                        result.modifiedCard = item.modifiedCard;
                        result.data = clone(item.data, cardsGenerated);
                        cardsGenerated[item.id] = result;
                        return result;
                    }
                    else {
                        return {};
                    }
                }
                else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone(item[i], cardsGenerated);
                    }
                }
            }
            else {
                // depending what you would like here,
                // just keep the reference, or create new object
                // if (false && item.constructor) {
                // 	// would not advice to do that, reason? Read below
                // 	result = new item.constructor();
                // } else {
                result = item;
                // }
            }
        }
        else {
            result = item;
        }
    }
    return result;
}
exports.default = clone;
//# sourceMappingURL=clone.js.map