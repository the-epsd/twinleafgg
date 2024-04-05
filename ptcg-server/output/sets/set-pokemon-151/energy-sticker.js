"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergySticker = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class EnergySticker extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.superType = card_types_1.SuperType.TRAINER;
        this.regulationMark = 'G';
        this.text = 'Play this card as if it were a 60-HP Basic [C] Pokémon. This card can\'t be affected by any Special Conditions and can\'t retreat.';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Energy Sticker';
        this.fullName = 'Energy Sticker MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const player = effect.player;
                    const hasBench = player.bench.some(b => b.cards.length > 0);
                    if (!hasBench) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    const hasEnergyInDiscard = player.discard.cards.some(c => {
                        return c instanceof game_1.EnergyCard
                            && c.energyType === card_types_1.EnergyType.BASIC
                            && c.provides.includes(card_types_1.CardType.LIGHTNING);
                    });
                    if (!hasEnergyInDiscard) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Basic Lightning Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                        transfers = transfers || [];
                        // cancelled by user
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                    return state;
                }
                return state;
            });
        }
        return state;
    }
}
exports.EnergySticker = EnergySticker;
