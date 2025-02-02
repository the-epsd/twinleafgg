"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RescueCarrier = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const blocked = [];
    player.discard.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && card.hp > 90) {
            blocked.push(index);
        }
    });
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 2, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
}
class RescueCarrier extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Rescue Carrier';
        this.fullName = 'Rescue Carrier EVS';
        this.text = 'Put up to 2 Pokémon, each with 90 HP or less, from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RescueCarrier = RescueCarrier;
