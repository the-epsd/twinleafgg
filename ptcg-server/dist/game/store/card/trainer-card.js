import { PowerEffect } from '../effects/game-effects';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export class TrainerCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.TRAINER;
        this.trainerType = TrainerType.ITEM;
        this.format = Format.NONE;
        this.text = '';
        this.powers = [];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof PowerEffect) {
            for (let i = 0; i < this.powers.length; i++) {
                if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
