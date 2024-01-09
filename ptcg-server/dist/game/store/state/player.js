import { CardList } from './card-list';
import { SlotType } from '../actions/play-card-action';
import { PokemonCardList } from './pokemon-card-list';
import { Marker } from './card-marker';
export class Player {
    constructor() {
        this.id = 0;
        this.name = '';
        this.deck = new CardList();
        this.hand = new CardList();
        this.discard = new CardList();
        this.lostzone = new CardList();
        this.stadium = new CardList();
        this.supporter = new CardList();
        this.active = new PokemonCardList();
        this.bench = [];
        this.prizes = [];
        this.retreatedTurn = 0;
        this.energyPlayedTurn = 0;
        this.stadiumPlayedTurn = 0;
        this.stadiumUsedTurn = 0;
        this.marker = new Marker();
        this.attackMarker = new Marker();
        this.abilityMarker = new Marker();
        this.avatarName = '';
    }
    prompt(state, arg1) {
        throw new Error('Method not implemented.');
    }
    getPrizeLeft() {
        return this.prizes.reduce((left, p) => left + p.cards.length, 0);
    }
    forEachPokemon(player, handler) {
        let pokemonCard = this.active.getPokemonCard();
        let target;
        if (pokemonCard !== undefined) {
            target = { player, slot: SlotType.ACTIVE, index: 0 };
            handler(this.active, pokemonCard, target);
        }
        for (let i = 0; i < this.bench.length; i++) {
            pokemonCard = this.bench[i].getPokemonCard();
            if (pokemonCard !== undefined) {
                target = { player, slot: SlotType.BENCH, index: i };
                handler(this.bench[i], pokemonCard, target);
            }
        }
    }
    switchPokemon(target) {
        const benchIndex = this.bench.indexOf(target);
        if (benchIndex !== -1) {
            const temp = this.active;
            const tempCard = temp.getPokemonCard();
            this.active.clearEffects();
            this.active = this.bench[benchIndex];
            this.bench[benchIndex] = temp;
            tempCard.movedToActiveThisTurn = true;
        }
    }
}
