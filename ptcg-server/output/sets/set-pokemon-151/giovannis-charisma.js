"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiovannisCharisma = void 0;
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let card;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        card = selected[0];
        opponent.active.moveCardTo(card, opponent.hand);
        return state;
    });
}
class GiovannisCharisma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = '151';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Giovanni\'s Charisma';
        this.fullName = 'Giovanni\'s Charisma MEW';
        this.text = 'Your opponent reveals their hand, and you put a Basic Pokémon you find there onto your opponent\'s Bench. If you put a Pokémon onto their Bench in this way, switch in that Pokémon to the Active Spot.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GiovannisCharisma = GiovannisCharisma;
