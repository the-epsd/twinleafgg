import { Marker } from '../state/card-marker';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, Format } from './card-types';
export class PokemonCard extends Card {
    constructor() {
        super(...arguments);
        this.superType = SuperType.POKEMON;
        this.cardType = CardType.COLORLESS;
        this.cardTag = [];
        this.pokemonType = PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.evolvesTo = [];
        this.evolvesToStage = [];
        this.evolvesFromBase = [];
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
        this.maxTools = 1;
        this.archetype = [];
        this.damageTakenLastTurn = 0;
    }
    wasMovedToActiveThisTurn(player) {
        return player.movedToActiveThisTurn.includes(this.id);
    }
}
