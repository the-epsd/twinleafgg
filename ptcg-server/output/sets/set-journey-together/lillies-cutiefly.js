"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesCutiefly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LilliesCutiefly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.LILLIES];
        this.cardType = P;
        this.hp = 30;
        this.weakness = [{ type: M }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Hold Still',
                cost: [P],
                damage: 0,
                text: 'Heal 10 damage from this Pokémon.'
            }
        ];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Lillie\'s Cutiefly';
        this.fullName = 'Lillie\'s Cutiefly JTG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 10);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        return state;
    }
}
exports.LilliesCutiefly = LilliesCutiefly;
