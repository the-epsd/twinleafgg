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
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.regulationMark = 'E';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir CRE';
        this.SHINING_ARCANA_MARKER = 'SHINING_ARCANA_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SHINING_ARCANA_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SHINING_ARCANA_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.SHINING_ARCANA_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.PSYCHIC || cardType === card_types_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 30;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.marker.hasMarker(this.SHINING_ARCANA_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.deck.moveTo(temp, 2);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC;
            });
            // If no energy cards were drawn, move all cards to hand
            if (energyCardsDrawn.length == 0) {
                player.marker.addMarker(this.SHINING_ARCANA_MARKER, this);
                temp.cards.slice(0, 2).forEach(card => {
                    temp.moveCardTo(card, player.hand);
                });
            }
            if (energyCardsDrawn.length > 0) {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: energyCardsDrawn.length, allowCancel: false }), transfers => {
                    //if transfers = 0, put both in hand
                    if (transfers.length === 0) {
                        temp.cards.slice(0, 2).forEach(card => {
                            temp.moveCardTo(card, player.hand);
                            player.marker.addMarker(this.SHINING_ARCANA_MARKER, this);
                        });
                    }
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.hand); // Move card to hand
                            player.marker.addMarker(this.SHINING_ARCANA_MARKER, this);
                        });
                    }
                });
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Gardevoir = Gardevoir;
