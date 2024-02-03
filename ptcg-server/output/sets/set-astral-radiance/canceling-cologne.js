"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelingCologne = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CancelingCologne extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Canceling Cologne';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.fullName = 'Canceling Cologne ASR';
        this.text = 'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';
        this.CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (list, card) => {
                if (opponent.active) {
                    if (effect instanceof game_effects_1.PowerEffect && __1.StateUtils.getOpponent(state, player)) {
                        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
                    }
                    return state;
                }
            });
            return state;
        }
        return state;
    }
}
exports.CancelingCologne = CancelingCologne;
//       const player = effect.player;
//       const opponent = StateUtils.getOpponent(state, player);
//       opponent.marker.addMarker(this.CANCELING_COLOGNE_MARKER, this);
//       if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER, this)) {
//         opponent.active.getPokemons().forEach(pokemon => {
//         //   pokemon.powers.pop();
//           if (effect instanceof PowerEffect) {
//             throw new GameError(GameMessage.CANNOT_USE_POWER);
//           }
//         });
//         if (effect instanceof EndTurnEffect && opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER, this)) {
//           opponent.marker.removeMarker(this.CANCELING_COLOGNE_MARKER, this);
//           console.log('marker cleared');
//         }
//         return state;
//       }
//       return state;
//     }
//     return state;
//   }
// }
