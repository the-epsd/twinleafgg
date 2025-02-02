"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoopUpCyclone = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class ScoopUpCyclone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.name = 'Scoop Up Cyclone';
        this.fullName = 'Scoop Up Cyclone TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.text = 'Put 1 of your Pokemon and all cards attached to it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    cardList.clearEffects();
                    cardList.damage = 0;
                    cardList.moveCardsTo(pokemons, player.hand);
                    cardList.moveTo(player.hand);
                    cardList.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.ScoopUpCyclone = ScoopUpCyclone;
