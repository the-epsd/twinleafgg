"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revive = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Revive extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS'; // Replace with the appropriate set abbreviation
        this.name = 'Revive';
        this.fullName = 'Revive BS'; // Replace with the appropriate set abbreviation
        this.cardImage = 'assets/cardback.png'; // Replace with the appropriate card image path
        this.setNumber = '89'; // Replace with the appropriate set number
        this.text = 'Put 1 Basic Pokémon card from your discard pile onto your Bench. Put damage counters on that Pokémon equal to half its HP (rounded down to the nearest 10). (You can\'t play Revive if your Bench is full.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if player's bench is full
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            let cards = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH, player.discard, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const card = cards[0];
                    const slot = openSlots[0];
                    const pokemonCard = card;
                    const damage = Math.floor(pokemonCard.hp / 2 / 10) * 10;
                    player.discard.moveCardTo(card, slot);
                    slot.damage = damage;
                    slot.pokemonPlayedTurn = state.turn;
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Revive = Revive;
