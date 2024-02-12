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
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Devour',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'For each of your Durant in play, discard the top card of your ' +
                    'opponent\'s deck.'
            },
            {
                name: 'Vice Grip',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
        ];
        this.set = 'NVI';
        this.name = 'Durant';
        this.fullName = 'Durant NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
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
