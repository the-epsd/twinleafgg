"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegatonBlower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MegatonBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.regulationMark = 'H';
        this.name = 'Megaton Blower';
        this.fullName = 'Megaton Blower SV7a';
        this.text = 'You can use this card only if you go second, and only on your first turn.' +
            '' +
            'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
            cardList.moveTo(stadiumOwner.discard);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Function to discard special energy and tools from a PokemonCardList
            const discardSpecialEnergyAndTools = (pokemonCardList) => {
                const cardsToDiscard = pokemonCardList.cards.filter(card => (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.SPECIAL) ||
                    (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL));
                pokemonCardList.moveCardsTo(cardsToDiscard, opponent.discard);
            };
            // Discard from active Pokémon
            discardSpecialEnergyAndTools(opponent.active);
            // Discard from bench Pokémon
            opponent.bench.forEach(benchPokemon => {
                discardSpecialEnergyAndTools(benchPokemon);
            });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.MegatonBlower = MegatonBlower;
