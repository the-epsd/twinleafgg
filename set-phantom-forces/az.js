"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AZ = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AZ extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PHF';
        this.name = 'AZ';
        this.fullName = 'AZ PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'Put 1 of your Pokemon into your hand. (Discard all cards attached ' +
            'to that Pokemon.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Move to supporter pile
            state = prefabs_1.MOVE_CARDS(store, state, player.hand, player.supporter, {
                cards: [effect.trainerCard]
            });
            effect.preventDefault = true;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    const otherCards = cardList.cards.filter(card => !(card instanceof game_1.PokemonCard)); // Ensure only non-PokemonCard types
                    // Move other cards to discard
                    if (otherCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
                    }
                    // Move Pokémon to hand
                    if (pokemons.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
                    }
                    prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.AZ = AZ;
