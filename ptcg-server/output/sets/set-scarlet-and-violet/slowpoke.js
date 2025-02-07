"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowpoke = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Slowpoke extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rest',
                cost: [C],
                damage: 0,
                text: 'This Pokémon is now Asleep. Heal 30 damage from it.',
            },
            { name: 'Headbutt', cost: [W, C], damage: 20, text: '' },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Slowpoke';
        this.fullName = 'Slowpoke SVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList !== effect.source) {
                return state;
            }
            const sleepEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            sleepEffect.target = effect.player.active;
            const healEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healEffect.target = effect.player.active;
            state = store.reduceEffect(state, sleepEffect);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Slowpoke = Slowpoke;
