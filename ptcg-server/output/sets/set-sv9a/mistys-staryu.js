"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysStaryu = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysStaryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.MISTYS];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'I';
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Bubble Beam',
                cost: [W],
                damage: 20,
                text: 'If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Misty\'s Staryu';
        this.fullName = 'Misty\'s Staryu SV9a';
    }
    reduceEffect(store, state, effect) {
        // Bubble Beam
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.MistysStaryu = MistysStaryu;
