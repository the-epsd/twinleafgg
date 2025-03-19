"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Petilil = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Petilil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{
                type: card_types_1.CardType.WATER,
                value: -20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: ''
            }, {
                name: 'Absorb',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Heal 10 damage from this Pokémon.'
            }];
        this.set = 'NVI';
        this.setNumber = '23';
        this.name = 'Petilil';
        this.fullName = 'Petilil NVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const healEffect = new attack_effects_1.HealTargetEffect(effect, 10);
            healEffect.target = player.active;
            return store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Petilil = Petilil;
