"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persian = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Persian extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Meowth';
        this.attacks = [{
                name: 'Make \'Em Pay',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ' If your opponent has 4 or more cards in their hand, they reveal their hand.'
                    + 'Discard cards you find there until your opponent has exactly 4 cards in their hand. '
            },
            {
                name: 'Sharp Claws',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ' Flip a coin. If heads, this attack does 60 more damage.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Persian';
        this.fullName = 'Persian TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            if (opponent.hand.cards.length >= 4) {
                const minMaxDiscardAmt = opponent.hand.cards.length - 4;
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: minMaxDiscardAmt, max: minMaxDiscardAmt, allowCancel: false }), selected => {
                    cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 60;
                }
            });
        }
        return state;
    }
}
exports.Persian = Persian;
