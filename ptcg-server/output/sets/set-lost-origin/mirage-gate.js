"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirageGate = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    if (player.lostzone.cards.length <= 6) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (player.lostzone.cards.length >= 7) {
        // Do not discard the card yet
        effect.preventDefault = true;
        yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2 }), transfers => {
            transfers = transfers || [];
            for (const transfer of transfers) {
                if (transfers.length > 1) {
                    if (transfers[0].card.name === transfers[1].card.name) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                    }
                }
                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                player.deck.moveCardTo(transfer.card, target);
                next();
            }
        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
        });
    }
}
class MirageGate extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.regulationMark = 'F';
        this.name = 'Mirage Gate';
        this.fullName = 'Mirage Gate LOR';
        this.text = 'You can use this card only if you have 7 or more cards in the Lost Zone.' +
            '' +
            'Search your deck for up to 2 basic Energy cards of different types and attach them to your Pokémon in any way you like. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MirageGate = MirageGate;
