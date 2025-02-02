"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Florges = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Florges extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Floette';
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Calming Aroma',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Each of your Pokémon\'s attacks costs [Y] less.'
            }];
        this.attacks = [{
                name: 'Wonder Shine',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.FAIRY, card_types_1.CardType.FAIRY],
                damage: 70,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Florges';
        this.fullName = 'Florges BKT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const index = effect.cost.indexOf(card_types_1.CardType.FAIRY);
            let hasVirizionInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasVirizionInPlay = true;
                }
            });
            if (!hasVirizionInPlay) {
                return state;
            }
            // No cost to reduce
            if (index === -1) {
                return state;
            }
            if (hasVirizionInPlay == true) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FAIRY)) {
                    effect.cost.splice(index, 1);
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Florges = Florges;
