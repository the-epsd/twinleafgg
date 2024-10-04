"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxicroak = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Toxicroak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Croagunk';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'More Poison',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Put 2 more damage counters on your opponent\'s Poisoned Pokemon during Pokemon Checkup.'
            }];
        this.attacks = [{
                name: 'Poison Claws',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Poisoned.'
            }];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Toxicroak';
        this.fullName = 'Toxicroak SSH';
        this.POISON_MODIFIER_MARKER = 'POISON_MODIFIER_MARKER';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof BetweenTurnsEffect) {
        //   const player = effect.player;
        //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        //     if (card === this) {
        //       try {
        //         const stub = new PowerEffect(player, {
        //           name: 'test',
        //           powerType: PowerType.ABILITY,
        //           text: ''
        //         }, this);
        //         store.reduceEffect(state, stub);
        //       } catch {
        //         return state;
        //       }
        //       if (this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
        //         return state;
        //       }
        //       const opponent = StateUtils.getOpponent(state, player);
        //       if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        //         opponent.active.poisonDamage += 20;
        //         this.marker.addMarker(this.POISON_MODIFIER_MARKER, this);
        //       }
        //     }
        //   });
        // }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isGarbodorWithToolInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isGarbodorWithToolInPlay = true;
                }
            });
            if (!isGarbodorWithToolInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            opponent.active.poisonDamage += 20;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
                    this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
                    opponent.active.poisonDamage -= 20;
                }
            });
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
                    this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
                    opponent.active.poisonDamage -= 20;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    store.reduceEffect(state, specialCondition);
                }
            });
        }
        return state;
    }
}
exports.Toxicroak = Toxicroak;
