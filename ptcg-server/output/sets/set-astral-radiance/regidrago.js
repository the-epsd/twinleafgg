"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regidrago = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Regidrago extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 130;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Dragon\'s Hoard',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may draw cards until you have 4 cards in your hand. You can\'t use more than 1 Dragon\'s Hoard Ability each turn.'
            }
        ];
        this.attacks = [
            {
                name: 'Giant Fangs',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Regidrago';
        this.fullName = 'Regidrago ASR';
        this.DRAGONS_HOARD_MARKER = 'DRAGONS_HOARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DRAGONS_HOARD_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGONS_HOARD_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.DRAGONS_HOARD_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.cards[0] !== this || player.hand.cards.length >= 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DRAGONS_HOARD_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.DRAGONS_HOARD_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            if (player.active.getPokemonCard() === this) {
                while (player.hand.cards.length < 4) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            }
        }
        return state;
    }
}
exports.Regidrago = Regidrago;
