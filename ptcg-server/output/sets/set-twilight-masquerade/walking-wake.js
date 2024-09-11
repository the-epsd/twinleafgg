"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkingWake = void 0;
/* eslint-disable indent */
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class WalkingWake extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Aurora Gain',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Undulating Slice',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put up to 9 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Walking Wake';
        this.fullName = 'Walking Wake TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 20);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = attack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.WalkingWake = WalkingWake;
function* attack(next, store, state, effect) {
    const player = effect.player;
    const maxAllowedDamage = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp + 90 });
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
