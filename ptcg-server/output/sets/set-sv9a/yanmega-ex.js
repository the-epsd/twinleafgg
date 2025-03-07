"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yanmegaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Yanmegaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evovlesFrom = 'Yanma';
        this.cardType = G;
        this.hp = 280;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Buzz Boost',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may search your deck for up to 3 Basic [G] Energy and attach them to this Pokémon. Then, shuffle your deck.'
            }
        ];
        this.attacks = [
            {
                name: 'Jet Cyclone',
                cost: [G, G, G, C],
                damage: 210,
                text: 'Move 3 Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Yanmega ex';
        this.fullName = 'Yanmega ex SV9a';
        this.buzzboost = 0;
        this.BUZZ_BOOST_MARKER = 'BUZZ_BOOST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            this.movedToActiveThisTurn = false;
            this.buzzboost = 0;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.buzzboost = 0;
            this.movedToActiveThisTurn = false;
            console.log('movedToActiveThisTurn = false');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BUZZ_BOOST_MARKER, this)) {
            this.buzzboost = 0;
            effect.player.marker.removeMarker(this.BUZZ_BOOST_MARKER, this);
            console.log('marker cleared');
        }
        const player = state.players[state.activePlayer];
        // Buzz Boost
        if (this.movedToActiveThisTurn == true && player.active.cards[0] == this) {
            this.buzzboost++;
            if (this.buzzboost === 1) {
                if (player.marker.hasMarker(this.BUZZ_BOOST_MARKER, this)) {
                    throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
                }
                state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
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
                        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                            transfers = transfers || [];
                            // cancelled by user
                            if (transfers.length === 0) {
                                return state;
                            }
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                player.deck.moveCardTo(transfer.card, target);
                            }
                        });
                    }
                });
            }
        }
        // Jet Cyclone
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 3, max: 3, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Yanmegaex = Yanmegaex;
