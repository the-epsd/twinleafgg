"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Hydreigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Zweilous';
        this.powers = [{
                name: 'Tri Howl',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: ' Once during your turn, you may look at the top 3 cards of your deck and attach any number of Energy cards you find there to your Pokémon in any way you like. Discard the other cards.'
            }];
        this.attacks = [{
                name: 'Dark Cutter',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            }];
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon PAL';
        this.TRI_HOWL_MARKER = 'TRI_HOWL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TRI_HOWL_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TRI_HOWL_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const temp = new game_1.CardList();
            if (player.marker.hasMarker(this.TRI_HOWL_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.deck.moveTo(temp, 3);
            // Check if any cards drawn are basic energy
            const energyCardsDrawn = temp.cards.filter(card => {
                return card instanceof game_1.EnergyCard;
            });
            // If no energy cards were drawn, move all cards to discard
            if (energyCardsDrawn.length == 0) {
                player.marker.addMarker(this.TRI_HOWL_MARKER, this);
                temp.cards.slice(0, 3).forEach(card => {
                    temp.moveCardTo(card, player.discard);
                });
            }
            if (energyCardsDrawn.length > 0) {
                // Prompt to attach energy if any were drawn
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, temp, // Only show drawn energies
                game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: energyCardsDrawn.length, allowCancel: false }), transfers => {
                    //if transfers = 0, put both in hand
                    if (transfers.length === 0) {
                        temp.cards.slice(0, 3).forEach(card => {
                            temp.moveCardTo(card, player.discard);
                            player.marker.addMarker(this.TRI_HOWL_MARKER, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                                }
                            });
                        });
                    }
                    // Attach energy based on prompt selection
                    if (transfers) {
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            temp.moveCardTo(transfer.card, target); // Move card to target
                        }
                        temp.cards.forEach(card => {
                            temp.moveCardTo(card, player.discard); // Move card to hand
                            player.marker.addMarker(this.TRI_HOWL_MARKER, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                                }
                            });
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
