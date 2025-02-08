"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonflameV = void 0;
const game_1 = require("../../game");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TalonflameV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V];
        this.cardType = R;
        this.hp = 190;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Fast Flight',
                cost: [C],
                damage: 0,
                text: 'If you go first, you can use this attack during your first turn. Discard your hand and draw 6 cards.',
            },
            {
                name: 'Bright Wing',
                cost: [R, R, C],
                damage: 160,
                text: 'Discard an Energy from this Pokémon.'
            },
        ];
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Talonflame V';
        this.fullName = 'Talonflame V VIV';
    }
    reduceEffect(store, state, effect) {
        const player = state.players[state.activePlayer];
        if (state.turn == 1 && player.active.cards[0] == this) {
            player.canAttackFirstTurn = true;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (player.canAttackFirstTurn) {
                player.hand.moveTo(player.discard, player.hand.cards.length);
                prefabs_1.DRAW_CARDS(player, 6);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.TalonflameV = TalonflameV;
