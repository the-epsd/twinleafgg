"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
class ForestSealStone extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.useWhenAttached = true;
        this.VSTAR_MARKER = 'VSTAR_MARKER';
        this.powers = [
            {
                name: 'Forest Seal Stone',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may search your deck for up to ' +
                    '2 cards and put them into your hand. Then, shuffle your ' +
                    'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
    }
}
exports.ForestSealStone = ForestSealStone;
// public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
//   if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
//       const player = effect.player;
//       player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
//         if (cardList.tool instanceof ForestSealStone) {
//           card.powers = [{
//             name: 'Forest Seal Stone',
//             powerType: PowerType.ABILITY,
//             text: 'During your turn, you may search your deck for up to ' +
//               '2 cards and put them into your hand. Then, shuffle your ' +
//               'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
//           }];
//         }
//       });
//       player.marker.addMarker(this.VSTAR_MARKER, this);
//       state = store.prompt(state, new ChooseCardsPrompt(
//         player.id,
//         GameMessage.CHOOSE_CARD_TO_HAND,
//         player.deck,
//         {},
//         { min: 0, max: 2, allowCancel: false }
//       ), cards => {
//         player.deck.moveCardsTo(cards, player.hand);
//         state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
//           player.deck.applyOrder(order);
//         });
//         return state;
//       });
//       return state;
//     }
//     return state;
//   }
// }
