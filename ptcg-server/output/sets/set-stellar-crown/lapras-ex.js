"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Laprasex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Laprasex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.WATER;
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.hp = 220;
        this.stage = game_1.Stage.BASIC;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Power Splash',
                cost: [game_1.CardType.WATER],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Energy attached to this Pokémon.'
            },
            {
                name: 'Larimar Rain',
                cost: [game_1.CardType.WATER, game_1.CardType.PSYCHIC, game_1.CardType.METAL],
                damage: 0,
                text: 'Look at the top 20 cards of your deck and attach any number of Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Lapras ex';
        this.fullName = 'Lapras ex SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const blockedCards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (!em.provides.includes(game_1.CardType.ANY)) {
                            blockedCards.push(em.card);
                        }
                    });
                    const damagePerEnergy = 40;
                    effect.damage = this.attacks[0].damage + (checkProvidedEnergy.energyMap.length * damagePerEnergy);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            // Create deckBottom and move hand into it
            const deckBottom = new game_1.CardList();
            player.deck.moveTo(temp, 20);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === game_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to deck & shuffle
            if (energyCardsDrawn.length == 0) {
                store.prompt(state, [new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, temp.cards)], () => {
                    temp.cards.forEach(card => {
                        store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            temp.applyOrder(order);
                            temp.moveCardTo(card, deckBottom);
                            deckBottom.applyOrder(order);
                            deckBottom.moveTo(player.deck);
                        });
                        return state;
                    });
                    return state;
                });
            }
            if (energyCardsDrawn.length >= 1) {
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
                            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                temp.applyOrder(order);
                                temp.moveCardTo(card, deckBottom);
                                deckBottom.applyOrder(order);
                                deckBottom.moveTo(player.deck);
                            });
                            return state;
                        });
                    }
                });
            }
            // Shuffle the deck
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                return state;
            });
        }
        return state;
    }
}
exports.Laprasex = Laprasex;
