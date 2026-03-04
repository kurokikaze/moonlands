"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = performCalculation;
const const_1 = require("../const");
function performCalculation(operator, operandOne, operandTwo) {
    let result;
    switch (operator) {
        case const_1.CALCULATION_SET: {
            result = operandOne;
            break;
        }
        case const_1.CALCULATION_DOUBLE: {
            result = operandOne * 2;
            break;
        }
        case const_1.CALCULATION_ADD: {
            result = operandOne + operandTwo;
            break;
        }
        case const_1.CALCULATION_SUBTRACT: {
            result = operandOne - operandTwo;
            break;
        }
        case const_1.CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
            result = Math.max(operandOne - operandTwo, 1);
            break;
        }
        case const_1.CALCULATION_HALVE_ROUND_DOWN: {
            result = Math.floor(operandOne / 2);
            break;
        }
        case const_1.CALCULATION_HALVE_ROUND_UP: {
            result = Math.ceil(operandOne / 2);
            break;
        }
        case const_1.CALCULATION_MULTIPLY: {
            result = operandOne * operandTwo;
            break;
        }
        case const_1.CALCULATION_MIN: {
            result = Math.min(operandOne, operandTwo);
            break;
        }
        case const_1.CALCULATION_MAX: {
            result = Math.max(operandOne, operandTwo);
            break;
        }
    }
    return result;
}
//# sourceMappingURL=performCalculation.js.map