"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chimecho = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Chimecho extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bell of Silence',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Your opponent can\'t play any Pokémon that has an Ability from their hand during their next turn.'
            }];
        this.set = 'CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '43';
        this.name = 'Chimecho';
        this.fullName = 'Chimecho CIN';
        this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard.powers.length > 0) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard.powers.length > 0) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        return state;
    }
}
exports.Chimecho = Chimecho;
