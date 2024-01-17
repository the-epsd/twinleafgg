"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Durant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Durant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Vise Grip',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: ''
            },
            {
                name: 'Devour',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'For each of your Durant in play, discard the top card of ' +
                    'your opponent\'s deck.'
            },
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Durant';
        this.fullName = 'Durant BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let durantsInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.name === this.name) {
                    durantsInPlay++;
                }
            });
            opponent.deck.moveTo(opponent.discard, durantsInPlay);
        }
        return state;
    }
}
exports.Durant = Durant;
