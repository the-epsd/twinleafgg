"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnezone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Magnezone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Magneton';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.abilities = [{
                name: 'Giga Magnet',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 6 cards of your deck and attach any number of [M] Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            }];
        this.attacks = [{
                name: 'Power Beam',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Magnezone';
        this.fullName = 'Magnezone ASR';
        this.GIGA_MAGNET_MARKER = 'GIGA_MAGNET_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 6);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Metal Energy';
            });
            // If no energy cards were drawn, move all cards to deck & shuffle
            if (energyCardsDrawn.length == 0) {
                temp.cards.slice(0, 6).forEach(card => {
                    temp.moveCardTo(card, player.deck);
                    store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
            else {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { min: 0, max: energyCardsDrawn.length }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.deck);
                            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
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
exports.Magnezone = Magnezone;
