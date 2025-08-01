import { CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MULTIPLY, CALCULATION_MIN, CALCULATION_MAX } from "../const";
import { OperatorType } from "../types";

export default function performCalculation(operator: OperatorType, operandOne: number, operandTwo: number): number {
		let result: number;
		switch (operator) {
			case CALCULATION_SET: {
				result = operandOne;
				break;
			}
			case CALCULATION_DOUBLE: {
				result = operandOne * 2;
				break;
			}
			case CALCULATION_ADD: {
				result = operandOne + operandTwo;
				break;
			}
			case CALCULATION_SUBTRACT: {
				result = operandOne - operandTwo;
				break;
			}
			case CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
				result = Math.max(operandOne - operandTwo, 1);
				break;
			}
			case CALCULATION_HALVE_ROUND_DOWN: {
				result = Math.floor(operandOne / 2);
				break;
			}
			case CALCULATION_HALVE_ROUND_UP: {
				result = Math.ceil(operandOne / 2);
				break;
			}
			case CALCULATION_MULTIPLY: {
				result = operandOne * operandTwo;
				break;
			}
			case CALCULATION_MIN: {
				result = Math.min(operandOne, operandTwo);
				break;
			}
			case CALCULATION_MAX: {
				result = Math.max(operandOne, operandTwo);
				break;
			}
		}

		return result;
	}