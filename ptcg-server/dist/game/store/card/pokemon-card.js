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
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
    }
}
