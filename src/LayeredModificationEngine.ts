import {
	PROPERTY_ID,
	PROPERTY_TYPE,
	PROPERTY_CONTROLLER,
	PROPERTY_ENERGY_COUNT,
	PROPERTY_REGION,
	PROPERTY_COST,
	PROPERTY_ENERGIZE,
	PROPERTY_MAGI_STARTING_ENERGY,
	PROPERTY_ATTACKS_PER_TURN,
	PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
	PROPERTY_POWER_COST,
	PROPERTY_CREATURE_TYPES,
	PROPERTY_STATUS_WAS_ATTACKED,
	PROPERTY_STATUS_DEFEATED_CREATURE,
	PROPERTY_ENERGY_LOSS_THRESHOLD,
	PROPERTY_STATUS,
	PROPERTY_ABLE_TO_ATTACK,
	PROPERTY_MAGI_NAME,
	PROPERTY_CAN_BE_ATTACKED,
	PROPERTY_PROTECTION,
	PROPERTY_CREATURE_NAME,
	PROPERTY_CONTROLLING_PLAYER,
	PROPERTY_ABLE_TO_USE_POWERS,

	CALCULATION_SET,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,

	STATUS_BURROWED,
	SELECTOR_STATUS,
} from './const';

import CardInGame, { InGameData } from './classes/CardInGame';
import Card, { CostType, ModifiedCardType } from './classes/Card';
import performCalculation from './helpers/performCalculation';

import {
	PropertyType,
	ProtectionType,
	StaticAbilityType,
} from './types';
import { CardType, StatusType } from './types/common';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardWithModification = {
	card: Card;
	data: InGameData;
	modifiedCard: ModifiedCardType;
	id: string;
	owner: number;
}

export type EnrichedStaticAbilityType = StaticAbilityType & {
	player: number;
	card?: CardInGame;
}

export type GameStaticAbility = StaticAbilityType & {
	selector: typeof SELECTOR_STATUS;
}

// ─── LayeredModificationEngine ───────────────────────────────────────────────

