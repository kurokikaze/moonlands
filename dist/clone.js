import { byName } from "./cards";
import CardInGame from "./classes/CardInGame";
import Zone from "./classes/Zone";
export default function clone(item) {
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
            var result_1 = [];
            item.forEach(function (child, index) {
                result_1[index] = clone(child);
            });
            return result_1;
        }
        else if (typeof item == 'object') {
            // testing that this is DOM
            if (!('prototype' in item)) { // check that this is a literal
                if (item instanceof Date) {
                    return new Date(item);
                }
                else if (item instanceof Zone) {
                    result = new Zone(item.name, item.type, item.player, item.ordered);
                    result.add(item.cards.map(clone));
                    return result;
                }
                else if (item instanceof CardInGame) {
                    var card = byName(item.card.name);
                    if (card) {
                        result = new CardInGame(card, item.owner);
                        result.id = item.id;
                        result.modifiedCard = item.modifiedCard;
                        result.data = clone(item.data);
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
                        result[i] = clone(item[i]);
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
//# sourceMappingURL=clone.js.map