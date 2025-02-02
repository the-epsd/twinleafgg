"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesagoza = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Mesagoza extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '178';
        this.name = 'Mesagoza';
        this.fullName = 'Mesagoza SVI';
        this.text = 'Once during each player\'s turn, that player may flip a coin. If heads, that player searches their deck for a Pokémon, reveals it, and puts it into their hand. Then, that player shuffles their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        const opponent = state_utils_1.StateUtils.getOpponent(state, player);
        return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
            if (flipResult) {
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    if (cards.length > 0) {
                        player.deck.moveCardsTo(cards, player.hand);
                        return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                        });
                    }
                });
            }
        });
        return state;
    }
}
exports.Mesagoza = Mesagoza;
