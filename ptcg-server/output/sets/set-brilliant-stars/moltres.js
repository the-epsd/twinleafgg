"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
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
                damageCalculation: '+',
                text: 'If this Pokémon has any damage counters on it, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
            }];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Moltres';
        this.fullName = 'Moltres BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const source = player.active;
            // Check if source Pokemon has damage
            const damage = source.damage;
            if (damage > 0) {
                effect.damage += 70;
            }
            console.log(effect.damage);
            return state;
        }
        return state;
    }
}
exports.Moltres = Moltres;
