"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Powered Ball',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'PAR';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
