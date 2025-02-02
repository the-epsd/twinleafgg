"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archaludonex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Archaludonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duraludon';
        this.cardType = M;
        this.hp = 300;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Energy Attachment',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokemon during your turn, you may attach 2 Basic [M] Energy from your discard pile to your [M] Pokémon in any way you like.'
            }];
        this.attacks = [{
                name: 'Metal Defender',
                cost: [M, M, M],
                damage: 220,
                text: 'During your opponent\'s next turn, this Pokemon has no Weakness.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '130';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archaludon ex';
        this.fullName = 'Archaludon ex SV8';
        this.METAL_DEFENDER_MARKER = 'METAL_DEFENDER_MARKER';
        this.CLEAR_METAL_DEFENDER_MARKER = 'CLEAR_METAL_DEFENDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Metal Energy';
            });
            if (!hasMetalEnergyInDiscard) {
                return state;
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== M) {
                    blocked2.push(target);
                }
            });
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
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, name: 'Metal Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length === 0) {
                            return state;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.METAL_DEFENDER_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (player.active.marker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
                effect.weakness = [];
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_METAL_DEFENDER_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.METAL_DEFENDER_MARKER, this);
            });
        }
        return state;
    }
}
exports.Archaludonex = Archaludonex;
