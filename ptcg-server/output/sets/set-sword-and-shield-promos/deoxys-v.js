"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeoxysV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DeoxysV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 210;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Psychic',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Power Edge',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: ''
            },
        ];
        this.regulationMark = 'F';
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '266';
        this.name = 'Deoxys V';
        this.fullName = 'Deoxys V SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.DeoxysV = DeoxysV;
