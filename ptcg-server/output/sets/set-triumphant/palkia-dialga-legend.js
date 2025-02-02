"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalkiaDialgaLEGEND = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PalkiaDialgaLEGEND extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.cardType2 = game_1.CardType.METAL;
        this.hp = 160;
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.attacks = [
            {
                name: 'Sudden Delete',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Benched Pokémon. Put that Pokémon and all cards attached to it back into your opponent\'s hand.'
            },
            {
                name: 'Time Control',
                // cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
                cost: [],
                damage: 0,
                text: 'Discard all [M] Energy attached to Palkia & Dialga LEGEND. Add the top 2 cards of your opponent\'s deck to his or her Prize cards.'
            }
        ];
        this.set = 'LEGEND';
        this.name = 'Palkia & Dialga LEGEND';
        this.fullName = 'Palkia & Dialga LEGEND LEGEND';
        this.tags = [game_1.CardTag.LEGEND];
        this.setNumber = '1';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const allPrizeCards = new game_1.CardList();
            player.prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            player.deck.cards.slice(0, 2).forEach(card => {
                allPrizeCards.cards.push(card);
            });
            player.deck.cards.splice(0, 2);
            // Redistribute the prize cards
            const prizeCount = allPrizeCards.cards.length;
            player.prizes = [];
            for (let i = 0; i < prizeCount; i++) {
                const newPrizeList = new game_1.CardList();
                newPrizeList.cards.push(allPrizeCards.cards[i]);
                player.prizes.push(newPrizeList);
            }
        }
        return state;
    }
}
exports.PalkiaDialgaLEGEND = PalkiaDialgaLEGEND;
