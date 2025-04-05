"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeldeoGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class KeldeoGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_GX];
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Pure Heart',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all effects of attacks, including damage, done to this Pokemon ' +
                    'by your opponent\'s Pokemon-GX or Pokemon-EX.'
            }];
        this.attacks = [
            {
                name: 'Sonic Edge',
                cost: [W, W, C],
                damage: 110,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
            },
            {
                name: 'Resolute Blade-GX',
                cost: [W, W, C],
                damage: 0,
                text: 'This attack does 50 damage for each of your opponent\'s Benched Pokemon. ' +
                    '(You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNM';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Keldeo-GX';
        this.fullName = 'Keldeo-GX UNM';
    }
    reduceEffect(store, state, effect) {
        // Pure Heart: Prevent damage & effects from Pokemon-EX
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (sourceCard &&
                (sourceCard.tags.includes(game_1.CardTag.POKEMON_EX) ||
                    sourceCard.tags.includes(game_1.CardTag.POKEMON_GX))) {
                try {
                    const player = game_1.StateUtils.findOwner(state, effect.target);
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        // Sonic Edge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 110);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
            return state;
        }
        // Resolute Blade-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = effect.opponent;
            prefabs_1.BLOCK_IF_GX_ATTACK_USED(player);
            player.usedGX = true;
            let benchCount = 0;
            opponent.bench.forEach(b => benchCount += b.cards.length > 0 ? 1 : 0);
            effect.damage = 50 * benchCount;
        }
        return state;
    }
}
exports.KeldeoGX = KeldeoGX;
