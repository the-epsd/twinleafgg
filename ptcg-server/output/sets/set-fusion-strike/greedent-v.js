"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedentV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class GreedentV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 210;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Body Slam',
                cost: [C, C],
                damage: 40,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Nom-Nom-Nom Incisors',
                cost: [C, C, C],
                damage: 120,
                text: 'Draw 3 cards.'
            },
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '217';
        this.name = 'Greedent V';
        this.fullName = 'Greedent V FST';
    }
    reduceEffect(store, state, effect) {
        // Body Slam
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            }));
        }
        // Nom-Nom-Nom Incisors
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            prefabs_1.DRAW_CARDS(player, 3);
        }
        return state;
    }
}
exports.GreedentV = GreedentV;
