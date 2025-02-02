"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kadabra = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kadabra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Kadabra';
        this.set = 'BS';
        this.fullName = 'Kadabra BS';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Abra';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Recover',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                text: 'Discard 1 {P} Energy attached to Kadabra in order to use this attack. Remove all damage counters from Kadabra.',
                damage: 0
            },
            {
                name: 'Super Psy',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.PSYCHIC, 1);
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, player.active, player.active.damage);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Kadabra = Kadabra;
