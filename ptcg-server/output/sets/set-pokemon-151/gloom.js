"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gloom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Semi-Blooming Energy',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 3 cards of your deck and attach any number of Basic Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            }];
        this.attacks = [{
                name: 'Drool',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Gloom';
        this.fullName = 'Gloom MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 3);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to deck
            if (energyCardsDrawn.length == 0) {
                temp.cards.slice(0, 3).forEach(card => {
                    temp.moveCardTo(card, player.deck);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
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
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.deck); // Move card to deck
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        });
                    }
                    return state;
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Gloom = Gloom;
