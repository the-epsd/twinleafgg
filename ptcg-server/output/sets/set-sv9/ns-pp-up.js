"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsPPUp = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class NsPPUp extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.tags = [game_1.CardTag.NS];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.name = 'N\'s PP Up';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.fullName = 'N\'s PP Up SV9';
        this.text = 'Attach 1 Basic Energy from your discard pile to 1 of your Benched N\'s Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let hasNsPokemonInPlay = false;
            player.bench.forEach(list => {
                if (list && list.cards.some(card => card.tags.includes(game_1.CardTag.NS))) {
                    hasNsPokemonInPlay = true;
                }
            });
            if (!hasNsPokemonInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.NS)) {
                    blocked2.push(target);
                }
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.NsPPUp = NsPPUp;
