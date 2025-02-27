"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WellspringMaskOgerpon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class WellspringMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Water Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [W] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Bubble Drain',
                cost: [W, W, C],
                damage: 100,
                text: 'Heal 30 damage from this Pokémon.'
            },
        ];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Wellspring Mask Ogerpon';
        this.fullName = 'Wellspring Mask Ogerpon SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.ATTACH_ENERGY_PROMPT(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(30, effect, store, state);
        }
        return state;
    }
}
exports.WellspringMaskOgerpon = WellspringMaskOgerpon;
