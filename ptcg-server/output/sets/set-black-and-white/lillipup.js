"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lillipup = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lillipup extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pickup',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put an Item card from your discard pile into your hand.'
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.name = 'Lillipup';
        this.fullName = 'Lillipup BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(1, c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM, store, state, effect);
        }
        return state;
    }
}
exports.Lillipup = Lillipup;
// <3
