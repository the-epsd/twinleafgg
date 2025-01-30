"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togetic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Togetic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Togepi';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Shared Peace',
                cost: [C],
                damage: 0,
                text: 'Each player draws 3 cards.'
            },
            {
                name: 'Speed Dive',
                cost: [C, C],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Togetic';
        this.fullName = 'Togetic OBF';
    }
    reduceEffect(store, state, effect) {
        // Shared Peace
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.deck.moveTo(player.hand, 3);
            opponent.deck.moveTo(opponent.hand, 3);
        }
        return state;
    }
}
exports.Togetic = Togetic;
