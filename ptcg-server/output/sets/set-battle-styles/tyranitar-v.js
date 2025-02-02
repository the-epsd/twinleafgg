"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TyranitarV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TyranitarV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cragalanche',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Discard the top 2 cards of your opponent\'s deck.'
            },
            {
                name: 'Single Strike Crush',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 240,
                text: 'Discard the top 4 cards of your deck.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Tyranitar V';
        this.fullName = 'Tyranitar V BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 2 cards from opponent's deck 
            opponent.deck.moveTo(opponent.discard, 2);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Discard 4 cards from your deck 
            player.deck.moveTo(player.discard, 4);
            return state;
        }
        return state;
    }
}
exports.TyranitarV = TyranitarV;
