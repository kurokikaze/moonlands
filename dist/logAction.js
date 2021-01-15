"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAction = exports.color = void 0;
var CardInGame_1 = __importDefault(require("./classes/CardInGame"));
var FgRed = '\x1b[31m';
var FgGreen = '\x1b[32m';
var FgYellow = '\x1b[33m';
var FgBlue = '\x1b[34m';
var FgMagenta = '\x1b[35m';
var FgCyan = '\x1b[36m';
var FgWhite = '\x1b[37m';
var Reset = '\x1b[0m';
exports.color = {
    red: function (word) { return "" + FgRed + word + Reset; },
    green: function (word) { return "" + FgGreen + word + Reset; },
    yellow: function (word) { return "" + FgYellow + word + Reset; },
    blue: function (word) { return "" + FgBlue + word + Reset; },
    magenta: function (word) { return "" + FgMagenta + word + Reset; },
    cyan: function (word) { return "" + FgCyan + word + Reset; },
    white: function (word) { return "" + FgWhite + word + Reset; },
};
var showCard = function (card) { return (card instanceof CardInGame_1.default) ? "<" + exports.color.blue(card.card.name) + " [" + card.id + "]>" : card; };
var showAction = function (action) {
    var fields = Object.keys(action).filter(function (f) { return f != 'type'; }).map(function (field) {
        return "\t" + field + ": " + showCard(action[field]);
    });
    console.log("\n{\n\t" + exports.color.yellow(action.type) + "\n" + fields.join('\n') + "\n}");
};
exports.showAction = showAction;
//# sourceMappingURL=logAction.js.map