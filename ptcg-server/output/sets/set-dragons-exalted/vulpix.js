"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vulpix = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vulpix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 60;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Singe', cost: [R], damage: 0, text: 'The Defending Pokémon is now Burned.' },
        ];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Vulpix';
        this.fullName = 'Vulpix DRX';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
        return state;
    }
}
exports.Vulpix = Vulpix;
