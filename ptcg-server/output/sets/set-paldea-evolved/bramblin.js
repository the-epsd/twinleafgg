"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bramblin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Bramblin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Blot',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: ' Heal 10 damage from this Pokémon. '
            }];
        this.set = 'PAL';
        this.setNumber = '23';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Bramblin';
        this.fullName = 'Bramblin PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const target = player.active;
            const healEffect = new game_effects_1.HealEffect(player, target, 10);
            state = store.reduceEffect(state, healEffect);
            return state;
        }
        return state;
    }
}
exports.Bramblin = Bramblin;
