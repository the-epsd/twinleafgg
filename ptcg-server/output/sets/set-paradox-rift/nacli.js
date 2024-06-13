"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nacli = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Nacli extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Corner',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Nacli';
        this.fullName = 'Nacli PAR';
        this.CORNER_MARKER = 'CORNER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.CORNER_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.CORNER_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.CORNER_MARKER, this);
        }
        return state;
    }
}
exports.Nacli = Nacli;
