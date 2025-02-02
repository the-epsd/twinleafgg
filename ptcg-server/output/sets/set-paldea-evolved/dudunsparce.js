"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dudunsparce = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dudunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dunsparce';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Mud-Slap', cost: [C], damage: 30, text: '' },
            {
                name: 'Dig Away Flash',
                cost: [C, C, C, C],
                damage: 100,
                text: 'Your opponent\'s Active Pokémon is now Paralyzed. Shuffle this Pokémon and all attached cards into your deck.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Dudunsparce';
        this.fullName = 'Dudunsparce PAL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
            attack_effects_1.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
        }
        return state;
    }
}
exports.Dudunsparce = Dudunsparce;
