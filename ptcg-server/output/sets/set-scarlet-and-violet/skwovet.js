"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skwovet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Skwovet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Nest Stash',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may shuffle your hand and put ' +
                    'it on the bottom of your deck. If you put any cards on the ' +
                    'bottom of your deck in this way, draw a card.'
            }];
        this.attacks = [{
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'SVI';
        this.name = 'Skwovet';
        this.fullName = 'Skwovet SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            // Create deckTop and move hand into it
            const deckTop = new game_1.CardList();
            player.hand.moveTo(deckTop, cards.length);
            // Later, move deckTop to player's deck
            deckTop.moveTo(player.deck, cards.length);
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Skwovet = Skwovet;
