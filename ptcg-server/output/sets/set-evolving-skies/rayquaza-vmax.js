"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RayquazaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 210;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Azure Pulse',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard your hand and draw 3 cards.'
            }];
        this.attacks = [
            {
                name: 'Max Burst',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'You may discard any amount of basic [R] Energy or any amount of basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Rayquaza V';
        this.fullName = 'Rayquaza V EVS';
        this.REGAL_STANCE_MARKER = 'REGAL_STANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REGAL_STANCE_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 3);
            player.marker.addMarker(this.REGAL_STANCE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
        }
        return state;
    }
}
exports.RayquazaV = RayquazaV;
