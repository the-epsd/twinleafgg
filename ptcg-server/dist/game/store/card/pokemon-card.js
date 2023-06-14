import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType } from './card-types';
export class PokemonCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.POKEMON;
        this.cardType = CardType.NONE;
        this.pokemonType = PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.stage = Stage.BASIC;
        this.retreat = [];
        this.hp = 0;
        this.weakness = [];
        this.resistance = [];
        this.powers = [];
        this.attacks = [];
    }
}
