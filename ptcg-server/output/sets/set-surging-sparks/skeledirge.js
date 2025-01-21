"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeledirge = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Skeledirge extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Crocalor';
        this.cardType = game_1.CardType.FIRE;
        this.hp = 180;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Unaware',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.) '
            }];
        this.attacks = [{
                name: 'Torcherto',
                cost: [game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 20 more damage for each Benched Pokémon (both yours and your opponent\'s).'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skeledirge';
        this.fullName = 'Skeledirge SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBenched + opponentBenched;
            effect.damage = 60 + totalBenched * 20;
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
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
        return state;
    }
}
exports.Skeledirge = Skeledirge;
