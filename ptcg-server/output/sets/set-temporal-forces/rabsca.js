"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rabsca = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Rabsca extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rellor';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Spherical Shield',
                powerType: __1.PowerType.ABILITY,
                text: 'Prevent all damage from and effects of attacks done to your Benched Pokémon by attacks from your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Psychic',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Rabsca';
        this.fullName = 'Rabsca TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 30;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = __1.StateUtils.findOwner(state, effect.target);
            let isRabsca1InPlay = false;
            targetPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isRabsca1InPlay = true;
                }
            });
            if (!isRabsca1InPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: __1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.preventDefault = true;
        }
        if (effect instanceof attack_effects_1.PutCountersEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = __1.StateUtils.findOwner(state, effect.target);
            if (opponent.active) {
                let isRabsca2InPlay = false;
                targetPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        isRabsca2InPlay = true;
                    }
                });
                if (!isRabsca2InPlay) {
                    return state;
                }
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: __1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_b) {
                    return state;
                }
                effect.preventDefault = true;
            }
            return state;
        }
        return state;
    }
}
exports.Rabsca = Rabsca;
