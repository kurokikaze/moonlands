"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cards_1 = require("./cards");
var CardInGame_1 = __importDefault(require("./classes/CardInGame"));
var Zone_1 = __importDefault(require("./classes/Zone"));
function clone(item) {
    if (!item) {
        return item;
    } // null, undefined values check
    var types = [Number, String, Boolean], result;
    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function (type) {
        if (item instanceof type) {
            result = type(item);
        }
    });
    if (typeof result == 'undefined') {
        if (Object.prototype.toString.call(item) === '[object Array]') {
            console.log("Cloning array");
            result = [];
            item.forEach(function (child, index) {
                result[index] = clone(child);
            });
        }
        else if (typeof item == 'object') {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == 'function') {
                result = item.cloneNode(true);
            }
            else if (!item.prototype) { // check that this is a literal
                console.log("Cloning literal");
                console.log("Is it a zone? ".concat(item instanceof Zone_1.default));
                if (item instanceof Date) {
                    result = new Date(item);
                }
                else if (item instanceof Zone_1.default) {
                    console.log("Cloning zone ".concat(item.name));
                    result = new Zone_1.default(item.name, item.type, item.player, item.ordered);
                    result.add(item.cards.map(clone));
                }
                else if (item instanceof CardInGame_1.default) {
                    console.log("Cloning card in game ".concat(item.card.name));
                    result = new CardInGame_1.default((0, cards_1.byName)(item.card.name), item.owner);
                    result.id = item.id;
                    result.modifiedCard = item.modifiedCard;
                    result.data = clone(item.data);
                }
                else {
                    console.log("Cloning object literal");
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone(item[i]);
                    }
                }
            }
            else {
                console.log("Cloning unknown type");
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