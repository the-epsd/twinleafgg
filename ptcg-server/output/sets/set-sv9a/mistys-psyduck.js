"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysPsyduck = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysPsyduck extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Slapstick Jump',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may discard the bottom card ' +
                    'of your deck. If you do, discard all cards attached to this Pokémon and put it on top of your deck.',
            }];
        this.attacks = [{ name: 'Sprinkle Water', cost: [W], damage: 30, text: '' }];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Misty\'s Psyduck';
        this.fullName = 'Misty\'s Psyduck SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === player.active) {
                new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveCardsTo(prefabs_1.GET_CARDS_ON_BOTTOM_OF_DECK(player, 1), player.discard);
            cardList.cards.forEach(c => {
                if (c !== this)
                    cardList.moveCardTo(c, player.discard);
            });
            cardList.moveToTopOfDestination(player.deck);
        }
        return state;
    }
}
exports.MistysPsyduck = MistysPsyduck;
