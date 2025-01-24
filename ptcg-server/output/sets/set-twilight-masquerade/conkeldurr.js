"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conkeldurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Conkeldurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gurdurr';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tantrum',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 80,
                text: 'This Pokémon is now Confused.'
            },
            {
                name: 'Gutsy Swing',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'If this Pokémon is affected by a Special Condition, ignore all Energy in this attack\'s cost.'
            }
        ];
        this.set = 'TWM';
        this.setNumber = '105';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Conkeldurr';
        this.fullName = 'Conkeldurr TWM';
    }
    reduceEffect(store, state, effect) {
        // Tantrum
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            specialCondition.target = player.active;
            return store.reduceEffect(state, specialCondition);
        }
        // Gutsy Swing
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            if (effect.player.active.specialConditions.length > 0) {
                effect.cost = [];
            }
            return state;
        }
        return state;
    }
}
exports.Conkeldurr = Conkeldurr;
