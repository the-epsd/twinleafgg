export class Card {
    constructor() {
        this.id = -1;
        this.regulationMark = '';
        this.tags = [];
        this.setNumber = '';
        this.set2 = '';
        this.retreat = [];
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
