"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fuecoco = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Fuecoco extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 80;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Heat Burn',
                cost: [game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '17';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fuecoco';
        this.fullName = 'Fuecoco SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.BURNED]);
            state = store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Fuecoco = Fuecoco;
