"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ryme = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Ryme extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '194';
        this.regulationMark = 'G';
        this.name = 'Ryme';
        this.fullName = 'Ryme OBF';
        this.text = 'Draw 3 cards. Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Draw 3 cards
            player.deck.moveTo(player.hand, 3);
            // Get opponent
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.bench.some(c => c.cards.length > 0)) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                const cardList = results[0];
                if (cardList.stage == card_types_1.Stage.BASIC) {
                    try {
                        const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
                        store.reduceEffect(state, supporterEffect);
                    }
                    catch (_a) {
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                }
                if (results.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(results[0]);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Ryme = Ryme;
