"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TapuKokoV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 40,
                text: ''
            },
            {
                name: 'Spiral Thunder',
                cost: [L, L, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each Energy' +
                    'attached to all of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Tapu Koko V';
        this.fullName = 'Tapu Koko V BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = 20 + (energyCount * 40);
        }
        return state;
    }
}
exports.TapuKokoV = TapuKokoV;
