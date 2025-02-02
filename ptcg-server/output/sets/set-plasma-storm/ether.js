"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ether = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Ether extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Ether';
        this.fullName = 'Ether PLS';
        this.text = 'Reveal the top card of your deck. If that card is a basic Energy card, attach it to 1 of your Pokémon. If it is not a basic Energy card, return it to the top of your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 1);
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, temp.cards), () => state);
            // Check if any cards drawn are basic energy
            const isEnergy = temp.cards[0] instanceof game_1.EnergyCard && temp.cards[0].energyType === card_types_1.EnergyType.BASIC;
            if (isEnergy) {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1 }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                });
            }
            else {
                temp.moveToTopOfDestination(player.deck);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            }
            return state;
        }
        return state;
    }
}
exports.Ether = Ether;
