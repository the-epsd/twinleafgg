"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawmo = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pawmo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawmi';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Thunder Shock',
                cost: [L],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            { name: 'Head Bolt', cost: [L, L, C], damage: 70, text: '' },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Pawmo';
        this.fullName = 'Pawmo SVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            return prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (!result)
                    return;
                attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
            });
        }
        return state;
    }
}
exports.Pawmo = Pawmo;
