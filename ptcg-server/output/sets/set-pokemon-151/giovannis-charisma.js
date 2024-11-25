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
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let card;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        card = selected[0];
        opponent.active.moveCardTo(card, opponent.hand);
        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 1 }), transfers => {
            transfers = transfers || [];
            if (transfers.length === 0) {
                return;
            }
            for (const transfer of transfers) {
                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                player.hand.moveCardTo(transfer.card, target);
            }
        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    });
}
class GiovannisCharisma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Giovanni\'s Charisma';
        this.fullName = 'Giovanni\'s Charisma MEW';
        this.text = 'Put an Energy attached to your opponent\'s Active Pokémon into their hand. If you do, attach an Energy card from your hand to your Active Pokémon.';
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
