"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tsareenaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Tsareenaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Steenee';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Icicle Sole',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Put damage counters on 1 of your opponent\'s Pokémon until its remaining HP is 30.'
            },
            {
                name: 'Trop Kick',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 180,
                text: 'Heal 30 damage from this Pokémon and it recovers from all Special Conditions.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Tsareena ex';
        this.fullName = 'Tsareena ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const selectedTarget = targets[0];
                const checkHpEffect = new check_effects_1.CheckHpEffect(effect.player, selectedTarget);
                store.reduceEffect(state, checkHpEffect);
                const totalHp = checkHpEffect.hp;
                let damageAmount = totalHp - 30;
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
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
        }
        return state;
    }
}
exports.Tsareenaex = Tsareenaex;
