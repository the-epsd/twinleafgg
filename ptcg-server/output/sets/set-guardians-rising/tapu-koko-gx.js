"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TapuKokoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 170;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Aero Trail',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may move any number of [L] Energy from your other Pokémon to this Pokémon. If you do, switch this Pokémon with your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Sky-High Claws',
                cost: [L, L, C],
                damage: 130,
                text: ''
            },
            {
                name: 'Tapu Thunder-GX',
                cost: [L, L, C],
                damage: 50,
                damageCalculation: 'x',
                gxAttack: true,
                text: 'This attack does 50 damage times the amount of Energy attached to all of your opponent\'s Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'GRI';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Koko-GX';
        this.fullName = 'Tapu Koko-GX GRI';
    }
    reduceEffect(store, state, effect) {
        // Aero Trail
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const blockedFrom = [];
                    const blockedTo = [];
                    let hasEnergyOnBench = false;
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (card === this) {
                            blockedFrom.push(target);
                            return;
                        }
                        blockedTo.push(target);
                        if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.name === 'Lightning Energy')) {
                            hasEnergyOnBench = true;
                        }
                    });
                    if (hasEnergyOnBench === false) {
                        return state;
                    }
                    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_TO_ACTIVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Lightning Energy' }, { min: 1, allowCancel: false, blockedFrom, blockedTo }), result => {
                        const transfers = result || [];
                        transfers.forEach(transfer => {
                            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                            source.moveCardTo(transfer.card, target);
                        });
                        let bench;
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                            if (card === this && target.slot === game_1.SlotType.BENCH) {
                                bench = cardList;
                            }
                        });
                        if (bench) {
                            player.switchPokemon(bench);
                        }
                    });
                }
            });
        }
        // Tapu Thunder-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                state = store.reduceEffect(state, opponentEnergy);
                opponentEnergy.energyMap.forEach(em => {
                    energies++;
                });
            });
            effect.damage = 50 * energies;
        }
        return state;
    }
}
exports.TapuKokoGX = TapuKokoGX;
