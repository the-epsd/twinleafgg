"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CherishCarrier = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CherishCarrier extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'svLN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.regulationMark = 'H';
        this.name = 'Cherish Carrier';
        this.fullName = 'Cherish Carrier svLN';
        this.text = 'Search your deck for any number of Basic Pokémon and put them onto your Bench. Then shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const maxCards = Math.min(openSlots.length, openSlots.length);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxCards, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                });
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.CherishCarrier = CherishCarrier;
