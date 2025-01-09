"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slurpuff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Slurpuff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = Y;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.evolvesFrom = 'Swirlix';
        this.powers = [{
                name: 'Tasting',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may draw a card. If this Pokémon is your Active Pokémon, draw 1 more card.'
            }];
        this.attacks = [{
                name: 'Light Pulse',
                cost: [Y, C, C],
                damage: 60,
                text: 'Prevent all effects of your opponent\'s attacks, except damage, done to this Pokémon during your opponent\'s next turn.'
            }];
        this.set = 'PHF';
        this.name = 'Slurpuff';
        this.fullName = 'Slurpuff PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.TASTING_MARKER = 'TASTING_MARKER';
        this.LIGHT_PULSE_MARKER = 'LIGHT_PULSE_MARKER';
        this.CLEAR_LIGHT_PULSE_MARKER = 'CLEAR_LIGHT_PULSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.LIGHT_PULSE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_LIGHT_PULSE_MARKER, this);
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.marker.hasMarker(this.LIGHT_PULSE_MARKER)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard) {
                // if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
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
                // Allow Weakness & Resistance
                if (effect instanceof attack_effects_1.ApplyWeaknessEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                // Allow damage
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_LIGHT_PULSE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_LIGHT_PULSE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.LIGHT_PULSE_MARKER, this);
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_b) {
                return state;
            }
            if (player.marker.hasMarker(this.TASTING_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const isActive = player.active.getPokemonCard() === this;
            if (isActive) {
                player.deck.moveTo(player.hand, 2);
            }
            else {
                player.deck.moveTo(player.hand, 1);
            }
            player.marker.addMarker(this.TASTING_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TASTING_MARKER);
            return state;
        }
        return state;
    }
}
exports.Slurpuff = Slurpuff;
