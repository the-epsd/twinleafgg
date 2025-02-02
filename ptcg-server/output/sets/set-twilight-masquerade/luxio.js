"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Luxio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shinx';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Big Bite',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Luxio';
        this.fullName = 'Luxio TWM';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.Luxio = Luxio;
