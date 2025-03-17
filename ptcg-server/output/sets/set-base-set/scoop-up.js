"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoopUp = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ScoopUp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Scoop Up';
        this.fullName = 'Scoop Up BS';
        this.text = 'Choose 1 of your Pokémon in play and return its Basic Pokémon card to your hand. (Discard all cards attached to that card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    const basicPokemons = pokemons.filter(p => p.evolvesFrom === null); // Get only Basic Pokemon
                    const otherCards = cardList.cards.filter(card => !(card instanceof game_1.PokemonCard) || // Non-Pokemon cards
                        (card instanceof game_1.PokemonCard && card.evolvesFrom !== null) // Evolution cards
                    );
                    // Move other cards (including evolutions) to discard
                    if (otherCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
                    }
                    // Move only Basic Pokemon to hand
                    if (basicPokemons.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: basicPokemons });
                    }
                    prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.ScoopUp = ScoopUp;
