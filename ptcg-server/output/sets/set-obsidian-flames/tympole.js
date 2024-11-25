"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tympole = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tympole extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Screw Tail',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Tympole';
        this.fullName = 'Tympole OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Tympole = Tympole;
