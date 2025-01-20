"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WyrdeerV = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class WyrdeerV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.COLORLESS;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.hp = 220;
        this.stage = game_1.Stage.BASIC;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Frontier Road',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may move any amount of Energy from your other Pokémon to it.'
            }];
        this.attacks = [{
                name: 'Psyshield Bash',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each Energy attached to this Pokémon.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.name = 'Wyrdeer V';
        this.fullName = 'Wyrdeer V ASR';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = state.players[state.activePlayer];
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
            this.movedToActiveThisTurn = false;
        }
        const cardList = game_1.StateUtils.findCardList(state, this);
        const owner = game_1.StateUtils.findOwner(state, cardList);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            this.movedToActiveThisTurn = false;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            if (this.movedToActiveThisTurn == true) {
                player.marker.addMarker(this.ABILITY_USED_MARKER, this);
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
                const blockedFrom = [];
                const blockedTo = [];
                let hasEnergyOnBench = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList === player.active) {
                        blockedFrom.push(target);
                        return;
                    }
                    blockedTo.push(target);
                    if (cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
                        hasEnergyOnBench = true;
                    }
                });
                if (hasEnergyOnBench === false) {
                    return state;
                }
                return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
                { superType: game_1.SuperType.ENERGY }, { allowCancel: false, blockedTo: blockedTo, blockedFrom: blockedFrom }), transfers => {
                    if (!transfers) {
                        return;
                    }
                    for (const transfer of transfers) {
                        // Can only move energy to the active Pokemon
                        const target = player.active;
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        transfers.forEach(transfer => {
                            source.moveCardTo(transfer.card, target);
                            return state;
                        });
                    }
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let totalDamage = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach(em => {
                    em.provides.forEach(energyType => {
                        if (energyType !== game_1.CardType.ANY) {
                            totalDamage += 40;
                        }
                    });
                });
            });
            effect.damage = totalDamage;
        }
        return state;
    }
}
exports.WyrdeerV = WyrdeerV;
