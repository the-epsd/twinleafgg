"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nuzleaf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Nuzleaf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Seedot';
        this.attacks = [{
                name: 'Pound',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            },
            {
                name: 'Clear the Room',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand. Choose a Supporter card you find there. Your opponent shuffles that card into their deck. '
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Nuzleaf';
        this.fullName = 'Nuzleaf CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            if (opponent.hand.cards.length > 0) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, opponent.hand, { trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false }), selected => {
                    cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.deck);
                    //Shuffle deck afterward.
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                        opponent.deck.applyOrder(order);
                    });
                });
            }
        }
        return state;
    }
}
exports.Nuzleaf = Nuzleaf;
