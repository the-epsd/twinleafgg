"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GScope = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
function* playCard(next, store, state, effect) {
    var _a;
    const player = effect.player;
    if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Genesect EX') {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
    }
    attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(100, effect, store, state);
    return state;
}
class GScope extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC, card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'G Scope';
        this.fullName = 'G Scope PLB';
        this.attacks = [{
                name: 'G Scope',
                cost: [ /*G, G, C*/],
                damage: 0,
                text: 'This attack does 100 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.'
            }];
        this.text = 'The Genesect-EX this card is attached to can also use the attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.name) !== 'Genesect EX') {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const colorlessReudction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < colorlessReudction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            /*if (pokemonCard && 'getDarkReduction' in pokemonCard) {
              const darkReduction = (pokemonCard as DarkCostReducer).getDarkReduction(state);
              for (let i = 0; i < darkReduction && effect.cost.includes(CardType.DARK); i++) {
                const index = effect.cost.indexOf(CardType.DARK);
                if (index !== -1) {
                  effect.cost.splice(index, 1);
                }
              }
            }
            if (pokemonCard && 'getWaterReduction' in pokemonCard) {
              const waterReduction = (pokemonCard as WaterCostReducer).getWaterReduction(state);
              for (let i = 0; i < waterReduction && effect.cost.includes(CardType.WATER); i++) {
                const index = effect.cost.indexOf(CardType.WATER);
                if (index !== -1) {
                  effect.cost.splice(index, 1);
                }
              }
            }*/
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GScope = GScope;
