"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruffian = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Ruffian extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.name = 'Ruffian';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.fullName = 'Ruffian SV9';
        this.text = 'Discard a Pokémon Tool and a Special Energy from 1 of your opponent\'s Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            let energyOrToolcard = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.SPECIAL)) {
                    energyOrToolcard = true;
                }
                else if (cardList.cards.some(c => c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.TOOL)) {
                    energyOrToolcard = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!energyOrToolcard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const target = targets[0];
                // removing the tool
                if (target.tool !== undefined) {
                    target.cards.forEach(card => {
                        if (card instanceof game_1.TrainerCard && card.trainerType === game_1.TrainerType.TOOL) {
                            target.moveCardTo(card, opponent.discard);
                            target.tool = undefined;
                            return;
                        }
                    });
                }
                // removing special energies
                let specialEnergies = 0;
                target.cards.forEach(card => {
                    if (card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.SPECIAL) {
                        specialEnergies++;
                    }
                });
                if (specialEnergies > 0) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                        target.moveCardsTo(selected, opponent.discard);
                        player.supporter.moveTo(player.discard);
                    });
                }
                else {
                    player.supporter.moveTo(player.discard);
                }
            });
        }
        return state;
    }
}
exports.Ruffian = Ruffian;
