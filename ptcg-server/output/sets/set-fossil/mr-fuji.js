"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrFuji = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class MrFuji extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Mr. Fuji';
        this.fullName = 'Mr. Fuji FO';
        this.text = 'Choose a Pokémon on your Bench. Shuffle it and any cards attached to it into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH]), selected => {
                const target = selected[0];
                target.moveTo(player.deck);
                target.clearEffects();
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.MrFuji = MrFuji;
