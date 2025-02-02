"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKoko = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TapuKoko extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Summon Lightning',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 [L] Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Prize Count',
                cost: [L, L, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If you have more Prize cards remaining than your opponent, this attack does 90 more damage.',
            },
        ];
        this.set = 'SSP';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Koko';
        this.fullName = 'Tapu Koko SSP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            return prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { cardType: L }, { min: 0, max: 2 });
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.GET_PLAYER_PRIZES(player).length > prefabs_1.GET_PLAYER_PRIZES(opponent).length)
                effect.damage += 90;
        }
        return state;
    }
}
exports.TapuKoko = TapuKoko;
