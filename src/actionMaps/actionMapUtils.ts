import { EXPIRATION_ANY_TURNS, EXPIRATION_OPPONENT_TURNS, EXPIRATION_NEVER } from "../const";
import { ContinuousEffectType } from "../types";

export const updateContinuousEffects = (player: number) => (effect: ContinuousEffectType) => {
	switch (effect.expiration.type) {
		case EXPIRATION_ANY_TURNS: {
			const turnCount = effect.expiration.turns;
			if (turnCount > 1) {
				return {
					...effect,
					expiration: {
						type: effect.expiration.type,
						turns: turnCount - 1,
					}
				};
			} else {
				return null;
			}
		}
		case EXPIRATION_OPPONENT_TURNS: {
			const turnCount = effect.expiration.turns;
			if (player !== effect.player) {
				if (turnCount > 0) {
					return {
						...effect,
						expiration: {
							type: effect.expiration.type,
							turns: turnCount - 1,
						}
					};
				} else {
					return null;
				}
			} else {
				return effect;
			}
		}
		case EXPIRATION_NEVER: {
			return effect;
		}
	}
};

export const oneOrSeveral = <T>(targets: T | T[], callback: (t: T) => void): void => {
	if (targets instanceof Array) {
		if (targets.length > 0) {
			targets.forEach(target => callback(target));
		}
	} else {
		callback(targets);
	}
};