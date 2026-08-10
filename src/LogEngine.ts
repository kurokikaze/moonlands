import {
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_EFFECT,
	ACTION_RESOLVE_PROMPT,

	LOG_ENTRY_PLAY,
	LOG_ENTRY_DRAW,
	LOG_ENTRY_CHOOSES_STARTING_CARDS,
	LOG_ENTRY_POWER_ACTIVATION,
	LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
	LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
	LOG_ENTRY_TARGETING,
	LOG_ENTRY_NUMBER_CHOICE,
	LOG_ENTRY_ATTACK,
	LOG_ENTRY_CREATURE_ENERGY_LOSS,
	LOG_ENTRY_MAGI_ENERGY_LOSS,
	LOG_ENTRY_CREATURE_ENERGY_GAIN,
	LOG_ENTRY_MAGI_ENERGY_GAIN,
	LOG_ENTRY_MAGI_DEFEATED,
	LOG_ENTRY_DIE_ROLLED,
	LOG_ENTRY_CARD_DISCARDED_FROM_HAND,

	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_DIE_ROLLED,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_FIND_STARTING_CARDS,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,

	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_NUMBER,
} from './const';

import { AnyEffectType, LogEntryType, PromptTypeType } from './types';

export interface LogEngineContext {
	getMetaValue(value: any, spellId: string | undefined): any;
	getLog(): LogEntryType[];
	getPromptType(): PromptTypeType | null;
}

export class LogEngine {
	private context: LogEngineContext;

	constructor(context: LogEngineContext) {
		this.context = context;
	}

	addActionToLog(action: AnyEffectType) {
		const { getMetaValue, getLog, getPromptType } = this.context;
		var newLogEntry: LogEntryType | boolean = false;

		try {
			switch (action.type) {
				case ACTION_PLAY: {
					if ('payload' in action) {
						newLogEntry = {
							type: LOG_ENTRY_PLAY,
							card: action.payload.card.card.name,
							player: action.player,
						};
					} else {
						const metaValue = getMetaValue(action.card, action.generatedBy);
						const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;

						newLogEntry = {
							type: LOG_ENTRY_PLAY,
							card: metaCard.card.name,
							player: Number(action.player),
						};
					}
					break;
				}
				case ACTION_POWER: {
					newLogEntry = {
						type: LOG_ENTRY_POWER_ACTIVATION,
						card: action.source.card.name,
						name: action.power.name,
						player: action.player,
					};
					break;
				}
				case ACTION_EFFECT: {
					switch (action.effectType) {
						case EFFECT_TYPE_DRAW: {
							newLogEntry = {
								type: LOG_ENTRY_DRAW,
								player: getMetaValue(action.player, action.generatedBy),
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
                                    for (let i = 0; i < target.length - 1; i++) {
                                        const tgt = target[i]
                                        getLog().push({
                                            type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                            card: tgt.card.name,
                                            amount: getMetaValue(action.amount, action.generatedBy),
                                        });
                                    }
                                    newLogEntry = {
                                            type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
                                            card: target[target.length - 1].card.name,
                                            amount: getMetaValue(action.amount, action.generatedBy),
                                        }
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_MAGI_ENERGY_LOSS,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_MAGI_ENERGY_LOSS,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_DIE_ROLLED: {
							newLogEntry = {
								type: LOG_ENTRY_DIE_ROLLED,
								result: action.result,
								player: action.player,
							}
							break;
						}
						case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_MAGI_ENERGY_GAIN,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_MAGI_ENERGY_GAIN,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_FIND_STARTING_CARDS: {
							newLogEntry = {
								type: LOG_ENTRY_CHOOSES_STARTING_CARDS,
								player: action.player || 0,
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (!Array.isArray(target)) {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								};
							}
							break;
						}
						case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
										card: target[0].card.name,
										player: action.player,
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								};
							}
							break;
						}
						case EFFECT_TYPE_MAGI_IS_DEFEATED: {
							newLogEntry = {
								type: LOG_ENTRY_MAGI_DEFEATED,
								card: getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player,
							};
							break;
						}
						case EFFECT_TYPE_CREATURE_ATTACKS: {
							newLogEntry = {
								type: LOG_ENTRY_ATTACK,
								source: getMetaValue(action.source, action.generatedBy).card.name,
								target: getMetaValue(action.target, action.generatedBy).card.name,
								packHuntAttack: Boolean(action.packHuntAttack),
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
							newLogEntry = {
								type: LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
								card: getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player || 1,
							}
							break;
						}
						case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
							break;
						}
					}
					break;
				}
				case ACTION_RESOLVE_PROMPT: {
					if (
						(
							getPromptType() === PROMPT_TYPE_SINGLE_CREATURE ||
							getPromptType() === PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
							getPromptType() === PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
							getPromptType() === PROMPT_TYPE_OWN_SINGLE_CREATURE ||
							getPromptType() === PROMPT_TYPE_SINGLE_MAGI
						) && 'target' in action
					) {
						newLogEntry = {
							type: LOG_ENTRY_TARGETING,
							card: action.target?.card?.name || 'unknown card',
							player: action.player,
						};
					}
					if (getPromptType() === PROMPT_TYPE_NUMBER && 'number' in action) {
						newLogEntry = {
							type: LOG_ENTRY_NUMBER_CHOICE,
							number: (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10),
							player: action.player,
						};
					}
					break;
				}
			}
		} catch (e) {
			console.error('Log entry creation failed');
			console.dir(action);
		}

		if (newLogEntry) {
			getLog().push(newLogEntry as LogEntryType);
		}
	}
}
