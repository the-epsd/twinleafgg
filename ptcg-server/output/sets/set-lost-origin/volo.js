"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volo = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Volo extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Volo';
        this.fullName = 'Volo LOR';
        this.text = 'Discard 1 of your Benched Pokémon V and all attached cards.';
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
            let hasBenchedV = false;
            const blocked = [];
            player.bench.forEach((benchSpot, index) => {
                const pokemonCard = benchSpot.getPokemonCard();
                if (pokemonCard) {
                    if (pokemonCard.tags.includes(game_1.CardTag.POKEMON_V) ||
                        pokemonCard.tags.includes(game_1.CardTag.POKEMON_VSTAR) ||
                        pokemonCard.tags.includes(game_1.CardTag.POKEMON_VMAX)) {
                        hasBenchedV = true;
                    }
                    else {
                        blocked.push({ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: index });
                    }
                }
            });
            if (!hasBenchedV) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    cardList.moveCardsTo(pokemons, player.discard);
                    cardList.moveTo(player.discard);
                    cardList.clearEffects();
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.Volo = Volo;
