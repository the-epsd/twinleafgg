"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrBrineysCompassion = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MrBrineysCompassion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Mr. Briney\'s Compassion';
        this.fullName = 'Mr. Briney\'s Compassion DR';
        this.text = 'Choose 1 of your Pokémon in play (excluding Pokémon-ex). Return that Pokémon and all cards attached to it to your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            let hasNonexPokemon = false;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.cardTag.includes(card_types_1.CardTag.POKEMON_ex)) {
                    hasNonexPokemon = true;
                    return;
                }
                if (card.cardTag.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked.push(target);
                }
            });
            if (!hasNonexPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    cardList.moveCardsTo(pokemons, player.hand);
                    cardList.moveTo(player.hand);
                    cardList.clearEffects();
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.MrBrineysCompassion = MrBrineysCompassion;
