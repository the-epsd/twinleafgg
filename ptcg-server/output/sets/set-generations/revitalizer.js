"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revitalizer = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Revitalizer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GEN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Revitalizer';
        this.fullName = 'Revitalizer GEN';
        this.text = 'Put 2 [G] Pokémon from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let pokemonInDiscard = 0;
            const blocked = [];
            player.discard.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.cardType === card_types_1.CardType.GRASS) {
                    pokemonInDiscard += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Player does not have correct cards in discard
            if (pokemonInDiscard === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let cards = [];
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: Math.min(pokemonInDiscard, 2), max: 2, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                player.discard.moveCardsTo(cards, player.hand);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Revitalizer = Revitalizer;
