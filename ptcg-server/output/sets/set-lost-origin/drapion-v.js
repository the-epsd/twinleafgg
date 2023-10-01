"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrapionV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DrapionV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wild Style',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost C less for each of your opponent\'s Single Strike, Rapid Strike, and Fusion Strike Pokémon in play.'
            }];
        this.attacks = [
            {
                name: 'Dynamic Tail',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This attack also does 60 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'LOR';
        this.name = 'Drapion V';
        this.fullName = 'Drapion V LOR';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            if (effect instanceof check_effects_1.CheckAttackCostEffect) {
                const player = effect.player;
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                // No cost to reduce
                if (index === -1) {
                    return state;
                }
                let wildStyleCount = 0;
                if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_2.CardTag.FUSION_STRIKE || card_types_2.CardTag.RAPID_STRIKE || card_types_2.CardTag.SINGLE_STRIKE)) {
                    wildStyleCount++;
                }
                player.bench.forEach(benchSpot => {
                    var _a;
                    if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_2.CardTag.FUSION_STRIKE || card_types_2.CardTag.RAPID_STRIKE || card_types_2.CardTag.SINGLE_STRIKE)) {
                        wildStyleCount++;
                    }
                });
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
                store.reduceEffect(state, checkPokemonTypeEffect);
                for (let i = 0; i < wildStyleCount; i++) {
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.DrapionV = DrapionV;
