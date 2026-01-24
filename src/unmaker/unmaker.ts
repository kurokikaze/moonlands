import CardInGame from '../classes/CardInGame';
import { ACTION_EFFECT, EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, State } from '../index'
import { AnyEffectType } from '../types'
import { UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE, UnAction } from './types';
export class Unmaker {
    public unActions: UnAction[] = [];
    constructor(private state: State) {
        this.state.setOnAction(action => {
            const unAction = this.generateUnAction(action)
            if (unAction) {
                this.unActions.push(unAction)
            }
        })
    }

    public generateUnAction(action: AnyEffectType): UnAction | undefined {
        switch (action.type) {
            case ACTION_EFFECT: {
                switch (action.effectType) {
                    case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE:
                        const creatures: CardInGame[]|CardInGame = this.state.getMetaValue(action.target, action.generatedBy)
                        if (creatures instanceof CardInGame) {
                            return {
                                type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                                creatures: [{
                                    id: creatures.id,
                                    energy: creatures.data.energy,
                                }]
                            }

                        }
                        return {
                            type: UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
                            creatures: creatures.map(creature => ({ id: creature.id, energy: creature.data.energy }))
                        }
                }
            }
        }
    }
}