"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Applin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Mini Drain',
                cost: [G],
                damage: 10,
                text: 'Heal 10 damage from this Pokémon.'
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Applin';
        this.fullName = 'Applin SV9a';
    }
    reduceEffect(store, state, effect) {
        // Mini Drain
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const healing = new attack_effects_1.HealTargetEffect(effect, 10);
            healing.target = effect.player.active;
            store.reduceEffect(state, healing);
        }
        return state;
    }
}
exports.Applin = Applin;
