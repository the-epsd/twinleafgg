"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kartana = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kartana extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.attacks = [{
                name: 'Big Cut',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: 'If you have exactly 4 Prize cards remaining, this attack does 120 more damage.'
            },
            {
                name: 'False Swipe',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: ' Flip a coin. If heads, put damage counters on your opponent\'s Active Pokémon until its remaining HP is 10. '
            }];
        this.set = 'UNB';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kartana';
        this.fullName = 'Kartana UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.getPrizeLeft() === 4) {
                effect.damage += 120;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, opponent.active);
                    store.reduceEffect(state, checkHpEffect);
                    const totalHp = checkHpEffect.hp;
                    let damageAmount = totalHp - 10;
                    // Adjust damage if the target already has damage
                    const targetDamage = opponent.active.damage;
                    if (targetDamage > 0) {
                        damageAmount = Math.max(0, damageAmount - targetDamage);
                    }
                    if (damageAmount > 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, damageAmount);
                        damageEffect.target = opponent.active;
                        store.reduceEffect(state, damageEffect);
                    }
                    else if (damageAmount <= 0) {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 0);
                        damageEffect.target = opponent.active;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Kartana = Kartana;
