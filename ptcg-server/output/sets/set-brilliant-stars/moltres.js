"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Inferno Wings',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: 'If this Pokémon has any damage counters on it, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Moltres';
        this.fullName = 'Moltres BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect.attack === this.attacks[0]) {
            // Check if this Pokemon has any damage
            if (effect.player.active.damage > 0) {
                effect.damage += 70;
            }
            // Make damage ignore weakness
            effect.ignoreWeakness = true;
        }
        return state;
    }
}
exports.Moltres = Moltres;
