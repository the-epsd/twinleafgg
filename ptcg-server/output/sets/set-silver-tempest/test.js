"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 500;
        this.weakness = [];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Star Collection',
                cost: [],
                damage: 100,
                text: 'If your opponent\'s Active Pokémon has an Ability, draw 1 card.'
            }
        ];
        this.set = 'TST';
        this.cardImage = 'assets/jirachi-test.png';
        this.setNumber = '1';
        this.name = 'Jirachi TEST';
        this.fullName = 'Jirachi TEST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active) {
                const opponentActive = opponent.active.getPokemonCard();
                if (opponentActive && opponentActive.powers.length > 0) {
                    player.deck.moveTo(player.hand, 1);
                }
            }
            return state;
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
