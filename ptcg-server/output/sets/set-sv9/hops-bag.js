"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HopsBag = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HopsBag extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.regulationMark = 'I';
        this.name = 'Hop\'s Bag';
        this.fullName = 'Hop\'s Bag SV9';
        this.text = 'Search your deck for up to 2 Basic Hop\'s Pokémon and put them onto your Bench. Then, shuffle your deck.';
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
            const blocked = player.deck.cards
                .filter(c => !c.tags.includes(card_types_1.CardTag.HOPS))
                .map(c => player.deck.cards.indexOf(c));
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const maxCards = Math.min(2, openSlots.length);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxCards, allowCancel: false, blocked: blocked }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.HopsBag = HopsBag;
