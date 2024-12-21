"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mareep = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Mareep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.powers = [{
                name: 'Fluffy Pillow',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may leave your opponent\'s Active Pokémon Asleep.',
                useWhenInPlay: true
            }];
        this.set = 'LOT';
        this.fullName = 'Mareep LOT';
        this.name = 'Mareep';
        this.setNumber = '75';
        this.cardImage = 'assets/cardback.png';
        this.FLUFFY_PILLOW_MARKER = 'FLUFFY_PILLOW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FLUFFY_PILLOW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER); // Not active
            }
            player.marker.addMarker(this.FLUFFY_PILLOW_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
        }
        return state;
    }
}
exports.Mareep = Mareep;
