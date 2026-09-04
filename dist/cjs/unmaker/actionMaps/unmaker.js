"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmakerActionMap = void 0;
const types_1 = require("../types");
exports.unmakerActionMap = {
    [types_1.UNMAKE_EFFECT_TYPE_PLAYER_WINS]: function (unmaker, state) {
        state.unsetWinner();
    },
    [types_1.UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY]: function (unmaker, state) {
        const logCount = unmaker.readNumber('logCount');
        state.state.log.length -= logCount;
    },
};
//# sourceMappingURL=unmaker.js.map