"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accelgor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Accelgor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shelmet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Grass Tornado',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack can be used for [G].'
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Accelgor';
        this.fullName = 'Accelgor FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            console.log('movedToActiveThisTurn = false');
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            if (this.movedToActiveThisTurn) {
                effect.cost = [card_types_1.CardType.GRASS];
            }
        }
        return state;
    }
}
exports.Accelgor = Accelgor;
