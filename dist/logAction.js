import CardInGame from './classes/CardInGame';
var FgRed = '\x1b[31m';
var FgGreen = '\x1b[32m';
var FgYellow = '\x1b[33m';
var FgBlue = '\x1b[34m';
var FgMagenta = '\x1b[35m';
var FgCyan = '\x1b[36m';
var FgWhite = '\x1b[37m';
var Reset = '\x1b[0m';
export var color = {
    red: function (word) { return "".concat(FgRed).concat(word).concat(Reset); },
    green: function (word) { return "".concat(FgGreen).concat(word).concat(Reset); },
    yellow: function (word) { return "".concat(FgYellow).concat(word).concat(Reset); },
    blue: function (word) { return "".concat(FgBlue).concat(word).concat(Reset); },
    magenta: function (word) { return "".concat(FgMagenta).concat(word).concat(Reset); },
    cyan: function (word) { return "".concat(FgCyan).concat(word).concat(Reset); },
    white: function (word) { return "".concat(FgWhite).concat(word).concat(Reset); },
};
var showCard = function (card) { return (card instanceof CardInGame) ? "<".concat(color.blue(card.card.name), " [").concat(card.id, "]>") : card; };
export var showAction = function (action) {
    var fields = Object.keys(action).filter(function (f) { return f != 'type'; }).map(function (field) {
        var card = action[field];
        var cardToShow = (card instanceof Array) ? card[0] : card;
        return "\t".concat(field, ": ").concat(showCard(cardToShow));
    });
    console.log("\n{\n\t".concat(color.yellow(action.type), "\n").concat(fields.join('\n'), "\n}"));
};
//# sourceMappingURL=logAction.js.map