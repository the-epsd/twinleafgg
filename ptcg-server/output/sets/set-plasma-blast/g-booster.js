"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GBooster = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
function* playCard(next, store, state, effect) {
    var _a;
    const player = effect.player;
    const opponent = effect.opponent;
    if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) !== 'Genesect EX') {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
    }
    if (effect.damage > 0) {
        opponent.active.damage += effect.damage;
        const afterDamage = new attack_effects_1.AfterDamageEffect(effect, effect.damage);
        state = store.reduceEffect(state, afterDamage);
    }
    costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    return state;
}
class GBooster extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC, card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'G Booster';
        this.fullName = 'G Booster PLB';
        this.attacks = [{
                name: 'G Booster',
                cost: [G, G, C],
                damage: 200,
                shredAttack: true,
                text: 'Discard 2 Energy attached to this Pokémon. This attack\'s damage isn\'t affected by any effects on the Defending Pokémon.'
            }];
        this.text = 'The Genesect-EX this card is attached to can also use the attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const colorlessReudction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < colorlessReudction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
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
exports.GBooster = GBooster;
