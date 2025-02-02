"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medichamex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Medichamex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meditite';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Chi-Atsu',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put damage counters on your opponent\'s Active Pokémon until its remaining HP is 50.'
            },
            {
                name: 'Yoga Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Medicham ex';
        this.fullName = 'Medicham ex SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const selectedTarget = opponent.active;
            const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
            store.reduceEffect(state, checkHpEffect);
            const totalHp = checkHpEffect.hp;
            let damageAmount = totalHp - 50;
            // Adjust damage if the target already has damage
            const targetDamage = selectedTarget.damage;
            if (targetDamage > 0) {
                damageAmount = Math.max(0, damageAmount - targetDamage);
            }
            if (damageAmount > 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, damageAmount);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
            else if (damageAmount <= 0) {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 0);
                damageEffect.target = selectedTarget;
                store.reduceEffect(state, damageEffect);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Medichamex = Medichamex;
