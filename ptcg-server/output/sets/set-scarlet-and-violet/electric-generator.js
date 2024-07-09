"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectricGenerator = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class ElectricGenerator extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '170';
        this.name = 'Electric Generator';
        this.fullName = 'Electric Generator SVI';
        this.hasLightningPokemonOnBench = false;
        this.text = 'Look at the top 5 cards of your deck and attach up to 2 Lightning Energy cards you find there to your Benched Lightning Pokémon in any way you like. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.bench.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.bench.forEach(benchSpot => {
                var _a;
                if (benchSpot.getPokemonCard() && ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.LIGHTNING) {
                    this.hasLightningPokemonOnBench = true;
                }
            });
            if (!this.hasLightningPokemonOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (this.hasLightningPokemonOnBench) {
                const blocked = [];
                player.bench.forEach(benchSpot => {
                    var _a;
                    if (benchSpot.getPokemonCard() && ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.LIGHTNING) {
                        blocked.push();
                    }
                });
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                player.deck.moveTo(temp, 5);
                // Check if any cards drawn are basic energy
                const energyCardsDrawn = temp.cards.filter(card => {
                    return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Lightning Energy';
                });
                // If no energy cards were drawn, move all cards to deck
                if (energyCardsDrawn.length == 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards), () => {
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.deck);
                            player.supporter.moveCardTo(this, player.discard);
                        });
                        player.supporter.moveCardTo(this, player.discard);
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                            return state;
                        });
                    });
                }
                else {
                    // Attach energy if drawn
                    return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                    game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 0, max: 2, allowCancel: false, blocked }), transfers => {
                        // Attach energy based on prompt selection
                        if (transfers) {
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                temp.moveCardTo(transfer.card, target); // Move card to target
                                player.supporter.moveCardTo(this, player.discard);
                            }
                            temp.cards.forEach(card => {
                                temp.moveCardTo(card, player.deck); // Move remaining cards to deck
                            });
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                                return state;
                            });
                        }
                        player.supporter.moveCardTo(this, player.discard);
                        return state;
                    });
                }
            }
        }
        return state;
    }
}
exports.ElectricGenerator = ElectricGenerator;
