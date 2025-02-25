"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HearthflameMaskOgerpon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HearthflameMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Flame Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [R] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Searing Flame',
                cost: [R, R, C],
                damage: 80,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
        ];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Hearthflame Mask Ogerpon';
        this.fullName = 'Hearthflame Mask Ogerpon SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.ATTACH_ENERGY_PROMPT(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
        return state;
    }
}
exports.HearthflameMaskOgerpon = HearthflameMaskOgerpon;
