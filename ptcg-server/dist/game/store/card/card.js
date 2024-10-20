import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
export class Card {
    constructor() {
        this.id = -1;
        this.regulationMark = '';
        this.tags = [];
        this.setNumber = '';
        this.cardImage = '';
        this.retreat = [];
        this.attacks = [];
        this.powers = [];
        this.cards = new CardList;
        this.marker = new Marker();
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
