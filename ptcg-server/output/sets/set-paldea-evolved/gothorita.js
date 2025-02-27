"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gothorita = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gothorita extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gothita';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mind Bend',
                cost: [C],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [P, C],
                damage: 40,
                text: ''
            },
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Gothorita';
        this.fullName = 'Gothorita PAL';
    }
    reduceEffect(store, state, effect) {
        // Mind Bend
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Gothorita = Gothorita;
