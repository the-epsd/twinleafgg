"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KyuremVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class KyuremVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.evolvesFrom = 'Kyurem V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.abilities = [{
                name: 'Glaciated World',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard the top card of your deck. If that card is a [W] Energy card, attach it to 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Max Frost',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 120,
                text: 'You may discard any amount of [W] Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Kyurem V';
        this.fullName = 'Kyurem V LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 1);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy';
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
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: energyCardsDrawn.length }), transfers => {
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.hand); // Move card to hand
                        });
                    }
                });
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, player.active, // Card source is target Pokemon
                { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false }), selected => {
                    const cards = selected || [];
                    if (cards.length > 0) {
                        let totalDiscarded = 0;
                        cards.forEach(target => {
                            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                            discardEnergy.cards = [target];
                            totalDiscarded += discardEnergy.cards.length;
                            effect.damage = (totalDiscarded * 60) + 120;
                            store.reduceEffect(state, discardEnergy);
                        });
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.KyuremVMAX = KyuremVMAX;
