"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPokemon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.COLORLESS }];
        this.retreat = [];
        this.powers = [{
                name: 'Extremely Cursed Blast',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, both players Active Pokemon are Knocked Out.'
            }];
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
    }
    reduceEffect(store, state, effect) {
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
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 999;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === opponentActive) {
                    cardList.damage += 999;
                }
            });
        }
        return state;
    }
}
exports.TestPokemon = TestPokemon;
