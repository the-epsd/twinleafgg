"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CornerstoneMaskOgerpon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CornerstoneMaskOgerpon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Rock Dance',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Basic [F] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Mountain Ramming',
                cost: [F, F, C],
                damage: 100,
                text: 'Discard the top card of your opponent\'s deck.'
            },
        ];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Cornerstone Mask Ogerpon';
        this.fullName = 'Cornerstone Mask Ogerpon SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            return prefabs_1.ATTACH_ENERGY_PROMPT(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: game_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 1, allowCancel: false });
        }
        // Knocking Hammer
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
        }
        return state;
    }
}
exports.CornerstoneMaskOgerpon = CornerstoneMaskOgerpon;
