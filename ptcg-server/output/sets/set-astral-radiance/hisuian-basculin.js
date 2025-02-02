"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBasculin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianBasculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gather the Crew',
                cost: [],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Hisuian Basculin';
        this.fullName = 'Hisuian Basculin ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
        }
        return state;
    }
}
exports.HisuianBasculin = HisuianBasculin;
