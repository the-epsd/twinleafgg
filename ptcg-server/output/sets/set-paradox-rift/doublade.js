"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doublade = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Doublade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Honedge';
        this.attacks = [{
                name: 'Slash',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }, {
                name: 'Slashing Strike',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Doublade';
        this.fullName = 'Doublade PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this)) {
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this);
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this)) {
            effect.player.active.marker.addMarker(game_1.PokemonCardList.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.active.marker.hasMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.active.marker.addMarker(game_1.PokemonCardList.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.Doublade = Doublade;
