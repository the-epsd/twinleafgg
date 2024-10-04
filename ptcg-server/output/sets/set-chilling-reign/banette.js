"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Banette extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.tags = [game_1.CardTag.SINGLE_STRIKE];
        this.evolvesFrom = 'Shuppet';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Resolute Spite',
                cost: [game_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put up to 7 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
            }, {
                name: 'Eerie Light',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 50,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Banette';
        this.fullName = 'Banette CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = attack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Banette = Banette;
function* attack(next, store, state, effect) {
    const player = effect.player;
    const maxAllowedDamage = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp + 70 });
    });
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], 70, maxAllowedDamage, { allowCancel: false, allowPlacePartialDamage: true }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
            effect.damage = result.damage * 2;
            console.log(effect.damage);
        }
    });
}
