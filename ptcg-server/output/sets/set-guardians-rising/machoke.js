"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machoke = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Machoke extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Machop';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Daunting Pose',
                powerType: __1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks. Your opponent\'s attacks and Abilities can\'t put damage counters on your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Cross Chop',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }];
        this.set = 'GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Machoke';
        this.fullName = 'Machoke GRI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new __1.CoinFlipPrompt(player.id, __1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = __1.StateUtils.findOwner(state, effect.target);
            let isMachoke1InPlay = false;
            targetPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isMachoke1InPlay = true;
                }
            });
            if (!isMachoke1InPlay) {
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
                let isMachoke2InPlay = false;
                targetPlayer.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        isMachoke2InPlay = true;
                    }
                });
                if (!isMachoke2InPlay) {
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
exports.Machoke = Machoke;
