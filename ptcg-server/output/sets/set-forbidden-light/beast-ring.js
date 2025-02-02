"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeastRing = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BeastRing extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Beast Ring';
        this.fullName = 'Beast Ring FLI';
        this.text = 'You can play this card only if your opponent has exactly 3 or 4 Prize cards remaining.' +
            '' +
            'Search your deck for up to 2 basic Energy cards and attach them to 1 of your Ultra Beasts. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() !== 3 && opponent.getPrizeLeft() !== 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            let ultraBeastInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                    ultraBeastInPlay = true;
                }
            });
            if (!ultraBeastInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) {
                    blocked2.push(target);
                }
            });
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.BeastRing = BeastRing;
