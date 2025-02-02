"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giacomo = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Giacomo extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '182';
        this.name = 'Giacomo';
        this.fullName = 'Giacomo PAL';
        this.text = 'Discard a Special Energy from each of your opponent\'s Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let oppSpecialPokemon = 0;
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                    oppSpecialPokemon++;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: oppSpecialPokemon, max: oppSpecialPokemon, allowCancel: false, blocked }), results => {
                targets = results || [];
            });
            if (targets.length === 0) {
                return state;
            }
            const target = targets[0];
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
            });
            if (cards.length > 0) {
                // Discard selected special energy card
                cards.forEach(card => {
                    target.moveCardTo(card, opponent.discard);
                });
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.Giacomo = Giacomo;
