"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginFormePalkiaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class OriginFormePalkiaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rule the Region',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Hydro Break',
                cost: [card_types_1.CardType.WATER],
                damage: 60,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'ASR';
        this.name = 'Origin Forme Palkia V';
        this.fullName = 'Origin Forme Palkia V ASR';
        this.HYDRO_BREAK_MARKER = 'HYDRO_BREAK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Hydro Break
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.active.marker.addMarker(this.HYDRO_BREAK_MARKER, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.active.marker.hasMarker(this.HYDRO_BREAK_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.HYDRO_BREAK_MARKER, this);
        }
        return state;
    }
}
exports.OriginFormePalkiaV = OriginFormePalkiaV;
