"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryogonal = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cryogonal extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Element Chain',
                cost: [W],
                damage: 0,
                text: 'Look at the top 6 cards of your deck and attach any number of basic Energy cards ' +
                    'you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            },
            { name: 'Icy Snow', cost: [W, C], damage: 30, text: '' }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Cryogonal';
        this.fullName = 'Cryogonal EVS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 6);
            prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, temp.cards);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to deck
            if (energyCardsDrawn.length == 0) {
                prefabs_1.SHUFFLE_CARDS_INTO_DECK(store, state, player, temp.cards);
            }
            else {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 0, max: energyCardsDrawn.length }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        prefabs_1.SHUFFLE_CARDS_INTO_DECK(store, state, player, temp.cards);
                    }
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.Cryogonal = Cryogonal;
