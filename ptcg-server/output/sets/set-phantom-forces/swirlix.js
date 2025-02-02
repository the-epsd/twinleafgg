"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swirlix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Swirlix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Lick Away',
                cost: [Y],
                damage: 0,
                text: 'Remove all Special Conditions from this Pokémon.'
            },
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'PHF';
        this.name = 'Swirlix';
        this.fullName = 'Swirlix PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
            return state;
        }
        return state;
    }
}
exports.Swirlix = Swirlix;
