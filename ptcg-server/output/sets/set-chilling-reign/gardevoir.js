"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shining Arcana',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top 2 cards ' +
                    'of your deck and attach any number of basic Energy ' +
                    'cards you find there to your Pokémon in any way you' +
                    'like. Put the other cards into your hand.'
            }];
        this.attacks = [
            {
                name: 'Brainwave',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 30 more damage for each [P] Energy ' +
                    'attached to this Pokémon.'
            }
        ];
        this.set = 'CRE';
        this.set2 = 'chillingreign';
        this.setNumber = '61';
        this.regulationMark = 'E';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir CRE';
        this.FLEET_FOOTED_MARKER = 'FLEET_FOOTED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLEET_FOOTED_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            player.deck.moveTo(temp, 2);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to hand
            if (energyCardsDrawn.length == 0) {
                temp.cards.slice(0, 2).forEach(card => {
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
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                let energyCount = 0;
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => {
                        return cardType === card_types_1.CardType.PSYCHIC;
                    }).length;
                });
                effect.damage += energyCount * 30;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                    if (player instanceof Gardevoir) {
                        player.marker.removeMarker(this.FLEET_FOOTED_MARKER);
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
exports.Gardevoir = Gardevoir;
