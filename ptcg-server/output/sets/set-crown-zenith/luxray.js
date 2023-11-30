"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.powers = [{
                name: 'Explosiveness',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Tail Snap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'CRZ';
        this.set2 = 'crownzenith';
        this.setNumber = '44';
        this.name = 'Luxray';
        this.fullName = 'Luxray CRZ';
    }
    reduceEffect(store, state, effect) {
        if (state.phase == game_1.GamePhase.SETUP) {
            this.stage = card_types_1.Stage.BASIC;
            return state;
        }
        return state;
    }
}
exports.Luxray = Luxray;
