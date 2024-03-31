import { match } from 'ts-pattern';
import { State } from ".";
import { ChangeType } from "./types/change"
import { CHANGE_TYPE_RESHUFFLE_DISCARD, CHANGE_TYPE_START_STEP, CHANGE_TYPE_START_TURN, EXPIRATION_ANY_TURNS, EXPIRATION_NEVER, EXPIRATION_OPPONENT_TURNS, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD } from './const';
import CardInGame from './classes/CardInGame';
import { ContinuousEffectType } from './types';

const updateContinuousEffects = (player: number) => (effect: ContinuousEffectType) => {
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

export const applyChange = (changeAction: ChangeType, state: State) => {
    match(changeAction)
        .with({ changeType: CHANGE_TYPE_RESHUFFLE_DISCARD }, (action) => {
            const player = state.getMetaValue(action.player, action.generatedBy);
            const deck = state.getZone(ZONE_TYPE_DECK, player);
            const discard = state.getZone(ZONE_TYPE_DISCARD, player);

            const newCards = discard.cards.map(card => new CardInGame(card.card, card.owner));
            deck.add(newCards);
            deck.shuffle();
            discard.empty();
        })
        .with({ changeType: CHANGE_TYPE_START_TURN }, (action) => {
            if (state.turn === null) {
                state.turn = 0;
            } else {
                state.turn += 1;
            }

            state.state.continuousEffects = state.state.continuousEffects.map(updateContinuousEffects(action.player)).filter(Boolean) as ContinuousEffectType[];
        })
        .with({ changeType: CHANGE_TYPE_START_STEP }, (action) => {
            state.state.step = action.step;
        })
}