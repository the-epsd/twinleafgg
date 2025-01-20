"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Munna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Long-Distance Hypnosis',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may flip a coin. ' +
                    'If heads, your opponent\'s Active Pokemon is now Asleep. ' +
                    'If tails, your Active Pokemon is now Asleep.'
            }];
        this.attacks = [{
                name: 'Psyshot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'BCR';
        this.name = 'Munna';
        this.fullName = 'Munna BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.LONG_DISTANCE_HYPNOSIS_MARKER = 'LONG_DISTANCE_HYPNOSIS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
                else {
                    player.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this)) {
            effect.player.marker.removeMarker(this.LONG_DISTANCE_HYPNOSIS_MARKER, this);
        }
        return state;
    }
}
exports.Munna = Munna;
