"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pecharunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Pecharunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 80;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.powers = [{
                name: 'Toxic Subjugation',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, put 5 more damage counters on your opponent\'s'
                    + ' Poisoned Pokémon during Pokémon Checkup.'
            }];
        this.attacks = [{
                name: 'Poison Chain',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.During your opponent\'s next turn, that Pokémon can\'t retreat.'
            }];
        this.regulationMark = 'H';
        this.set = 'SVP';
        this.name = 'Pecharunt';
        this.fullName = 'Pecharunt SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    // private POISON_BOOST_MARKER = 'POISON_BOOST_MARKER';
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const currentPlayer = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, currentPlayer);
            let pecharuntOwner = null;
            [currentPlayer, opponent].forEach(player => {
                if (player.active.cards[0] === this) {
                    pecharuntOwner = player;
                }
            });
            if (!pecharuntOwner) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(pecharuntOwner, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const pecharuntOpponent = game_1.StateUtils.getOpponent(state, pecharuntOwner);
            if (effect.player === pecharuntOpponent && pecharuntOpponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                effect.poisonDamage += 50;
                console.log('pecharunt:', effect.poisonDamage);
            }
        }
        // if (effect instanceof BetweenTurnsEffect) {
        //   const currentPlayer = effect.player;
        //   const opponent = StateUtils.getOpponent(state, currentPlayer);
        //   // Check if Pecharunt is in play for either player
        //   let pecharuntOwner = null;
        //   [currentPlayer, opponent].forEach(player => {
        //     if (player.active.cards[0] === this) {
        //       pecharuntOwner = player;
        //     }
        //   });
        //   if (!pecharuntOwner) {
        //     return state; // Pecharunt is not active for either player
        //   }
        //   try {
        //     const stub = new PowerEffect(pecharuntOwner, {
        //       name: 'test',
        //       powerType: PowerType.ABILITY,
        //       text: ''
        //     }, this);
        //     store.reduceEffect(state, stub);
        //   } catch {
        //     return state;
        //   }
        //   if (this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
        //     return state;
        //   }
        //   const pecharuntOpponent = StateUtils.getOpponent(state, pecharuntOwner);
        //   if (pecharuntOpponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        //     pecharuntOpponent.active.poisonDamage += 50;
        //     this.marker.addMarker(this.POISON_MODIFIER_MARKER, this);
        //   }
        // }
        // if (effect instanceof BeginTurnEffect) {
        //   const player = effect.player;
        //   const opponent = StateUtils.getOpponent(state, player);
        //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        //     if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
        //       this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
        //       opponent.active.poisonDamage -= 50;
        //     }
        //   });
        // }
        // if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
        //   const player = effect.player;
        //   const opponent = StateUtils.getOpponent(state, player);
        //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        //     if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
        //       this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
        //       opponent.active.poisonDamage -= 50;
        //     }
        //   });
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.Pecharunt = Pecharunt;
