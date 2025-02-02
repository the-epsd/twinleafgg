"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiancasDevotion = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BiancasDevotion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.regulationMark = 'H';
        this.name = 'Bianca\'s Devotion';
        this.fullName = 'Bianca\'s Devotion TEF';
        this.text = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new __1.GameError(__1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.hp <= 30) {
                    return state;
                }
                const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                state = store.reduceEffect(state, healEffect);
                const cards = cardList.cards.filter(c => c instanceof __1.EnergyCard);
                cardList.moveCardsTo(cards, player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
            return state;
        }
        return state;
    }
}
exports.BiancasDevotion = BiancasDevotion;
