"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggcute = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_message_1 = require("../../game/game-message");
const game_error_1 = require("../../game/game-error");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Exeggcute extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Propagation',
                useFromDiscard: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is in '
                    + 'your discard pile, you may put this Pokemon into your hand.'
            }];
        this.attacks = [{
                name: 'Seed Bomb',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'PLF';
        this.name = 'Exeggcute';
        this.fullName = 'Exeggcute PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if card is in the discard
            if (player.discard.cards.includes(this) === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                return state;
            }
            player.discard.moveCardTo(this, player.hand);
            return state;
        }
        return state;
    }
}
exports.Exeggcute = Exeggcute;
