"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPokemon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 1000;
        this.weakness = [{ type: card_types_1.CardType.COLORLESS }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Put Opponent Card In Prizes',
                cost: [],
                damage: 0,
                text: 'Add top 2 cards of opponent\'s deck to prizes',
                effect: (store, state, effect) => {
                }
            }
        ];
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Test';
        this.fullName = 'Test TEST';
        // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //   if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //     const player = effect.player;
        //     const opponent = StateUtils.getOpponent(state, player);
        //     const deckTop = new CardList();
        //     opponent.deck.moveTo(deckTop, 2);
        //     deckTop.moveTo(opponent.prizes);
        //     import { Pokemon } from '../models/pokemon';
        //     const newPrizeCard1 = new Pokemon();
        //     import { Card, PokemonCard } from '../models';
        //     const newPrizeCard2 = new PokemonCard();
        //     opponent.prizes.push(newPrizeCard1, newPrizeCard2);
    }
}
exports.TestPokemon = TestPokemon;
