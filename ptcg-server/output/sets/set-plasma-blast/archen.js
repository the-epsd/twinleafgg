"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archen = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Archen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Prehistoric Call',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put this Pokémon on the bottom of your deck.'
            }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'PLB';
        this.name = 'Archen';
        this.fullName = 'Archen PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const card = player.discard.cards.filter(c => c === this)[0];
            player.discard.moveCardTo(card, player.deck);
            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: this.name });
        }
        return state;
    }
}
exports.Archen = Archen;
