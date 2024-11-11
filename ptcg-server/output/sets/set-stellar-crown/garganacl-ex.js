"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garganaclex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
// SCR Garganacl ex 89 (https://limitlesstcg.com/cards/SCR/89)
class Garganaclex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Naclstack';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 340;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Salty Body',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can\'t be affected by any Special Conditions.'
            }];
        this.attacks = [
            { name: 'Block Hammer', cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 170, text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).' }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garganacl ex';
        this.fullName = 'Garganacl ex SCR';
        this.BLOCK_HAMMER_MARKER = 'BLOCK_HAMMER_MARKER';
        this.CLEAR_BLOCK_HAMMER_MARKER = 'CLEAR_BLOCK_HAMMER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.BLOCK_HAMMER_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this);
        }
        // Salty Body
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                const activeCard = player.active.getPokemonCard();
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
                // checking if the player's active has special conditions or if the active is Garganacl ex with the ability (i swear if they make another garganacl ex with the same ability name but with a different effect)
                if (player.active.specialConditions.length === 0
                    || (activeCard && activeCard.name !== 'Garganacl ex')
                    || (activeCard && activeCard.powers[0] !== this.powers[0])) {
                    return state;
                }
                const conditions = player.active.specialConditions.slice();
                conditions.forEach(condition => {
                    player.active.removeSpecialCondition(condition);
                });
            });
            return state;
        }
        // doing end of turn things with the markers
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_BLOCK_HAMMER_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.BLOCK_HAMMER_MARKER, this);
            });
        }
        // Reduce damage by 60
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (!effect.target.marker.hasMarker(this.BLOCK_HAMMER_MARKER)) {
                return state;
            }
            // It's not this pokemon card
            if (pokemonCard !== this) {
                return state;
            }
            // It's not an attack
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 60;
        }
        return state;
    }
}
exports.Garganaclex = Garganaclex;
