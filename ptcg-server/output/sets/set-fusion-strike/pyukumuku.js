"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyukumuku = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
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
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Pyukumuku';
        this.fullName = 'Pyukumuku FST';
        this.PYUK_MARKER = 'PYUK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PYUK_MARKER, this)) {
            effect.player.marker.removeMarker(this.PYUK_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.PYUK_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckBottom = new game_1.CardList();
            player.marker.addMarker(this.PYUK_MARKER, this);
            player.hand.moveCardTo(this, deckBottom);
            deckBottom.moveTo(player.deck);
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.Pyukumuku = Pyukumuku;
