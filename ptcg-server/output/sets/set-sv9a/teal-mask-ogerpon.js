"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TealMaskOgerpon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TealMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Grass Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Ogre Hammer',
                cost: [G, G, C],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Ogre Hammer.'
            },
        ];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Teal Mask Ogerpon';
        this.fullName = 'Teal Mask Ogerpon SV9a';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.ATTACH_ENERGY_PROMPT(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Grass Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this) || prefabs_1.HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.TealMaskOgerpon = TealMaskOgerpon;
