"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirageGate = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
            const player = effect.player;
            if (player.lostzone.cards.length <= 6) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (player.lostzone.cards.length >= 7) {
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 2, differentTypes: true }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.deck.moveCardTo(transfer.card, target);
                        player.supporter.moveCardTo(this, player.discard);
                        return state;
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.MirageGate = MirageGate;
