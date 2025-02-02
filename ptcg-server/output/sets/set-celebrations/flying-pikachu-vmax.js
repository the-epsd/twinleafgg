"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyingPikachuVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class FlyingPikachuVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Flying Pikachu V';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Max Balloon',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
            }
        ];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Flying Pikachu VMAX';
        this.fullName = 'Flying Pikachu VMAX CEL';
        this.MAX_BALLOON_MARKER = 'MAX_BALLOON_MARKER';
        this.CLEAR_MAX_BALLOON_MARKER = 'CLEAR_MAX_BALLOON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.MAX_BALLOON_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_MAX_BALLOON_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.MAX_BALLOON_MARKER)) {
            const card = effect.source.getPokemonCard();
            const stage = card !== undefined ? card.stage : undefined;
            if (stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_MAX_BALLOON_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_MAX_BALLOON_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.MAX_BALLOON_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.FlyingPikachuVMAX = FlyingPikachuVMAX;
