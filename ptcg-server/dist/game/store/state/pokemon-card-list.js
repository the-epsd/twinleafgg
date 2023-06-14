import { CardList } from './card-list';
import { Marker } from './card-marker';
import { SpecialCondition, Stage, SuperType } from '../card/card-types';
export class PokemonCardList extends CardList {
    constructor() {
        super(...arguments);
        this.damage = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.marker = new Marker();
        this.pokemonPlayedTurn = 0;
    }
    getPokemons() {
        const result = [];
        for (const card of this.cards) {
            if (card.superType === SuperType.POKEMON && card !== this.tool) {
                result.push(card);
            }
        }
        return result;
    }
    getPokemonCard() {
        const pokemons = this.getPokemons();
        if (pokemons.length > 0) {
            return pokemons[pokemons.length - 1];
        }
    }
    isBasic() {
        const pokemons = this.getPokemons();
        if (pokemons.length !== 1) {
            return false;
        }
        return pokemons[0].stage === Stage.BASIC;
    }
    clearEffects() {
        this.marker.markers = [];
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        if (this.cards.length === 0) {
            this.damage = 0;
        }
        if (this.tool && !this.cards.includes(this.tool)) {
            this.tool = undefined;
        }
    }
    removeSpecialCondition(sp) {
        if (!this.specialConditions.includes(sp)) {
            return;
        }
        this.specialConditions = this.specialConditions
            .filter(s => s !== sp);
    }
    addSpecialCondition(sp) {
        if (sp === SpecialCondition.POISONED) {
            this.poisonDamage = 10;
        }
        if (sp === SpecialCondition.BURNED) {
            this.burnDamage = 20;
        }
        if (this.specialConditions.includes(sp)) {
            return;
        }
        if (sp === SpecialCondition.POISONED || sp === SpecialCondition.BURNED) {
            this.specialConditions.push(sp);
            return;
        }
        this.specialConditions = this.specialConditions.filter(s => [
            SpecialCondition.PARALYZED,
            SpecialCondition.CONFUSED,
            SpecialCondition.ASLEEP
        ].includes(s) === false);
        this.specialConditions.push(sp);
    }
}
