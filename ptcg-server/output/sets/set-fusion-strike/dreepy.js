"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dreepy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Dreepy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Infestation',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Dreepy';
        this.fullName = 'Dreepy FST';
        this.INFESTATION_MARKER = 'INFESTATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.INFESTATION_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.INFESTATION_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.INFESTATION_MARKER, this);
        }
        return state;
    }
}
exports.Dreepy = Dreepy;