export class LayeredModificationEngine {
	// ── getByProperty overloads ──────────────────────────────────────────────

	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_ATTACK): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_BE_ATTACKED): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ATTACKS_PER_TURN): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGIZE): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGY_COUNT): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_POWER_COST, subProperty: string): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLER): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLING_PLAYER): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_USE_POWERS): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_PROTECTION): ProtectionType | undefined
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_MAGI_NAME): string
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_TYPE): CardType
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_TYPES): string[]
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_NAME): string
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_COST): CostType
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_STATUS, subProperty: typeof STATUS_BURROWED): boolean
	getByProperty(target: CardInGame | CardWithModification, property: PropertyType, subProperty: null | typeof STATUS_BURROWED | string = null): any {
		switch (property) {
			case PROPERTY_ID:
				return target.id;
			case PROPERTY_TYPE:
				return target.card.type;
			case PROPERTY_CREATURE_TYPES:
				return target.card.name.split(' ');
			case PROPERTY_CREATURE_NAME:
				return target.card.name;
			case PROPERTY_MAGI_NAME:
				return target.card.name;
			case PROPERTY_CONTROLLER:
				return target.data.controller;
			case PROPERTY_ENERGY_COUNT:
				return target.data.energy;
			case PROPERTY_ATTACKS_PER_TURN:
				return target.modifiedCard ?
					target.modifiedCard.data.attacksPerTurn :
					target.card.data.attacksPerTurn;
			case PROPERTY_COST:
				return target.modifiedCard ?
					target.modifiedCard.cost :
					target.card.cost;
			case PROPERTY_ENERGIZE:
				return target.modifiedCard ?
					target.modifiedCard.data.energize :
					target.card.data.energize;
			case PROPERTY_REGION:
				return target.card.region;
			case PROPERTY_CAN_ATTACK_MAGI_DIRECTLY:
				return target.modifiedCard ?
					target.modifiedCard.data.canAttackMagiDirectly :
					target.card.data.canAttackMagiDirectly;
			case PROPERTY_MAGI_STARTING_ENERGY:
				return target.modifiedCard ?
					target.modifiedCard.data.startingEnergy :
					target.card.data.startingEnergy;
			case PROPERTY_POWER_COST: {
				const powers = target.modifiedCard ? target.modifiedCard.data?.powers : target.card.data.powers;
				return (powers && powers.length) ? powers.find(({ name }) => name === subProperty)?.cost : 0;
			}
			case PROPERTY_STATUS_WAS_ATTACKED:
				return target.data.wasAttacked || false;
			case PROPERTY_CAN_BE_ATTACKED:
				return target.modifiedCard.data.canBeAttacked;
			case PROPERTY_STATUS_DEFEATED_CREATURE:
				return target.data.defeatedCreature || false;
			case PROPERTY_PROTECTION:
				return target.modifiedCard ?
					target.modifiedCard.data.protection :
					target.card.data.protection;
			case PROPERTY_STATUS: {
				switch (subProperty) {
					case STATUS_BURROWED:
						return Object.hasOwnProperty.call(target.data, 'burrowed') ?
							target.data.burrowed :
							target.card.data.burrowed;
					default:
						return false;
				}
			}
			// These properties can only be modified by static abilities / continuous effects
			case PROPERTY_ENERGY_LOSS_THRESHOLD:
				return target.modifiedCard ?
					target.modifiedCard.data.energyLossThreshold : 0;
			case PROPERTY_ABLE_TO_ATTACK: {
				const defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
				return target.modifiedCard ?
					target.modifiedCard.data.ableToAttack : defaultValue;
			}
			case PROPERTY_CONTROLLING_PLAYER:
				return target.modifiedCard?.data.controllingPlayer ?? 0;
			case PROPERTY_ABLE_TO_USE_POWERS:
				return target.modifiedCard?.data.ableToUsePowers ?? true;
		}
	}

	getByPropertyAny(target: CardInGame | CardWithModification, property: PropertyType, subProperty: null | typeof STATUS_BURROWED | string = null): any {
		return this.getByProperty(target as any, property as any, subProperty as any);
	}

	// ── layeredDataReducer ───────────────────────────────────────────────────

	layeredDataReducer(currentCard: CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): CardWithModification {
		if (!this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
			return currentCard;
		}

		switch (staticAbility.property) {
			case PROPERTY_COST: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_COST);
				const { operator, operandOne } = staticAbility.modifier;

				if (typeof initialValue !== 'number') {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							cost: initialValue,
						},
					};
				}
				const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
					performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
					performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

				return {
					...currentCard,
					modifiedCard: {
						...currentCard.modifiedCard,
						cost: resultValue,
					},
				};
			}
			case PROPERTY_ENERGIZE: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
					performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
					performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

				return {
					...currentCard,
					modifiedCard: {
						...currentCard.modifiedCard,
						data: {
							...currentCard.modifiedCard.data,
							energize: resultValue,
						},
					},
				};
			}
			case PROPERTY_ATTACKS_PER_TURN: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
					performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
					performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

				return {
					...currentCard,
					modifiedCard: {
						...currentCard.modifiedCard,
						data: {
							...currentCard.modifiedCard.data,
							attacksPerTurn: resultValue,
						},
					},
				};
			}
			case PROPERTY_ENERGY_LOSS_THRESHOLD: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
					performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
					performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

				return {
					...currentCard,
					modifiedCard: {
						...currentCard.modifiedCard,
						data: {
							...currentCard.modifiedCard.data,
							energyLossThreshold: resultValue,
						},
					},
				};
			}
			case PROPERTY_ABLE_TO_ATTACK: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

				if (typeof resultValue == 'boolean') {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								ableToAttack: resultValue,
							},
						},
					};
				} else {
					return { ...currentCard };
				}
			}
			case PROPERTY_CAN_BE_ATTACKED: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

				if (typeof resultValue == 'boolean') {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								canBeAttacked: resultValue,
							},
						},
					};
				} else {
					return {
						...currentCard,
					};
				}
			}
			case PROPERTY_CONTROLLER: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
				const { operator, operandOne } = staticAbility.modifier;
				const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

				if (typeof resultValue == 'number') {
					return {
						...currentCard,
						data: {
							...currentCard.data,
							controller: resultValue,
						},
					};
				} else {
					return { ...currentCard };
				}
			}
			case PROPERTY_STATUS: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty as StatusType);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

				if (typeof resultValue == 'boolean') {
					switch (staticAbility.subProperty) {
						case STATUS_BURROWED: {
							return {
								...currentCard,
								data: {
									...currentCard.data,
									burrowed: resultValue,
								},
							};
						}
						default: {
							return currentCard;
						}
					}
				} else {
					return { ...currentCard };
				}
			}
			case PROPERTY_PROTECTION: {
				const initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
				const { operator, operandOne } = staticAbility.modifier;

				const resultValue = (operator === CALCULATION_SET) ? operandOne as ProtectionType[] : initialValue;

				if (typeof resultValue == 'object' && 'from' in resultValue) {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								protection: resultValue,
							},
						},
					};
				} else {
					return {
						...currentCard,
					};
				}
			}
			case PROPERTY_CONTROLLING_PLAYER: {
				const { operator, operandOne } = staticAbility.modifier;
				const resultValue = (operator === CALCULATION_SET) ? operandOne : 0;

				if (typeof resultValue === 'number') {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								controllingPlayer: resultValue,
							},
						},
					};
				}
				return currentCard;
			}
			case PROPERTY_ABLE_TO_USE_POWERS: {
				const { operator, operandOne } = staticAbility.modifier;
				const resultValue = (operator === CALCULATION_SET) ? operandOne : true;

				if (typeof resultValue === 'boolean') {
					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								ableToUsePowers: resultValue,
							},
						},
					};
				}
				return currentCard;
			}
			case PROPERTY_POWER_COST: {
				if (currentCard.modifiedCard.data.powers) {
					const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
						const initialValue = this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
						const { operator, operandOne } = staticAbility.modifier;

						const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
							performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
							performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

						return {
							...power,
							cost: resultValue,
						};
					});

					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								powers: updatedPowers,
							},
						},
					};
				}

				return currentCard;
			}
			default: {
				return currentCard;
			}
		}
	}

	// ── Helper methods ───────────────────────────────────────────────────────

	/**
	 * Check if a card is affected by a static ability based on its selector
	 * Must be implemented by subclass
	 */
	protected isCardAffectedByStaticAbility(card: CardWithModification | any, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): boolean {
		throw new Error('isCardAffectedByStaticAbility must be implemented by subclass');
	}
}
