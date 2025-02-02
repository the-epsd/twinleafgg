"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haunter = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Haunter extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gastly';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Super Poison Breath',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Haunter';
        this.fullName = 'Haunter TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Haunter = Haunter;
