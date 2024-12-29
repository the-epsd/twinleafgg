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
        this.text = 'Look at the top 5 cards of your deck and attach up to 2 Lightning Energy cards you find there to your Benched Lightning Pokémon in any way you like. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let lightningPokemonOnBench = false;
            player.bench.forEach(benchSpot => {
                const card = benchSpot.getPokemonCard();
                if (card && card.cardType === card_types_1.CardType.LIGHTNING) {
                    lightningPokemonOnBench = true;
                }
            });
            if (!lightningPokemonOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.LIGHTNING) {
                    blocked2.push(target);
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
            if (energyCardsDrawn.length === 0) {
                return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards), () => {
                    temp.cards.forEach(card => {
                        player.deck.cards.unshift(card);
                    });
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
            // Attach energy if drawn
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, temp, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2 }), transfers => {
                if (transfers) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        temp.moveCardTo(transfer.card, target);
                    }
                }
                temp.cards.forEach(card => {
                    player.deck.cards.unshift(card);
                });
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.ElectricGenerator = ElectricGenerator;
