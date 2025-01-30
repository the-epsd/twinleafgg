"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wimpod = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Wimpod extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Sneaky Snacking',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, discard a random card from your opponent\'s hand.'
            },
            {
                name: 'Ram',
                cost: [W, C, C],
                damage: 30,
                text: ''
            },
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Wimpod';
        this.fullName = 'Wimpod PAR';
    }
    reduceEffect(store, state, effect) {
        // Sneaky Snacking
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    return state;
                }
            });
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        return state;
    }
}
exports.Wimpod = Wimpod;
