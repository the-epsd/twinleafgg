import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, Format } from './card-types';
export class PokemonCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.POKEMON;
        this.cardType = CardType.NONE;
        this.cardTag = [];
        this.pokemonType = PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.stage = Stage.BASIC;
        this.retreat = [];
        this.hp = 0;
        this.weakness = [];
        this.resistance = [];
        this.powers = [];
        this.attacks = [];
        this.format = Format.NONE;
        this.movedToActiveThisTurn = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof AttackEffect) {
            for (let i = 0; i < this.attacks.length; i++) {
                const attackEffect = this.attacks[i].effect;
                console.log('store:', store);
                console.log('state:', state);
                console.log('effect:', effect);
                if (effect.attack.name === this.attacks[i].name && attackEffect !== undefined) {
                    console.log(attackEffect);
                    console.log('we made it to handling!');
                    attackEffect(store, state, effect);
                }
            }
        }
        else if (effect instanceof PowerEffect) {
            for (let i = 0; i < this.powers.length; i++) {
                if (effect.power.name === this.powers[i].name && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
            }
        }
        return state;
    }
}
