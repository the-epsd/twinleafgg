import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { Marker } from '../state/card-marker';
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
        this.marker = new Marker();
        this.movedToActiveThisTurn = false;
        this.tools = [];
        this.archetype = [];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof AttackEffect) {
            for (let i = 0; i < this.attacks.length; i++) {
                const attackEffect = this.attacks[i].effect;
                // console.log(this.attacks[i].name);
                if (effect.attack === this.attacks[i] && attackEffect !== undefined && typeof attackEffect === 'function') {
                    // console.log(attackEffect);
                    // console.log('we made it to handling!');
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
            for (let i = 0; i < this.tools.length; i++) {
                if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
                    return effect.power.effect(store, state, effect);
                }
            }
        }
        return state;
    }
}
