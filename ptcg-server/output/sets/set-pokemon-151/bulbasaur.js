"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useLeechSeed(next, store, state, effect) {
    const player = effect.player;
    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 20);
    healTargetEffect.target = player.active;
    state = store.reduceEffect(state, healTargetEffect);
    return state;
}
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            }
        ];
        this.set = '151';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur MEW 001';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useLeechSeed(() => generator.next(), store, state, effect);
        }
        return state;
    }
}
exports.Bulbasaur = Bulbasaur;
