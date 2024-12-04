"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skwovet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Skwovet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
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
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Skwovet';
        this.fullName = 'Skwovet SVI';
        this.NEST_STASH_MARKER = 'NEST_STASH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.NEST_STASH_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cards = player.hand.cards.filter(c => c !== this);
            if (player.marker.hasMarker(this.NEST_STASH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Create deckBottom and move hand into it
            const deckBottom = new game_1.CardList();
            player.hand.moveTo(deckBottom, cards.length);
            // Later, move deckBottom to player's deck
            deckBottom.moveTo(player.deck, cards.length);
            player.marker.addMarker(this.NEST_STASH_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.NEST_STASH_MARKER, this);
        }
        return state;
    }
}
exports.Skwovet = Skwovet;
