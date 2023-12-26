"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyukumuku = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Pyukumuku extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Pitch a Pyukumuku',
                useFromHand: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in your hand, you may reveal it and put it on the bottom of your deck. If you do, draw a card. You can\'t use more than 1 Pitch a Pyukumuku Ability each turn.'
            }];
        this.attacks = [{
                name: ' Knuckle Punch',
                cost: [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Pyukumuku';
        this.fullName = 'Pyukumuku FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.name === 'Pitch a Pyukumuku') {
            const player = effect.player;
            const cards = [this];
            const deckBottom = new game_1.CardList();
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardsTo(cards, deckBottom);
            deckBottom.moveTo(player.deck);
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.Pyukumuku = Pyukumuku;
