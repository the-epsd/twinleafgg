"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Froslass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.evolvesFrom = 'Snorunt';
        this.attacks = [{
                name: 'Spiteful Sigh',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: 'Put up to 7 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way. '
            },
            {
                name: 'Icy Wind',
                cost: [card_types_1.CardType.WATER],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.set = 'UNM';
        this.setNumber = '38';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Froslass';
        this.fullName = 'Froslass UNM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = attack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
        }
        function* attack(next, store, state, effect) {
            const player = effect.player;
            const maxAllowedDamage = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp + 70 });
            });
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], 90, maxAllowedDamage, { allowCancel: false, allowPlacePartialDamage: true }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                    effect.damage = result.damage * 2;
                }
            });
        }
        return state;
    }
}
exports.Froslass = Froslass;
