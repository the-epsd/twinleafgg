"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownHAND = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const check_effect_1 = require("../../game/store/effect-reducers/check-effect");
const game_effects_1 = require("../../game/store/effects/game-effects");
class UnownHAND extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'HAND',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, and if you have 35 or more cards in your hand, you may use this Ability. If you do, you win this game.'
            }];
        this.attacks = [
            { name: 'Hidden Power', cost: [card_types_1.CardType.PSYCHIC], damage: 10, text: '' }
        ];
        this.set = 'LOT';
        this.setNumber = '91';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Unown';
        this.fullName = 'Unown LOT';
    }
    reduceEffect(store, state, effect) {
        // HAND
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const owner = state.activePlayer;
            if (player.active.getPokemonCard() !== this || player.hand.cards.length < 35) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.hand.cards.length >= 35) {
                if (owner === 0) {
                    state = check_effect_1.endGame(store, state, game_2.GameWinner.PLAYER_1);
                }
                if (owner === 1) {
                    state = check_effect_1.endGame(store, state, game_2.GameWinner.PLAYER_2);
                }
            }
            return state;
        }
        return state;
    }
}
exports.UnownHAND = UnownHAND;
