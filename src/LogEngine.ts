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
		const entries = this.shouldCreateLog(action);
		const log = this.context.getLog();
		for (const entry of entries) {
			log.push(entry);
		}
	}

	public shouldCreateLog(action: AnyEffectType): LogEntryType[] {
		const { getMetaValue, getPromptType } = this.context;
		const entries: LogEntryType[] = [];

		try {
			switch (action.type) {
				// Log entries: 1
				case ACTION_PLAY: {
					if ('payload' in action) {
						entries.push({
							type: LOG_ENTRY_PLAY,
							card: action.payload.card.card.name,
							player: action.player,
						});
					} else {
						const metaValue = getMetaValue(action.card, action.generatedBy);
						const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;

						entries.push({
							type: LOG_ENTRY_PLAY,
							card: metaCard.card.name,
							player: Number(action.player),
						});
					}
					break;
				}
				// Log entries: 1
				case ACTION_POWER: {
					entries.push({
						type: LOG_ENTRY_POWER_ACTIVATION,
						card: action.source.card.name,
						name: action.power.name,
						player: action.player,
					});
					break;
				}
				case ACTION_EFFECT: {
					switch (action.effectType) {
						// Log entries: 1
						case EFFECT_TYPE_DRAW: {
							entries.push({
								type: LOG_ENTRY_DRAW,
								player: getMetaValue(action.player, action.generatedBy),
							});
							break;
						}
						// Log entries: 0 or 1
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									entries.push({
										type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									});
								}
							} else {
								entries.push({
									type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								});
							}
							break;
						}
						// Log entries: 0 or target.length (one per creature)
						case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								for (const tgt of target) {
									entries.push({
										type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
										card: tgt.card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									});
								}
							} else {
								entries.push({
									type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								});
							}
							break;
						}
						// Log entries: 0 or 1
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									entries.push({
										type: LOG_ENTRY_MAGI_ENERGY_LOSS,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									});
								}
							} else {
								entries.push({
									type: LOG_ENTRY_MAGI_ENERGY_LOSS,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								});
							}
							break;
						}
						// Log entries: 1
						case EFFECT_TYPE_DIE_ROLLED: {
							entries.push({
								type: LOG_ENTRY_DIE_ROLLED,
								result: action.result,
								player: action.player,
							});
							break;
						}
						// Log entries: 0 or 1
						case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									entries.push({
										type: LOG_ENTRY_MAGI_ENERGY_GAIN,
										card: target[0].card.name,
										amount: getMetaValue(action.amount, action.generatedBy),
									});
								}
							} else {
								entries.push({
									type: LOG_ENTRY_MAGI_ENERGY_GAIN,
									card: target.card.name,
									amount: getMetaValue(action.amount, action.generatedBy),
								});
							}
							break;
						}
						// Log entries: 1
						case EFFECT_TYPE_FIND_STARTING_CARDS: {
							entries.push({
								type: LOG_ENTRY_CHOOSES_STARTING_CARDS,
								player: action.player || 0,
							});
							break;
						}
						// Log entries: 0 or 1 (0 when target is an array)
						case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (!Array.isArray(target) && target?.card?.name) {
								entries.push({
									type: LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								});
							}
							break;
						}
						// Log entries: 0 or 1
						case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
							const target = getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target) && target.length && target[0]?.card?.name) {
								if (target.length) {
									entries.push({
										type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
										card: target[0].card.name,
										player: action.player,
									});
								}
							} else {
								entries.push({
									type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								});
							}
							break;
						}
						// Log entries: 1
						case EFFECT_TYPE_MAGI_IS_DEFEATED: {
							entries.push({
								type: LOG_ENTRY_MAGI_DEFEATED,
								card: getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player,
							});
							break;
						}
						// Log entries: 1
						case EFFECT_TYPE_CREATURE_ATTACKS: {
							entries.push({
								type: LOG_ENTRY_ATTACK,
								source: getMetaValue(action.source, action.generatedBy).card.name,
								target: getMetaValue(action.target, action.generatedBy).card.name,
								packHuntAttack: Boolean(action.packHuntAttack),
							});
							break;
						}
						// Log entries: 1
						case EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
							entries.push({
								type: LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
								card: getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player || 1,
							});
							break;
						}
						// Log entries: 0
						case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
							break;
						}
					}
					break;
				}
				// Log entries: 0 or 1 (1 for single-target and number prompts only)
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
						entries.push({
							type: LOG_ENTRY_TARGETING,
							card: action.target?.card?.name || 'unknown card',
							player: action.player,
						});
					}
					if (getPromptType() === PROMPT_TYPE_NUMBER && 'number' in action) {
						entries.push({
							type: LOG_ENTRY_NUMBER_CHOICE,
							number: (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10),
							player: action.player,
						});
					}
					break;
				}
			}
		} catch (e) {
			console.error('Log entry creation failed');
			console.dir(action);
		}

		return entries;
	}
}
