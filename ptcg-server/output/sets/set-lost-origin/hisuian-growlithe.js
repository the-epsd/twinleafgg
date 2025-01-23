"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianGrowlithe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HisuianGrowlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Singe',
                cost: [],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'LOR';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'F';
        this.name = 'Hisuian Growlithe';
        this.fullName = 'Hisuian Growlithe LOR';
    }
    reduceEffect(store, state, effect) {
        // Singe
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.HisuianGrowlithe = HisuianGrowlithe;
