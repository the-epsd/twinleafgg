"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Breloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shroomish';
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Spore Ball',
                cost: [G],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Asleep.',
            },
            {
                name: 'Powdery Uppercut',
                cost: [G],
                damage: 130,
                text: 'You can use this attack only if this Pokémon used Spore Ball during your last turn.',
            }
        ];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Breloom';
        this.fullName = 'Breloom BRS';
        this.sporeBallTurn = -10;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            this.sporeBallTurn = state.turn;
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1] && state.turn !== this.sporeBallTurn + 2) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
        }
        return state;
    }
}
exports.Breloom = Breloom;
