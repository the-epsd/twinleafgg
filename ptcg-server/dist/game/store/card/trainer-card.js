import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export class TrainerCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.TRAINER;
        this.trainerType = TrainerType.ITEM;
        this.format = Format.NONE;
        this.text = '';
        this.attacks = [];
        this.powers = [];
        this.firstTurn = false;
        this.stadiumDirection = 'up';
        //Used on items and supporters that are "put into play", specifically for reference on Chaos Gym
        this.putIntoPlay = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof AttackEffect) {
            for (let i = 0; i < this.attacks.length; i++) {
                const attackEffect = this.attacks[i].effect;
                if (effect.attack === this.attacks[i] && attackEffect !== undefined && typeof attackEffect === 'function') {
                    attackEffect(store, state, effect);
                }
            }
        }
        else if (effect instanceof PowerEffect) {
            for (let i = 0; i < this.powers.length; i++) {
                if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
            }
        }
        return state;
    }
}
