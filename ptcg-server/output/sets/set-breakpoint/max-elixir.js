"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxElixir = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MaxElixir extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Max Elixir';
        this.fullName = 'Max Elixir BKP';
        this.text = 'Look at the top 6 cards of your deck and attach a basic Energy card you find there to a Basic Pokémon on your Bench. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 6);
            // Prompt to attach energy if any were drawn
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
            game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1 }), transfers => {
                // Attach energy based on prompt selection
                if (transfers) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        temp.moveCardTo(transfer.card, target); // Move card to target
                        store.log(state, game_1.GameLog.LOG_PLAYER_ATTACHES_CARD, { name: player.name, card: transfer.card.name, pokemon: target.getPokemonCard().name });
                    }
                }
                temp.moveToTopOfDestination(player.deck);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.MaxElixir = MaxElixir;
