"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GutsyPickaxe = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GutsyPickaxe extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Gutsy Pickaxe';
        this.fullName = 'Gutsy Pickaxe ASR';
        this.text = 'Reveal the top card of your deck. If that card is a [F] Energy card, attach it to 1 of your Benched Pokémon. If it is not a [F] Energy card, put it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 1);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.BASIC && card.name === 'Basic Fighting Energy';
            });
            // If no energy cards were drawn, move all cards to hand
            if (energyCardsDrawn.length == 0) {
                temp.cards.slice(0, 1).forEach(card => {
                    temp.moveCardTo(card, player.hand);
                });
            }
            else {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, allowCancel: false, max: energyCardsDrawn.length }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.hand); // Move card to hand
                            player.supporter.moveCardTo(this, player.discard);
                        });
                        return state;
                    }
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.GutsyPickaxe = GutsyPickaxe;
