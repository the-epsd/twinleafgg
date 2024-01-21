"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryBox = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class DeliveryBox extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'H';
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Delivery Box';
        this.fullName = 'Delivery Box SV5';
        this.text = 'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.' +
            '' +
            'Your turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            if (cards.length > 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                    player.deck.moveCardsTo(cards, player.hand);
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                        store.reduceEffect(state, endTurnEffect);
                        return state;
                    });
                });
            }
            return state;
        }
        return state;
    }
}
exports.DeliveryBox = DeliveryBox;
